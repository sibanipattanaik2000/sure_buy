"use client";

import Link from "next/link";
import {
  UserRound,
  Heart,
  Package,
  Smartphone,
  MapPin,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export default function AccountPage() {
  return (
    <main className="min-h-[calc(100vh-72px)] bg-gray-50 px-5 py-10">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="mb-8">
          <p className="text-sm font-semibold text-indigo-600">
            My Account
          </p>

          <h1 className="mt-1 text-3xl font-black tracking-tight text-gray-950">
            Welcome to PhoneBhai
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your profile, orders, wishlist and devices.
          </p>
        </div>

        {/* PROFILE CARD */}

        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                <UserRound size={28} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-950">
                  Your Name
                </h2>

                <p className="text-sm text-gray-500">
                  +91 XXXXX XXXXX
                </p>

                <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-green-600">
                  <ShieldCheck size={14} />
                  Verified account
                </div>
              </div>

            </div>

            <button className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-50">
              Edit Profile
            </button>

          </div>
        </div>

        {/* QUICK ACTIONS */}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <AccountCard
            href="/orders"
            icon={<Package size={21} />}
            title="My Orders"
            description="Track your purchases"
          />

          <AccountCard
            href="/wishlist"
            icon={<Heart size={21} />}
            title="Wishlist"
            description="Your saved phones"
          />

          <AccountCard
            href="/sell"
            icon={<Smartphone size={21} />}
            title="Sell a Phone"
            description="Get the best value"
          />

          <AccountCard
            href="/addresses"
            icon={<MapPin size={21} />}
            title="Addresses"
            description="Manage delivery details"
          />

        </div>

        {/* RECENT ACTIVITY */}

        <section className="mt-8">

          <div className="mb-4 flex items-center justify-between">

            <div>
              <h2 className="text-xl font-black text-gray-950">
                Recent Activity
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your latest PhoneBhai activity
              </p>
            </div>

            <Link
              href="/orders"
              className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
            >
              View all
            </Link>

          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
              <Package
                size={24}
                className="text-gray-400"
              />
            </div>

            <h3 className="mt-4 font-bold text-gray-900">
              No recent activity
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
              Your purchases, sales and other activities
              will appear here.
            </p>

            <Link
              href="/buy"
              className="mt-5 inline-flex rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
            >
              Explore Phones
            </Link>

          </div>

        </section>

        {/* ACCOUNT SETTINGS */}

        <section className="mt-8 rounded-3xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-100 p-6">

            <h2 className="font-black text-gray-950">
              Account Settings
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage your account preferences
            </p>

          </div>

          <div className="divide-y divide-gray-100">

            <SettingRow
              title="Personal Information"
              description="Manage your name and contact details"
            />

            <SettingRow
              title="Security"
              description="Password and account security"
            />

            <SettingRow
              title="Notifications"
              description="Manage your notification preferences"
            />

          </div>

        </section>

        {/* LOGOUT */}

        <div className="mt-8 flex justify-center">

          <button className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50">
            <LogOut size={17} />
            Logout
          </button>

        </div>

      </div>
    </main>
  );
}


/* ACCOUNT CARD */

function AccountCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
    >
      <div className="flex items-center justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
          {icon}
        </div>

        <ChevronRight
          size={18}
          className="text-gray-300 transition group-hover:translate-x-1 group-hover:text-indigo-600"
        />

      </div>

      <h3 className="mt-5 text-sm font-bold text-gray-950">
        {title}
      </h3>

      <p className="mt-1 text-xs text-gray-500">
        {description}
      </p>
    </Link>
  );
}


/* SETTINGS ROW */

function SettingRow({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <button className="flex w-full items-center justify-between p-6 text-left transition hover:bg-gray-50">

      <div>
        <p className="text-sm font-bold text-gray-900">
          {title}
        </p>

        <p className="mt-1 text-xs text-gray-500">
          {description}
        </p>
      </div>

      <ChevronRight
        size={18}
        className="text-gray-400"
      />

    </button>
  );
}