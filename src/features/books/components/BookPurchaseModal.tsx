"use client";

import { publicApi, usePublicUser, type PublicAuthUser } from "@/lib/api";
import { AlertCircle, CheckCircle2, Loader2, Phone, X } from "lucide-react";
import { useState } from "react";
import AuthModal from "@/features/auth/components/AuthModal";

interface Props {
  open: boolean;
  onClose: () => void;
  book: { id: string; title: string; author: string; price?: string };
}

export default function BookPurchaseModal({ open, onClose, book }: Props) {
  const { data: meData } = usePublicUser();
  const user = meData?.user ?? null;
  const [authOpen, setAuthOpen] = useState(false);

  if (!open) return null;

  if (!user) {
    return (
      <>
        <AuthModal
          open={authOpen}
          onClose={() => setAuthOpen(false)}
          title="Sign in to purchase this book"
        />
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-linear-to-r from-[#1a3a68] to-primary px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Buy &amp; Read</h3>
                  <p className="text-xs text-white/70">{book.title}</p>
                </div>
                <button
                  onClick={onClose}
                  className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg bg-white/20 text-white hover:bg-white/30"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <button
                onClick={() => setAuthOpen(true)}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:bg-primary-dark"
              >
                Sign in to continue
              </button>
              <p className="mt-3 text-center text-xs text-ink-soft">
                You need an account to purchase and read this book.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return <BuyForm book={book} user={user} onClose={onClose} />;
}

function BuyForm({
  book,
  user,
  onClose,
}: {
  book: Props["book"];
  user: PublicAuthUser;
  onClose: () => void;
}) {
  const [fullName, setFullName] = useState(user.name || "");
  const [mobile, setMobile] = useState(user.mobile || "");
  const [email, setEmail] = useState(user.email || "");
  const [paymentMethod, setPaymentMethod] = useState<"bKash" | "Nagad">("bKash");
  const [senderNumber, setSenderNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [amount, setAmount] = useState(book.price || "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const close = () => {
    if (submitting) return;
    onClose();
  };

  const handleSubmit = async () => {
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!/^01[3-9]\d{8}$/.test(mobile.trim())) {
      setError("Enter a valid mobile number (e.g. 017XXXXXXXX).");
      return;
    }
    if (!/^01[3-9]\d{8}$/.test(senderNumber.trim())) {
      setError("Enter the valid sender mobile number used for payment.");
      return;
    }
    if (!transactionId.trim()) {
      setError("Transaction ID is required.");
      return;
    }
    if (!amount || !(Number(amount) > 0)) {
      setError("Enter a valid amount.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await publicApi.purchaseBook({
        fullName: fullName.trim(),
        mobile: mobile.trim(),
        email: email.trim(),
        bookId: book.id,
        bookTitle: book.title,
        paymentMethod,
        senderNumber: senderNumber.trim(),
        transactionId: transactionId.trim(),
        amount: amount.trim(),
      });
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border-2 border-ink/10 bg-cream px-4 py-2.5 text-sm text-ink outline-none transition-all placeholder:text-ink-soft/40 focus:border-primary focus:ring-4 focus:ring-primary/10";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={close}
    >
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-linear-to-r from-[#1a3a68] to-primary px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">
                {done ? "Payment Submitted" : "Buy & Read"}
              </h3>
              <p className="text-xs text-white/70">{book.title}</p>
            </div>
            {!submitting && (
              <button
                onClick={close}
                className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg bg-white/20 text-white hover:bg-white/30"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {done ? (
          <div className="flex flex-col items-center gap-3 p-8 text-center">
            <CheckCircle2 className="h-14 w-14 text-primary" />
            <h4 className="text-lg font-bold text-ink">Thank you!</h4>
            <p className="text-sm text-ink-soft">
              Your payment submission is <b>pending verification</b>. Once our
              admin verifies the transaction, the book will be unlocked in your
              account automatically.
            </p>
            <p className="rounded-xl bg-cream px-4 py-2 text-xs text-ink-soft">
              Payment Method: {paymentMethod} · Transaction ID: {transactionId}
            </p>
            <button
              onClick={close}
              className="mt-2 cursor-pointer rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-4">
                  <div className="rounded-xl border border-primary/30 bg-primary-lighter px-4 py-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-ink">
                        {book.title}
                      </span>
                      <span className="font-bold text-primary">
                        ৳{book.price || "—"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-ink-soft">
                      Signed in as {user.name}. After payment, this book will be
                      added to your library once verified.
                    </p>
                  </div>

                  {error && (
                    <div className="flex items-start gap-2 rounded-xl border border-secondary/30 bg-secondary-light px-3 py-2.5 text-sm text-secondary">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-ink-soft">
                        Full Name
                      </label>
                      <input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-ink-soft">
                        Mobile Number
                      </label>
                      <input
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-ink-soft">
                      Email (optional)
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-ink-soft">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(["bKash", "Nagad"] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => setPaymentMethod(m)}
                          className={`cursor-pointer rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-all ${
                            paymentMethod === m
                              ? "border-primary bg-primary-lighter text-primary"
                              : "border-ink/10 bg-white text-ink-soft"
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl bg-cream px-4 py-3 text-xs text-ink-soft">
                    <p className="flex items-center gap-2 font-semibold text-ink">
                      <Phone className="h-3.5 w-3.5 text-primary" />
                      Send Money details:
                    </p>
                    <p className="mt-1">
                      Send ৳{book.price || "—"} to our {paymentMethod} number
                      (shown on this page), then fill the details below.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-ink-soft">
                        Sender Number
                      </label>
                      <input
                        value={senderNumber}
                        onChange={(e) => setSenderNumber(e.target.value)}
                        placeholder="e.g. 017XXXXXXXX"
                        className={inputCls}
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-ink-soft">
                        Transaction ID
                      </label>
                      <input
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="e.g. 8P7Q2R3A"
                        className={inputCls}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-ink-soft">
                      Amount (৳)
                    </label>
                    <input
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark disabled:opacity-60"
                  >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    Submit for Verification
                  </button>
                  <p className="text-center text-xs text-ink-soft">
                    Your information is kept private and only used for payment
                    verification.
                  </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
