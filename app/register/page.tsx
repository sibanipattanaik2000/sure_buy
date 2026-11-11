"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  ApiError,
  registerUser,
  verifyRegistrationOtp,
} from "@/app/lib/api";
import { useAuth } from "@/app/context/AuthContext";

const OTP_DURATION = 120;

export default function RegisterPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [step, setStep] = useState<"details" | "otp" | "success">("details");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Two-minute OTP countdown
  useEffect(() => {
    if (!expiresAt) {
      setRemainingSeconds(0);
      return;
    }

    const updateTimer = () => {
      const remaining = Math.max(
        0,
        Math.ceil((expiresAt - Date.now()) / 1000),
      );

      setRemainingSeconds(remaining);

      if (remaining === 0) {
        setExpiresAt(null);
      }
    };

    updateTimer();

    const interval = window.setInterval(updateTimer, 250);

    return () => window.clearInterval(interval);
  }, [expiresAt]);

  const startCountdown = () => {
    setRemainingSeconds(OTP_DURATION);
    setExpiresAt(Date.now() + OTP_DURATION * 1000);
  };

  const formattedTime = `${String(
    Math.floor(remainingSeconds / 60),
  ).padStart(2, "0")}:${String(remainingSeconds % 60).padStart(2, "0")}`;

  const getErrorMessage = (err: unknown) => {
    if (err instanceof ApiError) return err.message;
    if (err instanceof Error) return err.message;
    return "Something went wrong. Please try again.";
  };

  const cleanPhone = phone.replace(/\D/g, "").slice(0, 10);

  const handleSendOtp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const name = fullName.trim();

    if (!name) {
      setError("Please enter your full name.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    try {
      setLoading(true);

      await registerUser({
        fullName: name,
        phone: cleanPhone,
      });

      setPhone(cleanPhone);
      setOtp("");
      startCountdown();
      setStep("otp");

      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    const digits = otp.split("");
    digits[index] = digit;

    const nextOtp = digits.join("").slice(0, 6);
    setOtp(nextOtp);

    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    setOtp(pasted);

    const focusIndex = Math.min(pasted.length, 5);
    otpRefs.current[focusIndex]?.focus();
  };

  const handleVerify = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      await verifyRegistrationOtp({
        fullName: fullName.trim(),
        phone: cleanPhone,
        code: otp,
      });

      await refreshUser();

      setExpiresAt(null);
      setRemainingSeconds(0);
      setStep("success");

      setTimeout(() => {
        router.replace("/");
      }, 1200);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resending || loading || remainingSeconds > 0) return;

    setError("");

    try {
      setResending(true);

      await registerUser({
        fullName: fullName.trim(),
        phone: cleanPhone,
      });

      setOtp("");
      startCountdown();

      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setResending(false);
    }
  };

  const handleBack = () => {
    setStep("details");
    setOtp("");
    setError("");
    setExpiresAt(null);
    setRemainingSeconds(0);
  };

  return (
    <main className="min-h-screen bg-white px-4 py-10 text-black sm:px-6">
      <div className="mx-auto flex min-h-[80vh] w-full max-w-md flex-col justify-center">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 self-center text-xl font-black tracking-tight"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-sm font-black text-white">
            PB
          </span>
          PhoneBhai
        </Link>

        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          {step === "details" && (
            <>
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                <Smartphone size={27} />
              </div>

              <h1 className="text-2xl font-bold tracking-tight">
                Create your account
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Enter your name and mobile number to get started with
                PhoneBhai.
              </p>

              <form onSubmit={handleSendOtp} className="mt-7 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Full name
                  </label>
                  <input
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="h-12 w-full rounded-xl border border-gray-300 px-4 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Mobile number
                  </label>

                  <div className="flex h-12 overflow-hidden rounded-xl border border-gray-300 focus-within:border-black">
                    <span className="flex items-center border-r border-gray-200 bg-gray-50 px-4 text-sm font-semibold">
                      +91
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(event) =>
                        setPhone(
                          event.target.value.replace(/\D/g, "").slice(0, 10),
                        )
                      }
                      className="min-w-0 flex-1 px-4 text-sm outline-none"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Sending OTP..." : "Continue"}
                  {!loading && <ArrowRight size={17} />}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-black underline underline-offset-4"
                >
                  Login
                </Link>
              </p>
            </>
          )}

          {step === "otp" && (
            <>
              <button
                type="button"
                onClick={handleBack}
                className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-black"
              >
                <ArrowLeft size={16} />
                Change details
              </button>

              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                <ShieldCheck size={27} />
              </div>

              <h1 className="text-2xl font-bold tracking-tight">
                Verify your mobile
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                We sent a 6-digit verification code to{" "}
                <span className="font-semibold text-black">
                  +91 {phone}
                </span>
                .
              </p>

              <form onSubmit={handleVerify} className="mt-7 space-y-6">
                <div>
                  <label className="mb-3 block text-sm font-semibold">
                    Enter OTP
                  </label>

                  <div className="flex justify-between gap-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <input
                        key={index}
                        ref={(element) => {
                          otpRefs.current[index] = element;
                        }}
                        type="text"
                        inputMode="numeric"
                        autoComplete={index === 0 ? "one-time-code" : "off"}
                        maxLength={1}
                        value={otp[index] || ""}
                        onChange={(event) =>
                          handleOtpChange(event.target.value, index)
                        }
                        onKeyDown={(event) =>
                          handleOtpKeyDown(event, index)
                        }
                        onPaste={index === 0 ? handleOtpPaste : undefined}
                        className="h-12 min-w-0 flex-1 rounded-xl border border-gray-300 text-center text-lg font-bold outline-none transition focus:border-black focus:ring-2 focus:ring-black/5"
                      />
                    ))}
                  </div>
                </div>

                {error && (
                  <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-black px-5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify & Create Account"}
                  {!loading && <ArrowRight size={17} />}
                </button>
              </form>

              <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500">
                      Your OTP expires in
                    </p>
                    <p
                      className={`mt-1 text-xl font-bold tabular-nums ${
                        remainingSeconds > 0 ? "text-black" : "text-red-600"
                      }`}
                    >
                      {formattedTime}
                    </p>
                  </div>

                  {remainingSeconds > 0 ? (
                    <span className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-gray-500">
                      Wait to resend
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resending || loading}
                      className="inline-flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
                    >
                      <RefreshCw
                        size={14}
                        className={resending ? "animate-spin" : ""}
                      />
                      {resending ? "Sending..." : "Resend OTP"}
                    </button>
                  )}
                </div>

                {remainingSeconds === 0 && (
                  <p className="mt-2 text-xs text-red-600">
                    Your OTP has expired. Request a new OTP to continue.
                  </p>
                )}
              </div>

              <p className="mt-5 text-center text-xs leading-5 text-gray-400">
                Never share your OTP with anyone.
              </p>
            </>
          )}

          {step === "success" && (
            <div className="py-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-green-600">
                <CheckCircle2 size={34} />
              </div>

              <h1 className="text-2xl font-bold">Account created!</h1>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Your mobile number has been verified successfully. Welcome to
                PhoneBhai.
              </p>

              <p className="mt-6 text-sm font-semibold text-gray-700">
                Redirecting you...
              </p>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          By continuing, you agree to PhoneBhai&apos;s terms and policies.
        </p>
      </div>
    </main>
  );
}