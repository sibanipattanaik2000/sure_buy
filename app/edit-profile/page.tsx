"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Mail,
  Phone,
  UserRound,
  ShieldCheck,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/app/lib/api";

type Profile = {
  fullName: string;
  phone: string;
  email: string;
};

type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  createdAt: string;
};

export default function EditProfilePage() {
  const router = useRouter();

  const [form, setForm] = useState<Profile>({
    fullName: "",
    phone: "",
    email: "",
  });

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --------------------------------------------------
  // LOAD PROFILE
  // --------------------------------------------------

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiRequest<UserProfile>("/auth/me");

        if (!response?.success || !response.data) {
          throw new Error(response?.message || "Unable to load your profile.");
        }

        const user = response.data;

        if (!mounted) return;

        setForm({
          fullName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
          phone: user.phone ?? "",
          email: user.email ?? "",
        });
      } catch (error) {
        console.error("Failed to load profile:", error);

        if (!mounted) return;

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load your profile.",
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  // --------------------------------------------------
  // FORM CHANGE
  // --------------------------------------------------

  const handleChange = (field: keyof Profile, value: string) => {
    setSaved(false);
    setError("");

    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSaved(false);

    const fullName = form.fullName.trim();
    const phone = form.phone.trim();
    const email = form.email.trim();

    // Validate name
    if (!fullName) {
      setError("Please enter your full name.");
      return;
    }

    // Validate phone
    if (phone && !/^\d{10}$/.test(phone)) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    // Validate email
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setSaving(true);

      const nameParts = fullName.split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ");

      const response = await apiRequest<UserProfile>("/auth/me", {
        method: "PATCH",
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
        }),
      });

      if (!response?.success || !response.data) {
        throw new Error(response?.message || "Unable to update your profile.");
      }

      const user = response.data;

      setForm({
        fullName: `${user.firstName} ${user.lastName}`.trim(),
        phone: user.phone ?? "",
        email: user.email ?? "",
      });

      setSaved(true);

      setTimeout(() => {
        router.push("/account");
        router.refresh();
      }, 500);
    } catch (error) {
      console.error("Failed to update profile:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update your profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-[#f6f7fb] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        {/* HEADER */}
        <div className="relative overflow-hidden rounded-[28px] border border-indigo-100 bg-white px-6 py-7 shadow-sm sm:px-8">
          <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full bg-indigo-200/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-purple-200/20 blur-3xl" />

          <div className="relative">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600">
              <UserRound size={13} />
              Account settings
            </div>

            <h1 className="text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
              Edit Profile
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
              Keep your personal information up to date for a smoother PhoneBhai
              experience
            </p>
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="relative mt-6 overflow-hidden rounded-[28px] border border-gray-200/80 bg-white shadow-sm transition duration-300 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-100/20"
        >
          {/* TOP GRADIENT */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

          <div className="p-6 sm:p-8">
            {/* AVATAR */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-7">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-md" />

                <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-50 to-purple-100 text-indigo-600 ring-4 ring-white">
                  <UserRound size={25} strokeWidth={2.2} />
                </div>
              </div>

              <div>
                <h2 className="font-black tracking-tight text-gray-950">
                  Personal Information
                </h2>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Your profile information is securely saved to your account.
                </p>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                <span>{error}</span>
              </div>
            )}

            {/* SUCCESS */}
            {saved && (
              <div className="mt-6 flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
                <Check size={17} />
                Profile updated successfully.
              </div>
            )}

            {/* LOADING */}
            {loading ? (
              <div className="mt-7 space-y-5">
                <div className="h-20 animate-pulse rounded-2xl bg-gray-100" />
                <div className="h-20 animate-pulse rounded-2xl bg-gray-100" />
                <div className="h-20 animate-pulse rounded-2xl bg-gray-100" />
              </div>
            ) : (
              <>
                <div className="mt-7 space-y-5">
                  {/* NAME */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="text-xs font-bold text-gray-700"
                    >
                      Full name
                    </label>

                    <div className="group relative mt-2">
                      <UserRound
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition group-focus-within:text-indigo-500"
                      />

                      <input
                        id="fullName"
                        type="text"
                        value={form.fullName}
                        onChange={(event) =>
                          handleChange("fullName", event.target.value)
                        }
                        placeholder="Enter your full name"
                        autoComplete="name"
                        disabled={saving}
                        className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-900 outline-none transition duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* PHONE */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="text-xs font-bold text-gray-700"
                    >
                      Mobile number
                    </label>

                    <div className="group relative mt-2">
                      <Phone
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition group-focus-within:text-indigo-500"
                      />

                      <input
                        id="phone"
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={form.phone}
                        onChange={(event) =>
                          handleChange(
                            "phone",
                            event.target.value.replace(/\D/g, ""),
                          )
                        }
                        placeholder="10-digit mobile number"
                        autoComplete="tel"
                        disabled={saving}
                        className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-900 outline-none transition duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </div>
                  </div>

                  {/* EMAIL */}
                  <div>
                    <label
                      htmlFor="email"
                      className="text-xs font-bold text-gray-700"
                    >
                      Email address
                    </label>

                    <div className="group relative mt-2">
                      <Mail
                        size={17}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition group-focus-within:text-indigo-500"
                      />

                      <input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(event) =>
                          handleChange("email", event.target.value)
                        }
                        placeholder="Enter your email"
                        autoComplete="email"
                        disabled={saving}
                        className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-900 outline-none transition duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </div>
                  </div>
                </div>

                {/* SECURITY NOTE */}
                <div className="mt-7 flex items-center gap-3 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 to-purple-50/50 px-4 py-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
                    <ShieldCheck size={18} />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-800">
                      Your information is protected
                    </p>

                    <p className="mt-0.5 text-[11px] leading-5 text-gray-500">
                      Your details are used only to manage your PhoneBhai
                      account and orders.
                    </p>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
                  <Link
                    href="/account"
                    className="inline-flex h-12 items-center justify-center rounded-xl border border-gray-200 bg-white px-6 text-sm font-bold text-gray-700 shadow-sm transition duration-200 hover:border-gray-300 hover:bg-gray-50"
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-7 text-sm font-black text-white shadow-lg shadow-indigo-600/20 transition duration-200 hover:-translate-y-0.5 hover:from-indigo-700 hover:to-indigo-600 hover:shadow-xl hover:shadow-indigo-600/25 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >
                    <Check size={17} />
                    {saving ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
