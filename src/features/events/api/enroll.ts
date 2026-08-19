import { NextRequest, NextResponse } from "next/server";
import { createDoc, getCollection, HttpError } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { eventId?: string; mobile?: string };
    const eventId = body.eventId ? String(body.eventId).trim() : "";
    const mobile = body.mobile ? String(body.mobile).trim() : "";

    if (!eventId || !mobile) {
      return NextResponse.json(
        { error: "eventId and mobile are required" },
        { status: 400 },
      );
    }

    const regColl = await getCollection("eventregistrations");
    const registration = (await regColl.findOne({
      eventId,
      mobile,
      deletedAt: null,
    })) as Record<string, unknown> | null;

    if (!registration) {
      return NextResponse.json(
        {
          error:
            "No registration found for this mobile number on this event. Please register for the event first.",
        },
        { status: 404 },
      );
    }

    if (registration.status === "rejected") {
      return NextResponse.json(
        {
          error:
            "Your event registration was rejected. Please contact the admin.",
        },
        { status: 403 },
      );
    }

    const partColl = await getCollection("eventparticipants");
    const already = (await partColl.findOne({
      eventId,
      mobile,
      deletedAt: null,
    })) as Record<string, unknown> | null;

    if (already) {
      return NextResponse.json(
        {
          error: "You are already added as a participant for this event.",
        },
        { status: 409 },
      );
    }

    const participant = await createDoc("eventparticipants", {
      eventId,
      eventTitle: registration.eventTitle ?? "",
      fullName: registration.fullName ?? "",
      fatherName: registration.fatherName ?? "",
      motherName: registration.motherName ?? "",
      mobile,
      className: registration.className ?? "",
      institution: registration.institution ?? "",
      status: "pending",
    });

    return NextResponse.json(participant, { status: 201 });
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Database error";
    return NextResponse.json({ error: message }, { status });
  }
}
