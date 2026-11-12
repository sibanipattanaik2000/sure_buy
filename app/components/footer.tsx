"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
  Store,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { BsYoutube } from "react-icons/bs";
import { subscribeNewsletter } from "@/app/lib/newsletter";

/* =========================================================
   STORE LOCATIONS (real maps)
========================================================= */

const storeLocations = [
  {
    name: "Surebuy Signature",
    area: "Siripur, Bhubaneswar",
    mapUrl: "https://maps.app.goo.gl/Qijmns34eynvkARU9",
  },
  {
    name: "Surebuy Premium",
    area: "Bapuji Nagar, Bhubaneswar",
    mapUrl: "https://maps.app.goo.gl/26h98if3pWk8iV5C6",
  },
  {
    name: "Surebuy Store – Saheed Nagar",
    area: "Saheed Nagar, Bhubaneswar",
    mapUrl: "https://maps.app.goo.gl/c7Bh37SePrEBUpxH6",
  },
  {
    name: "Surebuy Store – Cuttack",
    area: "Cuttack, Odisha",
    mapUrl: "https://maps.app.goo.gl/BgBpQ1MZ2BgCbjKF7",
  },
  {
    name: "Surebuy Store – Puri Mobile",
    area: "Puri, Odisha",
    mapUrl: "https://maps.app.goo.gl/S6Sxcoeu9oBrSUJz5",
  },
  {
    name: "Surebuy Store – Puri",
    area: "Puri, Odisha",
    mapUrl: "https://maps.app.goo.gl/Vsy6Ds4ZU1re4fr2A",
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      setMessage("");
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const response = await subscribeNewsletter(normalizedEmail);

      if (!response.success) {
        throw new Error(response.message || "Unable to subscribe right now.");
      }

      setMessage(
        response.message ||
          "You're successfully subscribed to PhoneBhai updates.",
      );
      setEmail("");
    } catch (err) {
      console.error("NEWSLETTER SUBSCRIBE ERROR:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to subscribe right now. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <footer className="bg-[#0b0f19] text-white">
      {/* ========== NEWSLETTER ========== */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-7 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-400">
              Stay updated
            </p>
            <h2 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">
              Get the latest tech deals.
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              New arrivals, offers and useful device tips.
            </p>
          </div>

          <div className="w-full max-w-md">
            <form
              onSubmit={handleSubscribe}
              className="flex w-full rounded-xl border border-white/10 bg-white/[0.04] p-1 transition focus-within:border-indigo-400/40"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                  setMessage("");
                }}
                placeholder="Enter your email"
                aria-label="Email address"
                autoComplete="email"
                disabled={submitting}
                required
                className="min-w-0 flex-1 bg-transparent px-3.5 text-sm text-white outline-none placeholder:text-gray-500 disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-white px-4 py-2 text-xs font-bold text-black transition hover:bg-gray-200 disabled:opacity-60"
              >
                {submitting ? "..." : "Subscribe"}
              </button>
            </form>

            {message && (
              <p className="mt-1.5 px-1 text-xs font-medium text-green-400">
                {message}
              </p>
            )}
            {error && (
              <p className="mt-1.5 px-1 text-xs font-medium text-red-400">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ========== MAIN FOOTER ========== */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* BRAND + CONTACT */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-black">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              </div>
              <span className="text-lg font-bold tracking-tight">
                PhoneBhai
              </span>
            </Link>

            <p className="mt-3 max-w-xs text-sm leading-6 text-gray-400">
              A smarter way to buy quality smartphones. Transparent pricing &
              quality checked devices.
            </p>

            <div className="mt-4 space-y-2">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=support@phonebhai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-gray-400 transition hover:text-white"
              >
                <Mail size={13} className="text-indigo-400" />
                support@PhoneBhai.com
              </a>
              <a
                href="tel:+918079979945"
                className="flex items-center gap-2 text-xs text-gray-400 transition hover:text-white"
              >
                <Phone size={13} className="text-indigo-400" />
                +91 8079979945
              </a>
            </div>
          </div>

          {/* COMPANY */}
          <FooterColumn
            title="Company"
            links={[
              ["About PhoneBhai", "/about"],
              ["How it works", "/how-it-works"],
              ["Buy devices", "/buy"],
              // ["Sell your phone", "/sell"],
            ]}
          />

          {/* SUPPORT */}
          <FooterColumn
            title="Support"
            links={[
              ["Warranty Policy", "/warranty-policy"],
              ["Privacy Policy", "/privacy-policy"],
              ["Return & Replace", "/return-refund-policy"],
              ["Cancellation Policy", "/cancellation-policy"],
              ["Terms & Conditions", "/terms-and-conditions"],
            ]}
          />

          {/* QUICK LINKS */}
          <FooterColumn
            title="Quick Links"
            links={[
              ["Browse phones", "/buy"],
              ["Track order", "/orders"],
              ["Inspection Policy", "/inspection-policy"],
              ["Device Handover", "/device-handover-policy"],
              ["Cookie Policy", "/cookie-policy"],
            ]}
          />
        </div>

        {/* ========== STORE LOCATIONS ========== */}
        <div className="mt-8 border-t border-white/10 pt-7">
          <div className="mb-4 flex items-center gap-2">
            <Store size={16} className="text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Our Store Locations</h3>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {storeLocations.map((store) => (
              <a
                key={store.name}
                href={store.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 transition hover:border-indigo-400/30 hover:bg-white/[0.06]"
              >
                {/* Location pin icon box */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 transition group-hover:bg-indigo-500/20">
                  <MapPin size={16} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white group-hover:text-indigo-300">
                    {store.name}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-gray-500">
                    {store.area}
                  </p>
                </div>

                <ArrowUpRight
                  size={13}
                  className="mt-1 shrink-0 text-gray-600 opacity-0 transition group-hover:opacity-100 group-hover:text-indigo-400"
                />
              </a>
            ))}
          </div>
        </div>

        {/* ========== TRUST STRIP ========== */}
        <div className="mt-7 grid gap-2.5 border-t border-white/10 pt-6 sm:grid-cols-3">
          <TrustItem
            title="Secure payments"
            text="Protected payment processing."
          />
          <TrustItem
            title="Quality checked"
            text="Every device is carefully inspected."
          />
          <TrustItem
            title="Reliable support"
            text="We're here when you need us."
          />
        </div>

        {/* ========== SOCIAL + LEGAL ========== */}
        <div className="mt-7 flex flex-col gap-5 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <SocialLink
              href="https://www.instagram.com/surebuystore_?stkn=NHVlM2s0NTR2ejg3"
              label="Instagram"
            >
              <FaInstagram size={14} />
            </SocialLink>
            <SocialLink
              href="https://www.facebook.com/share/1BmWF5KqYP/?mibextid=wwXIfr"
              label="Facebook"
            >
              <FaFacebook size={14} />
            </SocialLink>
            <SocialLink
              href="https://youtube.com/@surebuystore?si=2yYLldp6qgrbiWxA"
              label="YouTube"
            >
              <BsYoutube size={15} />
            </SocialLink>
            <SocialLink href="https://wa.me/7853976501" label="WhatsApp">
              <FaWhatsapp size={14} />
            </SocialLink>
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500">
            <Link href="/about" className="transition hover:text-white">
              About
            </Link>
            <Link
              href="/warranty-policy"
              className="transition hover:text-white"
            >
              Warranty
            </Link>
            <Link
              href="/privacy-policy"
              className="transition hover:text-white"
            >
              Privacy
            </Link>
            <Link
              href="/terms-and-conditions"
              className="transition hover:text-white"
            >
              Terms
            </Link>
            <Link
              href="/cancellation-policy"
              className="transition hover:text-white"
            >
              Cancellation
            </Link>
          </div>
        </div>
      </div>

      {/* ========== COPYRIGHT ========== */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 text-xs text-gray-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} PhoneBhai Technologies. All rights
            reserved.
          </p>
          <p>Built for a smarter way to buy tech.</p>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>
      <h3 className="text-sm font-bold text-white">{title}</h3>
      <ul className="mt-3 space-y-2.5">
        {links.map(([label, href]) => (
          <li key={href + label}>
            <Link
              href={href}
              className="group inline-flex items-center gap-1 text-sm text-gray-400 transition hover:text-white"
            >
              {label}
              <ArrowUpRight
                size={11}
                className="opacity-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TrustItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.025] px-4 py-3 transition hover:border-white/10">
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-0.5 text-xs text-gray-500">{text}</p>
    </div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-gray-400 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white hover:text-black"
    >
      {children}
    </a>
  );
}