"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Lock, ShieldCheck, User } from "lucide-react";
import { site } from "@/data/site";

function pemToArrayBuffer(pem: string, label: string): ArrayBuffer {
  const body = pem
    .replace(`-----BEGIN ${label}-----`, "")
    .replace(`-----END ${label}-----`, "")
    .replace(/\\+n/g, "")
    .replace(/[\r\n\s]/g, "");
  const binary = atob(body);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function encryptPassword(publicKeyPem: string, password: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "spki",
    pemToArrayBuffer(publicKeyPem, "PUBLIC KEY"),
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["encrypt"],
  );
  const encrypted = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    key,
    new TextEncoder().encode(password),
  );
  return arrayBufferToBase64(encrypted);
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);
    try {
      const keyRes = await fetch("/api/auth/public-key");
      const { publicKey } = (await keyRes.json()) as { publicKey?: string };
      if (!publicKey) throw new Error("Missing server encryption key");
      const encrypted = await encryptPassword(publicKey, password);
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password: encrypted }),
      });
      if (!loginRes.ok) throw new Error("Invalid username or password");
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error && err.message !== "Invalid username or password"
          ? err.message
          : "Invalid username or password",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-4 text-center">
          <span className="relative h-16 w-16 overflow-hidden rounded-2xl shadow-lg shadow-primary/30 ring-1 ring-white/20">
            <Image
              src={site.logo}
              alt={`${site.name} logo`}
              fill
              sizes="64px"
              className="object-cover"
            />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-white">
              {site.name} Admin
            </h1>
            <p className="mt-1 text-sm text-white/50">
              Sign in to manage your content
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl"
        >
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-primary/60">
            <User className="h-5 w-5 shrink-0 text-white/40" />
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              className="w-full bg-transparent text-sm text-white placeholder-white/30 outline-none"
            />
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 focus-within:border-primary/60">
            <Lock className="h-5 w-5 shrink-0 text-white/40" />
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full bg-transparent text-sm text-white placeholder-white/30 outline-none"
            />
          </div>

          {error && (
            <p className="rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-dark px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:brightness-110 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Signing in…
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                Sign in
              </>
            )}
          </button>

          <p className="text-center text-[11px] leading-relaxed text-white/30">
            Your credentials are encrypted end-to-end before leaving this
            browser.
          </p>
        </form>
      </div>
    </div>
  );
}