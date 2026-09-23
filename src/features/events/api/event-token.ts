import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/db";
import { events as seedEvents } from "@/features/events/data/events";

export interface EventTokenInfo {
  status: "pending" | "approved" | "rejected";
  tokenId?: string;
  fullName: string;
  fatherName?: string;
  motherName?: string;
  className?: string;
  institution?: string;
  eventId?: string;
  eventTitle: string;
  mobile: string;
  approvedAt?: string;
  amount?: string;
  paymentMethod?: string;
}

const bdMobilePattern = /^(01[3-9]\d{8}|\+8801[3-9]\d{8})$/;

function pickTokenInfo(
  reg: Record<string, unknown>,
  status: string,
): EventTokenInfo {
  const base: EventTokenInfo = {
    status: status as EventTokenInfo["status"],
    tokenId: reg.tokenId ? String(reg.tokenId) : undefined,
    fullName: String(reg.fullName ?? ""),
    fatherName: reg.fatherName ? String(reg.fatherName) : undefined,
    motherName: reg.motherName ? String(reg.motherName) : undefined,
    className: reg.className ? String(reg.className) : undefined,
    institution: reg.institution ? String(reg.institution) : undefined,
    eventId: reg.eventId ? String(reg.eventId) : undefined,
    eventTitle: String(reg.eventTitle ?? ""),
    mobile: String(reg.mobile ?? ""),
    approvedAt: reg.approvedAt ? String(reg.approvedAt) : undefined,
    amount: reg.paymentAmount ? String(reg.paymentAmount) : undefined,
    paymentMethod: reg.paymentMethod ? String(reg.paymentMethod) : undefined,
  };
  if (status !== "approved") {
    delete base.tokenId;
    delete base.fatherName;
    delete base.motherName;
    delete base.approvedAt;
  }
  return base;
}

async function enrichAmount(
  info: EventTokenInfo,
  eventId: string,
): Promise<EventTokenInfo> {
  if (info.amount) return info;
  try {
    const eventsColl = await getCollection("events");
    const ev = (await eventsColl.findOne({
      $or: [{ id: eventId }, { slug: eventId }],
    })) as Record<string, unknown> | null;
    if (ev && ev.regFee) {
      info.amount = String(ev.regFee);
      return info;
    }
  } catch {
    /* fall through to seed */
  }
  const seed = seedEvents.find(
    (e) => String(e.id) === eventId || e.slug === eventId,
  );
  if (seed?.regFee) info.amount = seed.regFee;
  return info;
}

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token")?.trim() ?? "";
    const eventId = req.nextUrl.searchParams.get("eventId")?.trim() ?? "";
    const mobile = req.nextUrl.searchParams.get("mobile")?.trim() ?? "";

    const coll = await getCollection("eventregistrations");

    if (token) {
      const reg = (await coll.findOne({
        tokenId: token,
        deletedAt: null,
      })) as Record<string, unknown> | null;
      if (!reg || String(reg.status ?? "") !== "approved") {
        return NextResponse.json(
          { error: "This token is not valid or has not been issued yet." },
          { status: 404 },
        );
      }
      return NextResponse.json(
        await enrichAmount(pickTokenInfo(reg, "approved"), String(reg.eventId ?? "")),
      );
    }

    if (!eventId || !mobile) {
      return NextResponse.json(
        { error: "eventId and mobile are required" },
        { status: 400 },
      );
    }
    if (!bdMobilePattern.test(mobile)) {
      return NextResponse.json(
        { error: "Enter a valid Bangladeshi mobile number (e.g. 017XXXXXXXX)" },
        { status: 400 },
      );
    }

    const reg = (await coll.findOne({
      eventId,
      mobile,
      deletedAt: null,
    })) as Record<string, unknown> | null;

    if (!reg) {
      return NextResponse.json(
        {
          error:
            "No registration found for this mobile number on this event. Please register for the event first.",
        },
        { status: 404 },
      );
    }

    const status = String(reg.status ?? "pending");
    return NextResponse.json(
      await enrichAmount(
        pickTokenInfo(reg, status),
        String(reg.eventId ?? ""),
      ),
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}