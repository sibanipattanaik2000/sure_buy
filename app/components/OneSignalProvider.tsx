"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, Sparkles, X } from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";

const ONESIGNAL_APP_ID = "d1c55b46-ca65-49a4-95b8-8e1cad34e661";
const ONESIGNAL_SAFARI_WEB_ID =
  "web.onesignal.auto.47a2f439-afd3-4bb7-8cdd-92cc4f5ee46c";

const DISMISS_KEY = "phonebhai-push-prompt-dismissed";
const DISMISS_DAYS = 7;

interface OneSignalInstance {
  init: (options: Record<string, unknown>) => Promise<void>;
  login: (externalId: string) => Promise<void>;
  logout: () => Promise<void>;
  User: {
    PushSubscription: {
      optedIn: boolean;
      optIn: () => Promise<void>;
    };
  };
  Notifications: {
    permission: boolean;
    permissionNative: string;
  };
}

// declare global {
//   interface Window {
//     OneSignalDeferred?: Array<
//       (OneSignal: OneSignalInstance) => Promise<void> | void
//     >;
//   }
// }

declare global {
  interface Window {
    OneSignalDeferred?: Array<
      (OneSignal: OneSignalInstance) => Promise<void> | void
    >;
    __phoneBhaiOneSignalInitPromise?: Promise<OneSignalInstance>;
  }
}
export default function OneSignalProvider() {
  const { user, loading } = useAuth();

  const oneSignalRef = useRef<OneSignalInstance | null>(null);
  const previousUserIdRef = useRef<string | null>(null);

  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [message, setMessage] = useState("");

  const dismissPrompt = useCallback(() => {
    setVisible(false);

    try {
      localStorage.setItem(
        DISMISS_KEY,
        String(Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000),
      );
    } catch {
      // The prompt can still be dismissed if browser storage is unavailable.
    }
  }, []);

  // Load and initialize the OneSignal SDK once.
  // useEffect(() => {
  //   let cancelled = false;

  //   window.OneSignalDeferred = window.OneSignalDeferred || [];

  //   window.OneSignalDeferred.push(async (OneSignal) => {
  //     await OneSignal.init({
  //       appId: ONESIGNAL_APP_ID,
  //       safari_web_id: ONESIGNAL_SAFARI_WEB_ID,
  //       notifyButton: {
  //         enable: false,
  //       },
  //     });

  //     if (cancelled) return;

  //     oneSignalRef.current = OneSignal;
  //     setReady(true);
  //   });

  //   const existingScript = document.querySelector(
  //     'script[src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"]',
  //   );

  //   if (!existingScript) {
  //     const script = document.createElement("script");
  //     script.src =
  //       "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";
  //     script.defer = true;
  //     document.head.appendChild(script);
  //   }

  //   return () => {
  //     cancelled = true;
  //   };
  // }, []);

  // Load OneSignal only on the official production domain.
  useEffect(() => {
    // Localhost, IP addresses and Vercel preview domains must not initialize
    // this production OneSignal application.
    if (window.location.hostname !== "www.phonebhai.com") {
      console.info("PhoneBhai OneSignal disabled on local/preview domain.");
      return;
    }

    let cancelled = false;

    window.OneSignalDeferred = window.OneSignalDeferred || [];

    window.OneSignalDeferred.push(async (OneSignal) => {
      try {
        // Prevent duplicate initialization during React Strict Mode remounts.
        if (!window.__phoneBhaiOneSignalInitPromise) {
          window.__phoneBhaiOneSignalInitPromise = (async () => {
            await OneSignal.init({
              appId: ONESIGNAL_APP_ID,
              safari_web_id: ONESIGNAL_SAFARI_WEB_ID,
              notifyButton: {
                enable: false,
              },
            });

            return OneSignal;
          })();
        }

        const instance = await window.__phoneBhaiOneSignalInitPromise;

        if (cancelled) return;

        oneSignalRef.current = instance;
        setReady(true);
      } catch (error) {
        console.error("PhoneBhai OneSignal initialization failed:", error);
      }
    });

    const scriptUrl =
      "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";

    if (!document.querySelector(`script[src="${scriptUrl}"]`)) {
      const script = document.createElement("script");
      script.src = scriptUrl;
      script.defer = true;
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
    };
  }, []);

  // Connect a logged-in PhoneBhai account to its OneSignal identity.
  useEffect(() => {
    if (!ready || loading || !oneSignalRef.current) return;

    const OneSignal = oneSignalRef.current;
    const nextUserId = user?.id ?? null;

    if (previousUserIdRef.current === nextUserId) return;

    const syncIdentity = async () => {
      try {
        if (nextUserId) {
          await OneSignal.login(nextUserId);
        } else if (previousUserIdRef.current) {
          await OneSignal.logout();
        }

        previousUserIdRef.current = nextUserId;
      } catch (error) {
        console.error("PhoneBhai OneSignal identity sync failed:", error);
      }
    };

    void syncIdentity();
  }, [ready, loading, user?.id]);

  // Show the custom invitation only when the visitor has not already
  // subscribed, denied permission, or recently dismissed the invitation.
  useEffect(() => {
    if (!ready || loading) return;

    const timer = window.setTimeout(() => {
      try {
        const dismissedUntil = Number(localStorage.getItem(DISMISS_KEY) || 0);

        if (dismissedUntil > Date.now()) return;
      } catch {
        // Continue without the dismissal preference if storage is unavailable.
      }

      if (!("Notification" in window)) return;
      if (Notification.permission === "denied") return;

      if (oneSignalRef.current?.User.PushSubscription.optedIn) return;

      setVisible(true);
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [ready, loading]);

  const handleSubscribe = async () => {
    const OneSignal = oneSignalRef.current;

    if (!OneSignal) {
      setMessage("Notifications are still loading. Please try again.");
      return;
    }

    setSubscribing(true);
    setMessage("");

    try {
      // This runs only after the visitor clicks "Notify me".
      await OneSignal.User.PushSubscription.optIn();

      if (OneSignal.User.PushSubscription.optedIn) {
        setVisible(false);

        try {
          localStorage.setItem(
            DISMISS_KEY,
            String(Date.now() + 365 * 24 * 60 * 60 * 1000),
          );
        } catch {
          // Subscription itself is not affected by storage availability.
        }
      } else if (
        "Notification" in window &&
        Notification.permission === "denied"
      ) {
        setMessage(
          "Notifications are blocked in your browser settings. You can enable them there anytime.",
        );
      } else {
        setMessage(
          "Please allow notifications to stay updated with PhoneBhai.",
        );
      }
    } catch (error) {
      console.error("PhoneBhai push subscription failed:", error);
      setMessage("Couldn't enable notifications. Please try again.");
    } finally {
      setSubscribing(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] w-[calc(100%-2rem)] max-w-[370px] sm:bottom-7 sm:right-7">
      <div className="relative overflow-hidden rounded-[26px] border border-violet-100 bg-white p-5 shadow-[0_18px_65px_rgba(46,31,86,0.18)]">
        {/* Soft decorative background */}
        <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-violet-100/80 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-10 h-32 w-32 rounded-full bg-fuchsia-100/60 blur-2xl" />

        <button
          type="button"
          onClick={dismissPrompt}
          aria-label="Close notification invitation"
          className="absolute right-4 top-4 z-10 rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
        >
          <X size={17} />
        </button>

        <div className="relative">
          <div className="mb-4 flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 text-violet-700">
              <Bell size={23} strokeWidth={1.8} />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-violet-600 text-[10px] text-white">
                <Sparkles size={10} />
              </span>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet-600">
                PHONEBHAI
              </p>
              <p className="text-xs text-gray-500">
                A little something for you ✨
              </p>
            </div>
          </div>

          <h3 className="text-[21px] font-bold leading-tight tracking-tight text-gray-900">
            A little tech joy,
            <br />
            straight to you <span className="text-violet-600">♡</span>
          </h3>

          <p className="mt-2.5 text-sm leading-6 text-gray-600">
            Get first dibs on fresh arrivals, price drops and exclusive deals.
            We&apos;ll keep the good stuff coming!
          </p>

          {message && (
            <p
              role="status"
              className="mt-3 rounded-xl bg-violet-50 px-3 py-2 text-xs leading-5 text-violet-800"
            >
              {message}
            </p>
          )}

          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              onClick={handleSubscribe}
              disabled={subscribing}
              className="flex-1 rounded-full bg-gray-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-gray-900/10 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {subscribing ? "Please wait..." : "Notify me ✨"}
            </button>

            <button
              type="button"
              onClick={dismissPrompt}
              className="rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50"
            >
              Maybe later
            </button>
          </div>

          <p className="mt-3 text-center text-[10px] text-gray-400">
            Only the updates that matter. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
