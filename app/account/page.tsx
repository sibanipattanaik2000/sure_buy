"use client";
import Link from "next/link";
import {
  UserRound,
  Heart,
  Package,
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
import { apiRequest } from "@/app/lib/api";

type Profile = {
  fullName: string;
  phone: string;
  email: string;
};

type SavedAddress = {
  id: string;
  fullName: string;
  phone: string;
  postalCode: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  country: string;
  landmark?: string | null;
  isDefault: boolean;
};

type RecentOrderItem = {
  id: string;
  productName: string;
  brand: string;
  imageUrl?: string | null;
  unitPrice: number;
  quantity: number;
  subtotal: number;
};

type RecentOrder = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  totalAmount: number;
  createdAt: string;
  items: RecentOrderItem[];
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
  const [dataLoading, setDataLoading] = useState(true);

  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    setProfile({
      fullName: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
      phone: user.phone || "",
      email: user.email || "",
    });
  }, [user, loading, router]);

  useEffect(() => {
    if (loading || !user) return;

    let mounted = true;

    const loadAccountData = async () => {
      try {
        setDataLoading(true);

        const [addressResponse, ordersResponse] = await Promise.all([
          apiRequest<SavedAddress[]>("/addresses"),
          apiRequest<RecentOrder[]>("/orders"),
        ]);

        if (!mounted) return;

        if (addressResponse?.success && Array.isArray(addressResponse.data)) {
          const addresses = addressResponse.data;
          const defaultAddress =
            addresses.find((item) => item.isDefault) ?? addresses[0] ?? null;

          setAddress(defaultAddress);
        } else {
          setAddress(null);
        }

        if (ordersResponse?.success && Array.isArray(ordersResponse.data)) {
          setOrders(ordersResponse.data);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Failed to load account data:", error);

        if (!mounted) return;

        setAddress(null);
        setOrders([]);
      } finally {
        if (mounted) setDataLoading(false);
      }
    };

    loadAccountData();

    return () => {
      mounted = false;
    };
  }, [user, loading]);

  const displayName = profile.fullName
    ? profile.fullName
        .trim()
        .split(/\s+/)
        .map(
          (name) =>
            name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
        )
        .join(" ")
    : "Your Name";

  const displayPhone = profile.phone
    ? `+91 ${profile.phone}`
    : "Add your mobile number";

  return (
    <main className="min-h-[calc(100vh-72px)] bg-[#f7f7f7] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">

        {/* PAGE HEADER */}
        <div className="relative mb-8 overflow-hidden rounded-[24px] border border-gray-200 bg-white px-6 py-7 shadow-sm sm:px-8">
          <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-gray-100 blur-3xl" />

          <div className="relative">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-700">
              <UserRound size={13} />
              My Account
            </div>

            <h1 className="text-3xl font-black tracking-tight text-black sm:text-4xl">
              Welcome
              {profile.fullName ? `, ${displayName}` : " to PhoneBhai"}
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
              Manage your profile, orders, wishlist and delivery details from
              one place.
            </p>
          </div>
        </div>

        {/* PROFILE */}
        <section
          id="personal-information"
          className="overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-sm transition duration-300 hover:border-gray-300 hover:shadow-md"
        >
          <div className="h-1 bg-black" />

          <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-black text-white ring-4 ring-gray-100">
                <UserRound size={28} strokeWidth={2.2} />
              </div>

              <div>
                <h2 className="text-lg font-black tracking-tight text-black">
                  {displayName}
                </h2>

                <p className="mt-0.5 text-sm text-gray-500">
                  {displayPhone}
                </p>

                {profile.email && (
                  <p className="mt-1 text-xs text-gray-400">
                    {profile.email}
                  </p>
                )}

                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-700">
                  <ShieldCheck size={13} />
                  Account details saved
                </div>
              </div>
            </div>

            <Link
              href="/edit-profile"
              className="group/edit inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-bold text-black transition duration-200 hover:border-black hover:bg-black hover:text-white"
            >
              <Pencil
                size={15}
                className="transition-transform group-hover/edit:rotate-[-8deg]"
              />
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
            href="/checkout"
            icon={<MapPin size={21} />}
            title="Saved Address"
            description="Manage your delivery details"
          />
        </div>

        {/* SAVED ADDRESS */}
        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-black tracking-tight text-black">
              Saved Delivery Address
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your latest checkout address is saved here for convenience.
            </p>
          </div>

          <div className="overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-sm transition duration-300 hover:border-gray-300 hover:shadow-md">
            {dataLoading ? (
              <div className="space-y-4 p-7">
                <div className="h-6 w-40 animate-pulse rounded-lg bg-gray-100" />
                <div className="h-20 w-full animate-pulse rounded-2xl bg-gray-100" />
              </div>
            ) : address ? (
              <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start sm:justify-between sm:p-7">
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-black">
                    <MapPin size={20} />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black text-black">
                        {address.fullName}
                      </h3>

                      {address.isDefault && (
                        <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-700">
                          Default
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {address.addressLine1}

                      {address.addressLine2 && (
                        <>
                          <br />
                          {address.addressLine2}
                        </>
                      )}

                      <br />
                      {address.city}, {address.state} - {address.postalCode}
                    </p>

                    {address.landmark && (
                      <p className="mt-1 text-xs text-gray-500">
                        Landmark: {address.landmark}
                      </p>
                    )}

                    <p className="mt-2 text-xs font-semibold text-gray-500">
                      Phone: {address.phone}
                    </p>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-xs font-bold text-black transition hover:border-black hover:bg-black hover:text-white"
                >
                  Use at checkout
                  <ChevronRight size={15} />
                </Link>
              </div>
            ) : (
              <div className="relative flex flex-col items-center justify-center overflow-hidden py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-500">
                  <MapPin size={24} />
                </div>

                <h3 className="mt-4 font-black text-black">
                  No saved address yet
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                  Your delivery address will automatically appear here after
                  you complete a checkout.
                </p>

                <Link
                  href="/buy"
                  className="mt-5 inline-flex items-center rounded-xl bg-black px-5 py-2.5 text-sm font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-gray-800"
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
              <h2 className="text-xl font-black tracking-tight text-black">
                Recent Activity
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your latest purchases
              </p>
            </div>

            <Link
              href="/orders"
              className="group inline-flex items-center gap-1 text-sm font-bold text-black transition hover:text-gray-500"
            >
              View all
              <ChevronRight
                size={15}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          {dataLoading ? (
            <div className="space-y-3">
              {[1, 2].map((item) => (
                <div
                  key={item}
                  className="h-28 animate-pulse rounded-2xl bg-white"
                />
              ))}
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-3">
              {orders.slice(0, 3).map((order) => {
                const firstItem = order.items?.[0];

                return (
                  <Link
                    key={order.id}
                    href={`/orders/${order.id}`}
                    className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-md"
                  >
                    <div className="flex h-20 w-16 shrink-0 items-center justify-center rounded-xl bg-gray-50 p-2 ring-1 ring-gray-100">
                      {firstItem?.imageUrl ? (
                        <img
                          src={firstItem.imageUrl}
                          alt={firstItem.productName}
                          className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <ShoppingBag size={24} className="text-gray-300" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        {firstItem?.brand || "PhoneBhai"}
                      </p>

                      <h3 className="mt-1 truncate text-sm font-black text-black">
                        {firstItem?.productName || "Order"}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="text-sm font-black text-black">
                          ₹
                          {Number(order.totalAmount || 0).toLocaleString(
                            "en-IN",
                          )}
                        </span>

                        <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-bold text-green-700">
                          {order.status}
                        </span>
                      </div>
                    </div>

                    <ChevronRight
                      size={18}
                      className="shrink-0 text-gray-300 transition duration-200 group-hover:translate-x-1 group-hover:text-black"
                    />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="overflow-hidden rounded-[24px] border border-gray-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-500">
                <ShoppingBag size={24} />
              </div>

              <h3 className="mt-4 font-black text-black">
                No recent purchases
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                Once you place an order, your recent purchase will appear here.
              </p>

              <Link
                href="/buy"
                className="mt-5 inline-flex rounded-xl bg-black px-5 py-2.5 text-sm font-bold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-gray-800"
              >
                Explore Phones
              </Link>
            </div>
          )}
        </section>

        {/* ACCOUNT SETTINGS */}
        <section className="mt-8 overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 bg-gray-50 p-6">
            <h2 className="font-black tracking-tight text-black">
              Account Settings
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage your account preferences
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            <a
              href="#personal-information"
              className="group flex w-full items-center justify-between p-6 text-left transition duration-200 hover:bg-gray-50"
            >
              <div>
                <p className="text-sm font-bold text-gray-900 transition group-hover:text-black">
                  Personal Information
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Manage your name and contact details
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition group-hover:bg-black group-hover:text-white">
                <ChevronRight size={18} />
              </div>
            </a>

            <Link
              href="/edit-profile"
              className="group flex w-full items-center justify-between p-6 text-left transition duration-200 hover:bg-gray-50"
            >
              <div>
                <p className="text-sm font-bold text-gray-900 transition group-hover:text-black">
                  Profile Settings
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Update your account information
                </p>
              </div>

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition group-hover:bg-black group-hover:text-white">
                <ChevronRight size={18} />
              </div>
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

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-50 text-green-600">
                <ShieldCheck size={19} />
              </div>
            </div>
          </div>
        </section>

        {/* LOGOUT */}
        <div className="mt-8 flex justify-center pb-4">
          <button
            type="button"
            disabled={loggingOut}
            onClick={async () => {
              if (loggingOut) return;

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
            className="group inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-bold text-red-600 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-50 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut
              size={17}
              className="transition-transform group-hover:-translate-x-0.5"
            />
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
      className="group relative overflow-hidden rounded-[24px] border border-gray-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-gray-400 hover:shadow-lg"
    >
      <div className="relative flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-white transition duration-300 group-hover:scale-105 group-hover:bg-gray-800">
          {icon}
        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition duration-300 group-hover:bg-black group-hover:text-white">
          <ChevronRight
            size={18}
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </div>
      </div>

      <h3 className="relative mt-5 text-sm font-black text-black transition group-hover:text-gray-600">
        {title}
      </h3>

      <p className="relative mt-1 text-xs text-gray-500">
        {description}
      </p>
    </Link>
  );
}