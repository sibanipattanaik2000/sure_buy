
"use client";

import { useCallback, useEffect, useState } from "react";

const OTP_DURATION_SECONDS = 120;

export function useOtpCountdown() {
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const startCountdown = useCallback(() => {
    setExpiresAt(Date.now() + OTP_DURATION_SECONDS * 1000);
  }, []);

  useEffect(() => {
    if (expiresAt === null) {
      setRemainingSeconds(0);
      return;
    }

    const updateCountdown = () => {
      const remaining = Math.max(
        0,
        Math.ceil((expiresAt - Date.now()) / 1000),
      );

      setRemainingSeconds(remaining);

      if (remaining === 0) {
        setExpiresAt(null);
      }
    };

    updateCountdown();

    const interval = window.setInterval(updateCountdown, 250);

    return () => window.clearInterval(interval);
  }, [expiresAt]);

  const formattedTime = `${String(Math.floor(remainingSeconds / 60)).padStart(2, "0")}:${String(
    remainingSeconds % 60,
  ).padStart(2, "0")}`;

  return {
    remainingSeconds,
    formattedTime,
    startCountdown,
  };
}
