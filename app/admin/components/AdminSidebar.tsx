"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  ChartNoAxesCombined,
  ShoppingBag,
  Package,
  Truck,
  MapPin,
  CreditCard,
  Users,
  Search,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";

import { useAuth } from "@/app/context/AuthContext";

const navigation = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Analytics", href: "/admin/analytics", icon: ChartNoAxesCombined },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Shiprocket", href: "/admin/shiprocket", icon: Truck },
  { label: "Tracking", href: "/admin/tracking", icon: MapPin },
  { label: "Delivery", href: "/admin/delivery", icon: Truck },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Global Search", href: "/admin/search", icon: Search },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-4 top-4 z-[80] rounded-xl bg-black p-3 text-white lg:hidden"
      >
        {mobileOpen ? <X /> : <Menu />}
      </button>

      <aside
        className={[
          "group fixed inset-y-0 left-0 z-[70] flex w-[72px] flex-col",
          "overflow-hidden border-r border-white/10 bg-[#101014] text-white",
          "transition-all duration-300 hover:w-[250px] focus-within:w-[250px]",
          "lg:sticky lg:top-0 lg:h-screen",
          mobileOpen
            ? "w-[250px]"
            : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        <div className="flex h-20 min-w-[250px] items-center gap-4 border-b border-white/10 px-5">
          <div className="rounded-xl bg-white p-2 text-black">
            <ShieldCheck size={24} />
          </div>

          <div className="opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
            <p className="font-black">PhoneBhai</p>
            <p className="text-xs text-gray-500">ADMIN CONSOLE</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto py-5">
          {navigation.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              (item.href !== "/admin" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                title={item.label}
                className={[
                  "mx-3 flex min-w-[220px] items-center gap-4 rounded-xl px-4 py-3",
                  "transition-colors",
                  active
                    ? "bg-white text-black"
                    : "text-gray-400 hover:bg-white/10 hover:text-white",
                ].join(" ")}
              >
                <Icon size={21} />

                <span className="text-sm font-semibold opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={async () => {
            await logout();
            window.location.href = "/admin/login";
          }}
          className="mx-3 mb-5 flex min-w-[220px] items-center gap-4 rounded-xl px-4 py-3 text-gray-400 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={21} />
          <span className="text-sm font-semibold opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">
            Sign out
          </span>
        </button>
      </aside>
    </>
  );
}