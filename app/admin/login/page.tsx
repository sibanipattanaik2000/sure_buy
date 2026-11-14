"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, LockKeyhole, Mail, Loader2 } from "lucide-react";

import { apiRequest } from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";

export default function AdminLoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const user = await refreshUser();

      if (!user || user.role !== "ADMIN") {
        setError("This account does not have administrator access.");
        return;
      }

      router.replace("/admin");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#09090b] px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#151518] p-8 shadow-2xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-2xl bg-white p-3 text-black">
            <ShieldCheck size={26} />
          </div>

          <div>
            <h1 className="text-xl font-black text-white">
              PhoneBhai Admin
            </h1>
            <p className="text-sm text-gray-400">
              Secure administrator access
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-300">
              Admin email
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4">
              <Mail size={18} className="text-gray-500" />

              <input
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@phonebhai.com"
                className="w-full bg-transparent py-4 text-sm text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-300">
              Password
            </label>

            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-4">
              <LockKeyhole size={18} className="text-gray-500" />

              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-transparent py-4 text-sm text-white outline-none"
              />
            </div>
          </div>

          {error && (
            <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-4 font-bold text-black transition hover:bg-gray-200 disabled:opacity-50"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {loading ? "Verifying..." : "Secure Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          Restricted access. Administrator accounts only.
        </p>
      </div>
    </main>
  );
}