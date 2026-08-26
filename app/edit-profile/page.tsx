"use client";

import Link from "next/link";
import { ArrowLeft, Check, Mail, Phone, UserRound } from "lucide-react";
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

        /*
         * IMPORTANT:
         * apiRequest<T>() already returns ApiResponse<T>.
         * Therefore T must be UserProfile here.
         */
        const response = await apiRequest<UserProfile>("/auth/me");

        if (!response?.success || !response.data) {
          throw new Error(
            response?.message || "Unable to load your profile.",
          );
        }

        const user = response.data;

        if (!mounted) return;

        setForm({
          fullName: `${user.firstName} ${user.lastName}`.trim(),
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

      /*
       * IMPORTANT:
       * Again, use UserProfile here.
       * Do NOT use ApiResponse<UserProfile>.
       */
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
        throw new Error(
          response?.message || "Unable to update your profile.",
        );
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
    <main className="min-h-screen bg-[#f7f8fa] px-5 py-10">
      <div className="mx-auto max-w-3xl">
        {/* BACK */}
        <Link
          href="/account"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-gray-950"
        >
          <ArrowLeft size={17} />
          Back to account
        </Link>

        {/* HEADER */}
        <div className="mt-7">
          <p className="text-sm font-semibold text-indigo-600">
            Account settings
          </p>

          <h1 className="mt-1 text-3xl font-black tracking-tight text-gray-950">
            Edit profile
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Keep your personal information up to date for a smoother
            PhoneBhai experience.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
        >
          {/* AVATAR */}
          <div className="flex items-center gap-4 border-b border-gray-100 pb-7">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <UserRound size={25} />
            </div>

            <div>
              <h2 className="font-black text-gray-950">
                Personal information
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Your profile information is securely saved to your account.
              </p>
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
              {error}
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
              <div className="h-20 animate-pulse rounded-xl bg-gray-100" />
              <div className="h-20 animate-pulse rounded-xl bg-gray-100" />
              <div className="h-20 animate-pulse rounded-xl bg-gray-100" />
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

                  <div className="relative mt-2">
                    <UserRound
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
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
                      className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
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

                  <div className="relative mt-2">
                    <Phone
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
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
                      className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
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

                  <div className="relative mt-2">
                    <Mail
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
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
                      className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">
                <Link
                  href="/account"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-gray-200 px-6 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 text-sm font-black text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Check size={17} />
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </main>
  );
}