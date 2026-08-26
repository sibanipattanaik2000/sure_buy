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
  Pencil,
  ShoppingBag,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

type Profile = {
  fullName: string;
  phone: string;
  email: string;
};

type SavedAddress = {
  fullName: string;
  phone: string;
  pincode: string;
  address: string;
  area: string;
  city: string;
  state: string;
};

type RecentOrder = {
  id: string;
  productName: string;
  brand: string;
  image: string;
  price: number;
  status: string;
  orderDate: string;
};
export default function AccountPage() {
  const [profile, setProfile] = useState<Profile>({
    fullName: "",
    phone: "",
    email: "",
  });

  const [address, setAddress] = useState<SavedAddress | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      router.replace("/login");
      return;
    }

    setProfile({
      fullName: `${user.firstName} ${user.lastName}`.trim(),
      phone: user.phone || "",
      email: user.email || "",
    });
  }, [user, loading, router]);

  const displayName = profile.fullName || "Your Name";

  const displayPhone = profile.phone
    ? `+91 ${profile.phone}`
    : "Add your mobile number";

  return (
    <main className="min-h-[calc(100vh-72px)] bg-gray-50 px-5 py-10">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}

        <div className="mb-8">
          <p className="text-sm font-semibold text-indigo-600">My Account</p>

          <h1 className="mt-1 text-3xl font-black tracking-tight text-gray-950">
            Welcome
            {profile.fullName
              ? `, ${profile.fullName.split(" ")[0]}`
              : " to PhoneBhai"}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your profile, orders, wishlist and delivery details.
          </p>
        </div>

        {/* PROFILE */}

        <section
          id="personal-information"
          className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                <UserRound size={28} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-950">
                  {displayName}
                </h2>

                <p className="text-sm text-gray-500">{displayPhone}</p>

                {profile.email && (
                  <p className="mt-1 text-xs text-gray-400">{profile.email}</p>
                )}

                <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-green-600">
                  <ShieldCheck size={14} />
                  Account details saved
                </div>
              </div>
            </div>

            <Link
              href="/edit-profile"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-bold text-gray-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
            >
              <Pencil size={15} />
              Edit Profile
            </Link>
          </div>
        </section>

        {/* QUICK ACTIONS */}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        </div>

        {/* SAVED ADDRESS */}

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-black text-gray-950">
              Saved delivery address
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your latest checkout address is saved here for convenience.
            </p>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            {address ? (
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <MapPin size={20} />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black text-gray-950">
                        {address.fullName}
                      </h3>

                      <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-700">
                        Saved
                      </span>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {address.address}
                      <br />
                      {address.area}
                      <br />
                      {address.city}, {address.state} - {address.pincode}
                    </p>

                    <p className="mt-2 text-xs font-semibold text-gray-500">
                      Phone: {address.phone}
                    </p>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                  Use at checkout
                  <ChevronRight size={15} />
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
                  <MapPin size={24} className="text-gray-400" />
                </div>

                <h3 className="mt-4 font-bold text-gray-900">
                  No saved address yet
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                  Your delivery address will automatically appear here after you
                  complete a checkout.
                </p>

                <Link
                  href="/buy"
                  className="mt-5 inline-flex rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"
                >
                  Explore Phones
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* RECENT ACTIVITY */}

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-gray-950">
                Recent Activity
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your latest purchases
              </p>
            </div>

            <Link
              href="/orders"
              className="text-sm font-bold text-indigo-600 hover:text-indigo-700"
            >
              View all
            </Link>
          </div>

          {orders.length > 0 ? (
            <div className="space-y-3">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
                >
                  <div className="flex h-20 w-16 shrink-0 items-center justify-center rounded-xl bg-gray-50 p-2">
                    <img
                      src={order.image}
                      alt={order.productName}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      {order.brand}
                    </p>

                    <h3 className="mt-1 truncate text-sm font-black text-gray-950">
                      {order.productName}
                    </h3>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className="text-sm font-black">
                        ₹{Number(order.price || 0).toLocaleString("en-IN")}
                      </span>

                      <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-700">
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <ChevronRight
                    size={18}
                    className="shrink-0 text-gray-300 transition group-hover:translate-x-1 group-hover:text-indigo-600"
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
                <ShoppingBag size={24} className="text-gray-400" />
              </div>

              <h3 className="mt-4 font-bold text-gray-900">
                No recent purchases
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                Once you place an order, your recent purchase will appear here.
              </p>

              <Link
                href="/buy"
                className="mt-5 inline-flex rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
              >
                Explore Phones
              </Link>
            </div>
          )}
        </section>

        {/* ACCOUNT SETTINGS */}

        <section className="mt-8 rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-6">
            <h2 className="font-black text-gray-950">Account Settings</h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage your account preferences
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            <a
              href="#personal-information"
              className="flex w-full items-center justify-between p-6 text-left transition hover:bg-gray-50"
            >
              <div>
                <p className="text-sm font-bold text-gray-900">
                  Personal Information
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Manage your name and contact details
                </p>
              </div>

              <ChevronRight size={18} className="text-gray-400" />
            </a>

            <Link
              href="/edit-profile"
              className="flex w-full items-center justify-between p-6 text-left transition hover:bg-gray-50"
            >
              <div>
                <p className="text-sm font-bold text-gray-900">
                  Profile Settings
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Update your account information
                </p>
              </div>

              <ChevronRight size={18} className="text-gray-400" />
            </Link>

            <div className="flex w-full items-center justify-between p-6">
              <div>
                <p className="text-sm font-bold text-gray-900">
                  Order protection
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Secure checkout and order tracking
                </p>
              </div>

              <ShieldCheck size={19} className="text-green-600" />
            </div>
          </div>
        </section>

        {/* LOGOUT */}

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            disabled={loggingOut}
            onClick={async () => {
              if (loggingOut) {
                return;
              }

              try {
                setLoggingOut(true);

                await logout();

                router.replace("/");
              } catch (error) {
                console.error("Logout error:", error);
              } finally {
                setLoggingOut(false);
              }
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut size={17} />
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </main>
  );
}

/* =========================================================
    ACCOUNT CARD
  ========================================================= */

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

      <h3 className="mt-5 text-sm font-bold text-gray-950">{title}</h3>

      <p className="mt-1 text-xs text-gray-500">{description}</p>
    </Link>
  );
}
