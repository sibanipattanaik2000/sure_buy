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

export default function VerifyUserPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [timer, setTimer] = useState(30);
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  /* RESEND TIMER */

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  /* HANDLE OTP INPUT */

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];

    newOtp[index] = value.slice(-1);

    setOtp(newOtp);
    setError("");

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /* HANDLE BACKSPACE */

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  /* HANDLE PASTE */

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pastedData) return;

    const newOtp = [...otp];

    pastedData.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);

    const nextIndex = Math.min(pastedData.length, 5);

    inputRefs.current[nextIndex]?.focus();
  };

  /* VERIFY OTP */

  const handleVerify = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    setSuccess(true);

    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  /* RESEND OTP */

  const handleResend = () => {
    if (timer > 0) return;

    setOtp(["", "", "", "", "", ""]);
    setError("");
    setSuccess(false);
    setTimer(30);

    inputRefs.current[0]?.focus();

    // Real resend OTP API will be connected later.
    console.log("OTP resent");
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
            Verify your{" "}
            <span className="text-indigo-600">PhoneBhai account.</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-gray-600">
            We've sent a verification code to your registered contact. Enter the
            code to securely verify your PhoneBhai account.
          </p>

          <div className="mt-10 space-y-5">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
                <ShieldCheck size={21} className="text-indigo-600" />
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900">
                  Secure verification
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Your account verification is protected.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
                <CheckCircle2 size={21} className="text-green-600" />
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900">Almost there</p>

                <p className="mt-1 text-xs text-gray-500">
                  Verify once and start using PhoneBhai.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* VERIFICATION CARD */}

        <div className="mx-auto w-full max-w-md">
          {/* MOBILE HEADER */}

          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white">
              <Smartphone size={21} />
            </div>

            <h1 className="text-3xl font-black tracking-tight text-gray-950">
              Verify your account
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Enter the verification code to continue.
            </p>
          </div>

          {/* CARD */}

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-8">
            {!success ? (
              <>
                {/* CARD HEADER */}

                <div className="mb-8 text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
                    <ShieldCheck size={25} className="text-indigo-600" />
                  </div>

                  <h2 className="text-2xl font-black tracking-tight text-gray-950">
                    Enter verification code
                  </h2>

                  <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500">
                    Enter the 6-digit verification code sent to your registered
                    mobile number.
                  </p>
                </div>

                {/* FORM */}

                <form onSubmit={handleVerify}>
                  {/* OTP BOXES */}

                  <div className="flex justify-center gap-2 sm:gap-3">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(element) => {
                          inputRefs.current[index] = element;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        aria-label={`OTP digit ${index + 1}`}
                        className={`h-12 w-11 rounded-xl border bg-white text-center text-lg font-bold text-gray-900 outline-none transition sm:h-14 sm:w-12 ${
                          error
                            ? "border-red-400 focus:ring-4 focus:ring-red-500/10"
                            : "border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                        }`}
                      />
                    ))}
                  </div>

                  {/* ERROR */}

                  {error && (
                    <p className="mt-4 text-center text-xs font-semibold text-red-500">
                      {error}
                    </p>
                  )}

                  {/* VERIFY BUTTON */}

                  <button
                    type="submit"
                    className="group mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20"
                  >
                    Verify account
                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>
                </form>

                {/* RESEND */}

                <div className="mt-7 text-center">
                  <p className="text-sm text-gray-500">
                    Didn't receive the code?
                  </p>

                  {timer > 0 ? (
                    <p className="mt-2 text-xs font-semibold text-gray-400">
                      Resend OTP in{" "}
                      <span className="text-indigo-600">{timer}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResend}
                      className="mt-2 inline-flex items-center gap-2 text-sm font-bold text-indigo-600 transition hover:text-indigo-700"
                    >
                      <RefreshCw size={15} />
                      Resend OTP
                    </button>
                  )}
                </div>

                {/* BACK */}

                <div className="mt-6 border-t border-gray-100 pt-6 text-center">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-indigo-600"
                  >
                    <ArrowLeft size={15} />
                    Back to registration
                  </Link>
                </div>
              </>
            ) : (
              /* SUCCESS STATE */

              <div className="py-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
                  <CheckCircle2 size={34} className="text-green-600" />
                </div>

                <h2 className="mt-6 text-2xl font-black text-gray-950">
                  Account verified!
                </h2>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-gray-500">
                  Your PhoneBhai account has been successfully verified.
                </p>

                <Link
                  href="/"
                  className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 text-sm font-bold text-white transition hover:bg-indigo-700"
                >
                  Continue to PhoneBhai
                  <ArrowRight size={17} />
                </Link>
              </div>
            )}
          </div>

          {/* SECURITY */}

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
            <ShieldCheck size={14} />
            Secure PhoneBhai verification
          </div>
        </div>
      </div>
    </main>
  );
}
