
"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { forgotPassword, ApiError } from "@/app/lib/api";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const normalizedPhone = phone.replace(/\D/g, "");

    if (!/^[6-9]\d{9}$/.test(normalizedPhone)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await forgotPassword(normalizedPhone);

      router.push(
        `/verify-user?mode=reset&phone=${encodeURIComponent(normalizedPhone)}`,
      );
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Unable to send OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-72px)] bg-gradient-to-br from-gray-50 via-white to-indigo-50/40 px-5 py-12 sm:py-16">
      <div className="mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-2">
        {/* LEFT SIDE */}

        <div className="hidden lg:block">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white shadow-lg">
            <Smartphone size={25} />
          </div>

          <h1 className="max-w-lg text-5xl font-black leading-[1.05] tracking-[-0.04em] text-gray-950">
            Get back to your{" "}
            <span className="text-indigo-600">PhoneBhai account</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-gray-600">
            Forgot your password? Enter your registered phone number and
            we&apos;ll send you a secure OTP to reset your password.
          </p>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
              <ShieldCheck size={21} className="text-green-600" />
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900">
                Secure password recovery
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Your account security is our priority.
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}

        <div className="mx-auto w-full max-w-md">
          {/* MOBILE HEADER */}

          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white">
              <Smartphone size={21} />
            </div>

            <h1 className="text-3xl font-black tracking-tight text-gray-950">
              Forgot password?
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              We&apos;ll help you get back into your account.
            </p>
          </div>

          {/* CARD */}

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-8">
            <div className="mb-7">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
                <Smartphone size={20} className="text-indigo-600" />
              </div>

              <h2 className="text-2xl font-black tracking-tight text-gray-950">
                Reset your password
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Enter the phone number registered with your PhoneBhai
                account. We&apos;ll send you a 6-digit OTP to continue.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* PHONE */}

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Registered phone number
                </label>

                <div className="flex h-12 w-full overflow-hidden rounded-xl border border-gray-200 bg-white transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10">
                  <span className="flex items-center border-r border-gray-200 bg-gray-50 px-3 text-sm font-semibold text-gray-600">
                    +91
                  </span>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    required
                    value={phone}
                    onChange={(e) => {
                      setError("");
                      setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                    }}
                    className="h-full min-w-0 flex-1 px-4 text-sm text-gray-900 outline-none placeholder:text-gray-400"
                  />
                </div>

                {error && (
                  <p className="mt-2 text-sm font-medium text-red-600">
                    {error}
                  </p>
                )}
              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
              >
                {loading ? "Sending OTP..." : "Send OTP"}

                {!loading && (
                  <ArrowRight
                    size={17}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            {/* BACK TO LOGIN */}

            <div className="mt-7 border-t border-gray-100 pt-6">
              <Link
                href="/login"
                className="group flex items-center justify-center gap-2 text-sm font-bold text-gray-600 transition hover:text-indigo-600"
              >
                <ArrowLeft
                  size={16}
                  className="transition-transform group-hover:-translate-x-1"
                />
                Back to login
              </Link>
            </div>
          </div>

          {/* SECURITY */}

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
            <ShieldCheck size={14} />
            Secure PhoneBhai account recovery
          </div>
        </div>
      </div>
    </main>
  );
}
