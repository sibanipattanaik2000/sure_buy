
"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function MobileBackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Hide the Back button on the homepage
  if (pathname === "/") return null;

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label="Go back"
      className="fixed left-3 top-20 z-[90] flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white/95 text-black shadow-lg backdrop-blur-sm transition active:scale-95 md:hidden"
    >
      <ArrowLeft size={20} strokeWidth={2.2} />
    </button>
  );
}
