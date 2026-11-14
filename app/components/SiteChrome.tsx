
"use client";

import { usePathname } from "next/navigation";
import Header from "./header";
import Footer from "./footer";
import MobileBackButton from "./MobileBackButton";

export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Header />}

      {!isAdminRoute && <MobileBackButton />}

      {children}

      {!isAdminRoute && <Footer />}
    </>
  );
}
