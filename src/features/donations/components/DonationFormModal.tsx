"use client";

import { publicApi } from "@/lib/api";
import { AlertCircle, CheckCircle2, Heart, Loader2, X } from "lucide-react";
import { useState } from "react";

interface DonationEvent {
  id: string;
  title: string;
  target?: number;
  collected?: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  events: DonationEvent[];
  selectedEvent?: string;
}

export default function DonationFormModal({
  open,
  onClose,
  events,
  selectedEvent = "",
}: Props) {
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [amount, setAmount] = useState("");
  const [eventName, setEventName] = useState(selectedEvent || "General");
  const [paymentMethod, setPaymentMethod] = useState<"bKash" | "Nagad">("bKash");
  const [senderNumber, setSenderNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (!open) return null;

  const close = () => {
    if (submitting) return;
    onClose();
    setError("");
    setDone(false);
    setFullName("");
    setMobile("");
    setAmount("");
    setSenderNumber("");
    setTransactionId("");
    setAnonymous(false);
  };

  const handleSubmit = async () => {
    if (!fullName.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!/^01[3-9]\d{8}$/.test(mobile.trim())) {
      setError("Enter a valid mobile number (e.g. 017XXXXXXXX).");
      return;
    }
    if (!amount || !(Number(amount) > 0)) {
      setError("Enter a valid donation amount.");
      return;
    }
    if (!/^01[3-9]\d{8}$/.test(senderNumber.trim())) {
      setError("Enter a valid sender number.");
      return;
    }
    if (!transactionId.trim()) {
      setError("Transaction ID is required.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await publicApi.donate({
        fullName: fullName.trim(),
        mobile: mobile.trim(),
        amount: amount.trim(),
        eventName,
        paymentMethod,
        senderNumber: senderNumber.trim(),
        transactionId: transactionId.trim(),
        anonymous: anonymous ? "Yes" : "No",
        status: "pending",
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
                {done ? "Donation Submitted" : "Support TechPunno"}
              </h3>
              <p className="text-xs text-white/70">
                💚 Your support makes a difference
              </p>
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
            <h4 className="text-lg font-bold text-ink">Thank you for your support!</h4>
            <p className="text-sm text-ink-soft">
              Your donation is <b>pending verification</b>. Once verified, it will
              be added to the supporter list.
            </p>
            <button
              onClick={close}
              className="mt-2 cursor-pointer rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="max-h-[80vh] space-y-4 overflow-y-auto p-6">
            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-secondary/30 bg-secondary-light px-3 py-2.5 text-sm text-secondary">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink-soft">
                  Name
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
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink-soft">
                  Event
                </label>
                <select
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className={inputCls}
                >
                  <option value="General">General Donation</option>
                  {events.map((e) => (
                    <option key={e.id} value={e.title}>
                      {e.title}
                    </option>
                  ))}
                </select>
              </div>
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
                  className={inputCls}
                />
              </div>
            </div>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-cream px-4 py-3 text-sm">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              <span className="text-ink">
                ☑ Anonymous Donation{" "}
                <span className="text-xs text-ink-soft">
                  (show as &quot;Anonymous Donor&quot; on the website)
                </span>
              </span>
            </label>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-admin py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:shadow-xl disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Heart className="h-4 w-4" />
              )}
              Submit Donation
            </button>
            <p className="text-center text-xs text-ink-soft">
              Your mobile number, transaction ID and payment details will never be
              shown publicly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
