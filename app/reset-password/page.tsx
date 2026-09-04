"use client";

import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { ApiError, resetPassword } from "@/app/lib/api";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const phone = searchParams.get("phone") || "";
  const code = searchParams.get("code") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const isStrongPassword =
    passwordChecks.length &&
    passwordChecks.uppercase &&
    passwordChecks.number &&
    passwordChecks.special;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) return;

    setError("");

    if (!phone) {
      setError(
        "Your password reset session is invalid. Please start the recovery process again.",
      );
      return;
    }

    if (!code || !/^\d{6}$/.test(code)) {
      setError("Your OTP is missing or invalid. Please request a new OTP.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }

    if (!isStrongPassword) {
      setError(
        "Password must contain at least 8 characters, one uppercase letter, one number and one special character.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await resetPassword({
        phone,
        code,
        newPassword: password,
      });

      if (!response.success) {
        throw new Error(
          response.message || "Password reset was not completed.",
        );
      }

      router.replace("/login?reset=success");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 400) {
          setError(
            err.message ||
              "The OTP is invalid or expired. Please request a new OTP.",
          );
        } else if (err.status === 429) {
          setError("Too many attempts. Please wait and try again.");
        } else {
          setError(
            err.message || "Unable to reset your password. Please try again.",
          );
        }
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while resetting your password.",
        );
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
            Create a new{" "}
            <span className="text-indigo-600">secure password.</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-gray-600">
            Choose a strong password to protect your PhoneBhai account and keep
            your account secure.
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
                Your password is securely updated after verification.
              </p>
            </div>
          </div>
        </div>

        {/* FORM SIDE */}

        <div className="mx-auto w-full max-w-md">
          {/* MOBILE HEADER */}

          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white">
              <Smartphone size={21} />
            </div>

            <h1 className="text-3xl font-black tracking-tight text-gray-950">
              Reset password
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Create a new password for your account.
            </p>
          </div>

          {/* CARD */}

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-8">
            {/* HEADER */}

            <div className="mb-7">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
                <LockKeyhole size={20} className="text-indigo-600" />
              </div>

              <h2 className="text-2xl font-black tracking-tight text-gray-950">
                Set new password
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Enter a new password for your PhoneBhai account.
              </p>
            </div>

            {/* ERROR */}

            {error && (
              <div
                role="alert"
                className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold leading-5 text-red-600"
              >
                {error}
              </div>
            )}

            {/* FORM */}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* NEW PASSWORD */}

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  New password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:bg-gray-50"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    disabled={loading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* PASSWORD REQUIREMENTS */}

              {password.length > 0 && (
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="mb-3 text-xs font-bold text-gray-700">
                    Password requirements
                  </p>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <PasswordCheck
                      valid={passwordChecks.length}
                      text="At least 8 characters"
                    />

                    <PasswordCheck
                      valid={passwordChecks.uppercase}
                      text="One uppercase letter"
                    />

                    <PasswordCheck
                      valid={passwordChecks.number}
                      text="One number"
                    />

                    <PasswordCheck
                      valid={passwordChecks.special}
                      text="One special character"
                    />
                  </div>
                </div>
              )}

              {/* CONFIRM PASSWORD */}

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Confirm new password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    disabled={loading}
                    className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:bg-gray-50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((current) => !current)
                    }
                    disabled={loading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Updating password..." : "Update password"}

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

/* PASSWORD CHECK */

function PasswordCheck({ valid, text }: { valid: boolean; text: string }) {
  return (
    <div
      className={`flex items-center gap-2 text-[11px] font-semibold ${
        valid ? "text-green-600" : "text-gray-400"
      }`}
    >
      <div
        className={`flex h-4 w-4 items-center justify-center rounded-full ${
          valid ? "bg-green-100" : "bg-gray-200"
        }`}
      >
        {valid && <Check size={10} />}
      </div>

      {text}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-gray-50 px-5">
          <div className="text-sm font-semibold text-gray-500">
            Loading...
          </div>
        </main>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
