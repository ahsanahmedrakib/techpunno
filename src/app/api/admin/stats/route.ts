import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest, unauthorized } from "@/lib/auth/guard";
import { getMongoClient, getDbName } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const admin = await getAuthUserFromRequest(req);
  if (!admin) return unauthorized();
  try {
    const client = await getMongoClient();
    const db = client.db(getDbName());
    const books = db.collection("books");
    const payments = db.collection("bookpayments");
    const donations = db.collection("donations");
    const publicUsers = db.collection("publicusers");
    const bookFiles = db.collection("bookfiles");

    const [totalBooks, freeBooks, paidBooks, totalPaidRevenue] =
      await Promise.all([
        books.countDocuments({ deletedAt: null }),
        books.countDocuments({ deletedAt: null, isfree: "Free" }),
        books.countDocuments({ deletedAt: null, isfree: "Paid" }),
        payments
          .aggregate([
            {
              $match: { deletedAt: null, status: { $in: ["approved"] } },
            },
            {
              $group: {
                _id: null,
                total: { $sum: { $toDouble: { $ifNull: ["$amount", "0"] } } },
              },
            },
          ])
          .toArray() as Promise<{ _id: null; total: number }[]>,
      ]);

    const [totalPurchases, pendingPayments, totalDonations, approvedDonations, totalPublicUsers, paidBooksWithPdf] =
      await Promise.all([
        payments.countDocuments({ deletedAt: null, status: "approved" }),
        payments.countDocuments({ deletedAt: null, status: "pending" }),
        donations.countDocuments({ deletedAt: null }),
        donations.countDocuments({ deletedAt: null, status: "approved" }),
        publicUsers.countDocuments({ deletedAt: null }),
        books
          .find({ deletedAt: null, isfree: "Paid" })
          .toArray(),
      ]);

    const paidIds = paidBooksWithPdf.map((b) => String(b.id ?? b._id ?? ""));
    let pdfReadyCount = 0;
    if (paidIds.length > 0) {
      pdfReadyCount = await bookFiles.countDocuments({ bookId: { $in: paidIds } });
    }

    return NextResponse.json({
      totalBooks,
      freeBooks,
      paidBooks,
      totalRevenue: totalPaidRevenue[0]?.total ?? 0,
      totalPurchases,
      pendingPayments,
      totalDonations,
      approvedDonations,
      totalPublicUsers,
      paidBooksWithPdf: pdfReadyCount,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Stats error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
