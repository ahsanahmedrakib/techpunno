"use client";

import { AlertCircle, Loader2, X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { publicApi } from "@/lib/api";

export default function AuthModal({
  open,
  onClose,
  title = "Sign in to continue",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
}) {
  const qc = useQueryClient();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regName, setRegName] = useState("");
  const [regMobile, setRegMobile] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  if (!open) return null;

  const reset = () => {
    setError("");
    setLoginIdentifier("");
    setLoginPassword("");
    setRegName("");
    setRegMobile("");
    setRegEmail("");
    setRegPassword("");
  };

  const close = () => {
    reset();
    onClose();
  };

  const handleLogin = async () => {
    if (!loginIdentifier || !loginPassword) {
      setError("Please enter your mobile/email and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await publicApi.login({
        identifier: loginIdentifier,
        password: loginPassword,
      });
      toast.success("Signed in successfully!");
      await qc.invalidateQueries({ queryKey: ["public-user"] });
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!regName || !regMobile || !regPassword) {
      setError("Name, mobile and password are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await publicApi.register({
        name: regName,
        mobile: regMobile,
        email: regEmail || undefined,
        password: regPassword,
      });
      toast.success("Account created! Please sign in.");
      setMode("login");
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border-2 border-ink/10 bg-cream px-4 py-2.5 text-sm text-ink outline-none transition-all placeholder:text-ink-soft/40 focus:border-primary focus:ring-4 focus:ring-primary/10";

  return createPortal(
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={close}
    >
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-linear-to-r from-[#1a3a68] to-primary px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <button
              onClick={close}
              className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg bg-white/20 text-white hover:bg-white/30"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 flex rounded-xl bg-white/15 p-1">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setError("");
                }}
                className={`flex-1 cursor-pointer rounded-lg py-2 text-sm font-semibold transition-all ${
                  mode === m
                    ? "bg-white text-primary shadow"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {m === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-secondary/30 bg-secondary-light px-3 py-2.5 text-sm text-secondary">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {mode === "login" ? (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink-soft">
                  Mobile Number or Email
                </label>
                <input
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="e.g. 017XXXXXXXX"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink-soft">
                  Password
                </label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className={inputCls}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                />
              </div>
              <button
                onClick={handleLogin}
                disabled={loading}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Sign In
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink-soft">
                  Full Name
                </label>
                <input
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Rahim Uddin"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink-soft">
                  Mobile Number
                </label>
                <input
                  value={regMobile}
                  onChange={(e) => setRegMobile(e.target.value)}
                  placeholder="e.g. 017XXXXXXXX"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink-soft">
                  Email (optional)
                </label>
                <input
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={inputCls}
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink-soft">
                  Password
                </label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className={inputCls}
                  onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                />
              </div>
              <button
                onClick={handleRegister}
                disabled={loading}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Create Account
              </button>
            </div>
          )}

          <p className="mt-4 text-center text-xs text-ink-soft">
            {mode === "login"
              ? "New here? Switch to Create Account to register."
              : "Already have an account? Switch to Sign In."}
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
}
