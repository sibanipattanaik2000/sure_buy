"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://api.phonebhai.com/api/v1";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;

    let sessionId = sessionStorage.getItem("pb_analytics_session");

    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem("pb_analytics_session", sessionId);
    }

    const visitId = crypto.randomUUID();

    const send = async (
      type: "view" | "heartbeat",
      seconds = 0,
    ) => {
      try {
        await fetch(`${API_BASE}/analytics/events`, {
          method: "POST",
          credentials: "include",
          keepalive: true,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            visitId,
            sessionId,
            path: pathname,
            type,
            seconds,
          }),
        });
      } catch {
        // Analytics must never interrupt shopping or checkout.
      }
    };

    void send("view");

    const interval = window.setInterval(() => {
      if (
        document.visibilityState === "visible" &&
        document.hasFocus()
      ) {
        void send("heartbeat", 15);
      }
    }, 15000);

    return () => {
      window.clearInterval(interval);
    };
  }, [pathname]);

  return null;
}