"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  UserPlus,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { registerUser } from "../lib/api";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Remove error when user starts correcting the field
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      newErrors.name = "Please enter your full name.";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must contain at least 2 characters.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Please enter your mobile number.";
    } else if (!/^[6-9]\d{9}$/.test(form.phone)) {
      newErrors.phone = "Please enter a valid 10-digit mobile number.";
    }

    if (!form.password) {
      newErrors.password = "Please create a password.";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must contain at least 8 characters.";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!form.terms) {
      newErrors.terms =
        "Please accept the Terms & Conditions and Privacy Policy.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const nameParts = form.name.trim().split(/\s+/);

      const firstName = nameParts[0];

      const lastName = nameParts.slice(1).join(" ") || "User";

      await registerUser({
        firstName,
        lastName,
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim(),
      });

      router.push("/verify-user")
    } catch (error) {
      console.error("REGISTER ERROR:", error);

      const message =
        error instanceof Error ? error.message : "Registration failed";

      setErrors({
        submit: message,
      });
    }
  };

  return (
    <main className="min-h-[calc(100vh-72px)] bg-gradient-to-br from-gray-50 via-white to-indigo-50/40 px-5 py-12 sm:py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        {/* LEFT */}

        <div className="hidden lg:block">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
            <Zap size={15} />
            Welcome to PhoneBhai
          </div>

          <h1 className="max-w-xl text-5xl font-black leading-[1.05] tracking-[-0.04em] text-gray-950">
            Your smarter way to{" "}
            <span className="text-indigo-600">buy & sell phones.</span>
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-gray-600">
            Create your PhoneBhai account to buy certified phones, sell your old
            phone, track orders and manage your wishlist.
          </p>

          <div className="mt-10 flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
              <ShieldCheck size={21} className="text-green-600" />
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900">Secure account</p>

              <p className="mt-1 text-xs text-gray-500">
                Your personal information stays protected.
              </p>
            </div>
          </div>
        </div>

        {/* REGISTER */}

        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white">
              <Zap size={20} />
            </div>

            <h1 className="text-3xl font-black text-gray-950">
              Create your account
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Join PhoneBhai and get started.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.08)] sm:p-8">
            <div className="mb-7 hidden lg:block">
              <h2 className="text-2xl font-black text-gray-950">
                Create your account
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Enter your details to get started.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              {/* NAME */}

              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Full name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`h-12 w-full rounded-xl border bg-white px-4 text-sm outline-none transition ${
                    errors.name
                      ? "border-red-400 focus:ring-4 focus:ring-red-500/10 text-gray-900"
                      : "border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-gray-900"
                  }`}
                />

                {errors.name && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.name}
                  </p>
                )}
              </div>

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
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`h-12 w-full rounded-xl border bg-white px-4 text-sm outline-none transition ${
                    errors.email
                      ? "border-red-400 focus:ring-4 focus:ring-red-500/10 text-gray-900"
                      : "border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-gray-900"
                  }`}
                />

                {errors.email && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* PHONE */}

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Mobile number
                </label>

                <div
                  className={`flex h-12 overflow-hidden rounded-xl border ${
                    errors.phone ? "border-red-400" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center border-r border-gray-200 bg-gray-50 px-3 text-sm font-semibold text-gray-600">
                    +91
                  </div>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    maxLength={10}
                    placeholder="Enter mobile number"
                    className="min-w-0 flex-1 bg-white px-4 text-sm outline-none text-gray-900 placeholder:text-gray-400 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>

                {errors.phone && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* PASSWORD */}

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className={`h-12 w-full rounded-xl border bg-white px-4 pr-12 text-sm outline-none transition ${
                      errors.password
                        ? "border-red-400 focus:ring-4 focus:ring-red-500/10 text-gray-900"
                        : "border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-gray-900"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* CONFIRM PASSWORD */}

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className={`h-12 w-full rounded-xl border bg-white px-4 pr-12 text-sm outline-none transition ${
                      errors.confirmPassword
                        ? "border-red-400 focus:ring-4 focus:ring-red-500/10 text-gray-900"
                        : "border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 text-gray-900"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <Eye size={18} />
                    ) : (
                      <EyeOff size={18} />
                    )}
                  </button>
                </div>

                {errors.confirmPassword && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* TERMS */}

              <div>
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    name="terms"
                    checked={form.terms}
                    onChange={handleChange}
                    className="mt-0.5 h-4 w-4 accent-indigo-600"
                  />

                  <span className="text-xs leading-5 text-gray-500">
                    I agree to PhoneBhai's{" "}
                    <Link
                      href="/terms"
                      className="font-semibold text-indigo-600"
                    >
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="font-semibold text-indigo-600"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </span>
                </label>

                {errors.terms && (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.terms}
                  </p>
                )}
              </div>
              {errors.submit && (
                <p className="text-sm font-medium text-red-500">
                  {errors.submit}
                </p>
              )}
              {/* SUBMIT */}

              <button
                type="submit"
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-bold text-white transition hover:bg-indigo-700"
              >
                Create account
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </form>

            <div className="mt-7 border-t border-gray-100 pt-6 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-indigo-600 hover:text-indigo-700"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
