"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import {
  FormEvent,
  useEffect,
  useState,
} from "react";

type Profile = {
  fullName: string;
  phone: string;
  email: string;
};

const PROFILE_KEY =
  "phonebuy-profile";

export default function EditProfilePage() {
  const [form, setForm] =
    useState<Profile>({
      fullName: "",
      phone: "",
      email: "",
    });

  const [saved, setSaved] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    try {
      const stored =
        localStorage.getItem(
          PROFILE_KEY,
        );

      if (stored) {
        const parsed =
          JSON.parse(stored);

        setForm({
          fullName:
            parsed.fullName || "",
          phone:
            parsed.phone || "",
          email:
            parsed.email || "",
        });
      }
    } catch (error) {
      console.error(
        "Failed to load profile:",
        error,
      );
    }
  }, []);

  const handleChange = (
    field: keyof Profile,
    value: string,
  ) => {
    setSaved(false);
    setError("");

    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");
    setSaved(false);

    if (!form.fullName.trim()) {
      setError(
        "Please enter your full name.",
      );

      return;
    }

    if (
      form.phone &&
      form.phone.length !== 10
    ) {
      setError(
        "Please enter a valid 10-digit mobile number.",
      );

      return;
    }

    if (
      form.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email,
      )
    ) {
      setError(
        "Please enter a valid email address.",
      );

      return;
    }

    try {
      localStorage.setItem(
        PROFILE_KEY,
        JSON.stringify({
          fullName:
            form.fullName.trim(),
          phone: form.phone,
          email:
            form.email.trim(),
        }),
      );

      setSaved(true);
    } catch (error) {
      console.error(
        "Failed to save profile:",
        error,
      );

      setError(
        "Unable to save your profile. Please try again.",
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f8fa] px-5 py-10">
      <div className="mx-auto max-w-3xl">

        {/* HEADER */}

        <div className="mt-7">
          <p className="text-sm font-semibold text-indigo-600">
            Account settings
          </p>

          <h1 className="mt-1 text-3xl font-black tracking-tight text-gray-950">
            Edit profile
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Keep your personal information
            up to date for a smoother
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
                This information is stored
                locally on this device.
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
                  value={form.fullName}
                  onChange={(event) =>
                    handleChange(
                      "fullName",
                      event.target.value,
                    )
                  }
                  placeholder="Enter your full name"
                  className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white text-gray-900"
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
                  maxLength={10}
                  value={form.phone}
                  onChange={(event) =>
                    handleChange(
                      "phone",
                      event.target.value.replace(
                        /\D/g,
                        "",
                      ),
                    )
                  }
                  placeholder="10-digit mobile number"
                  className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white text-gray-900"
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
                    handleChange(
                      "email",
                      event.target.value,
                    )
                  }
                  placeholder="Enter your email"
                  className="h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white text-gray-900"
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
              className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 text-sm font-black text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700"
            >
              <Check size={17} />
              Save changes
            </button>

          </div>

        </form>

      </div>
    </main>
  );
}