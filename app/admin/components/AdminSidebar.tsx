
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
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setMobileOpen((value) => !value)}
        aria-label="Toggle admin navigation"
        className="fixed left-4 top-4 z-[90] rounded-xl bg-[#101014] p-3 text-white shadow-lg lg:hidden"
      >
        {mobileOpen ? <X size={21} /> : <Menu size={21} />}
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-[70] bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={[
          "group fixed inset-y-0 left-0 z-[80] flex",
          "w-[76px] flex-col overflow-hidden",
          "border-r border-white/10 bg-[#101014] text-white",
          "transition-[width,transform] duration-300 ease-in-out",
          "hover:w-[260px] focus-within:w-[260px]",
          "lg:translate-x-0",
          mobileOpen
            ? "!w-[260px] translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="flex h-20 shrink-0 items-center gap-4 overflow-hidden border-b border-white/10 px-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-black">
            <ShieldCheck size={23} />
          </div>

          <div className="min-w-0 whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
            <p className="font-black">PhoneBhai</p>
            <p className="text-[10px] font-semibold tracking-[0.2em] text-gray-500">
              ADMIN PANEL
            </p>
          </div>
        </div>

        {/* Only vertical scrolling */}
<nav className="admin-sidebar-scroll min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-2 py-5">          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;

              const active =
                pathname === item.href ||
                (item.href !== "/admin" &&
                  pathname.startsWith(item.href + "/"));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.label}
                  onClick={() => setMobileOpen(false)}
                  className={[
                    "flex h-12 w-full min-w-0 items-center gap-4 rounded-xl px-3",
                    "transition-colors duration-200",
                    active
                      ? "bg-white text-black"
                      : "text-gray-400 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                >
                  <Icon className="h-5 w-5 shrink-0" />

                  <span className="whitespace-nowrap text-sm font-semibold opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Logout */}
        <div className="shrink-0 border-t border-white/10 p-2">
          <button
            type="button"
            onClick={async () => {
              await logout();
              window.location.replace("/admin/login");
            }}
            className="flex h-12 w-full items-center gap-4 overflow-hidden rounded-xl px-3 text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-5 w-5 shrink-0" />

            <span className="whitespace-nowrap text-sm font-semibold opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
              Sign out
            </span>
          </button>
        </div>
      </aside>
    </>
  );
}
