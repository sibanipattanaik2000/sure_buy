"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import AnalyticsTracker from "./components/AnalyticsTracker";
import { useAuth } from "@/app/context/AuthContext";
import AdminSidebar from "./components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const { user, loading } = useAuth();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage || loading) return;

    if (!user || user.role !== "ADMIN") {
      router.replace("/admin/login");
    }
  }, [isLoginPage, loading, user, router]);

  if (isLoginPage) return children;

  if (loading || !user || user.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090b]">
        <Loader2 className="animate-spin text-white" size={32} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f5f5f7]">
      <AdminSidebar />
        <AnalyticsTracker />
      <main className="min-w-0 flex-1 px-5 pb-10 pt-20 lg:px-8 lg:pt-8">
        {children}
      </main>
    </div>
  );
}