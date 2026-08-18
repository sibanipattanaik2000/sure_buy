import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

export default function ForgotPasswordPage() {
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
            <span className="text-indigo-600">
              PhoneBuy account.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-gray-600">
            Forgot your password? Enter your registered email address and
            we'll help you securely reset your password.
          </p>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
              <ShieldCheck
                size={21}
                className="text-green-600"
              />
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
              We'll help you get back into your account.
            </p>
          </div>

          {/* CARD */}

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-8">

            <div className="mb-7">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
                <Mail
                  size={20}
                  className="text-indigo-600"
                />
              </div>

              <h2 className="text-2xl font-black tracking-tight text-gray-950">
                Reset your password
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Enter the email address associated with your PhoneBuy
                account. We'll send you a password reset link.
              </p>
            </div>

            <form className="space-y-5">

              {/* EMAIL */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  required
                  className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              {/* SUBMIT */}

              <button
                type="submit"
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20"
              >
                Send reset link

                <ArrowRight
                  size={17}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
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
            Secure PhoneBuy account recovery
          </div>

        </div>
      </div>
    </main>
  );
}