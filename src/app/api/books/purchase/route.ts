import { NextRequest, NextResponse } from "next/server";
import { getPublicUserFromRequest } from "@/lib/auth/publicAuth";
import { createDoc, getCollection } from "@/lib/db";
import { BD_MOBILE_PATTERN } from "@/lib/auth/publicAuth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let user = null;
  try {
    user = await getPublicUserFromRequest(req);
  } catch {
    user = null;
  }

  const body = await req.json();
  const fullName = String(body.fullName ?? "").trim();
  const mobile = String(body.mobile ?? "").trim();
  const email = String(body.email ?? "").trim();
  const bookId = String(body.bookId ?? "").trim();
  const bookTitle = String(body.bookTitle ?? "").trim();
  const paymentMethod = String(body.paymentMethod ?? "").trim();
  const senderNumber = String(body.senderNumber ?? "").trim();
  const transactionId = String(body.transactionId ?? "").trim();
  const amount = String(body.amount ?? "").trim();

  if (!fullName) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  if (!BD_MOBILE_PATTERN.test(mobile)) {
    return NextResponse.json(
      { error: "Enter a valid Bangladeshi mobile number (e.g. 017XXXXXXXX)" },
      { status: 400 },
    );
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
  }
  if (!bookId) {
    return NextResponse.json({ error: "Book selection is required" }, { status: 400 });
  }
  if (!["bKash", "Nagad"].includes(paymentMethod)) {
    return NextResponse.json({ error: "Select a valid payment method" }, { status: 400 });
  }
  if (!/^01[3-9]\d{8}$/.test(senderNumber)) {
    return NextResponse.json(
      { error: "Enter a valid sender mobile number" },
      { status: 400 },
    );
  }
  if (!transactionId) {
    return NextResponse.json({ error: "Transaction ID is required" }, { status: 400 });
  }
  if (!amount || !(Number(amount) > 0)) {
    return NextResponse.json({ error: "Enter a valid amount" }, { status: 400 });
  }

  const coll = await getCollection("bookpayments");
  const duplicate = await coll.findOne({
    transactionId,
    senderNumber,
    deletedAt: null,
  });
  if (duplicate) {
    return NextResponse.json(
      { error: "This transaction has already been submitted." },
      { status: 409 },
    );
  }

  const doc = await createDoc("bookpayments", {
    userId: user?.id ?? "",
    fullName,
    mobile,
    email,
    bookId,
    bookTitle,
    paymentMethod,
    senderNumber,
    transactionId,
    amount,
    status: "pending",
  });

  return NextResponse.json(
    { ok: true, message: "Payment submitted. Awaiting verification.", payment: doc },
    { status: 201 },
  );
}
