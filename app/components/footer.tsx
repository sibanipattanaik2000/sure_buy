"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowUpRight, Mail, MapPin, Phone, Zap } from "lucide-react";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { subscribeNewsletter } from "@/app/lib/newsletter";
import { BsYoutube } from "react-icons/bs";

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
    } catch (error) {
      console.error("NEWSLETTER SUBSCRIBE ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to subscribe right now. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <footer className="bg-[#0b0f19] text-white">
      {/* NEWSLETTER */}{" "}
      <div className="border-b border-white/10">
        {" "}
        <div className="mx-auto flex max-w-7xl flex-col gap-7 px-5 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          {" "}
          <div>
            {" "}
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-400">
              Stay updated{" "}
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight">
              Get the latest tech deals.
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              New arrivals, offers and useful device tips.
            </p>
          </div>
          <div className="w-full max-w-md">
            <form
              onSubmit={handleSubscribe}
              className="flex w-full rounded-2xl border border-white/10 bg-white/[0.04] p-1.5 transition focus-within:border-indigo-400/40"
            >
              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                  setMessage("");
                }}
                placeholder="Enter your email"
                aria-label="Email address"
                autoComplete="email"
                disabled={submitting}
                required
                className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-60"
              />

              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? "Subscribing..." : "Subscribe"}
              </button>
            </form>

            {message && (
              <p
                role="status"
                className="mt-2 px-1 text-xs font-medium text-green-400"
              >
                {message}
              </p>
            )}

            {error && (
              <p
                role="alert"
                className="mt-2 px-1 text-xs font-medium text-red-400"
              >
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
      {/* MAIN FOOTER */}
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* BRAND */}
          <div>
            <Link href="/" className="group inline-flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black transition duration-200 group-hover:scale-105">
                <Zap size={18} />
              </div>

              <span className="text-2xl font-black tracking-tight">
                Phone<span className="text-indigo-400">Bhai</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-gray-400">
              A smarter way to buy quality smartphones. Transparent pricing,
              quality checked devices and a simple digital experience.
            </p>

            {/* CONTACT */}
            <div className="mt-6 space-y-3">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=support@phonebhai.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-xs text-gray-400 transition hover:text-white"
              >
                <Mail size={15} className="text-indigo-400" />
                support@PhoneBhai.com
              </a>

              <a
                href="tel:+918079979945"
                className="flex items-center gap-3 text-xs text-gray-400 transition hover:text-white"
              >
                <Phone size={15} className="text-indigo-400" />
                +91 8079979945
              </a>

              <div className="flex items-center gap-3 text-xs text-gray-400">
                <MapPin size={15} className="text-indigo-400" />
                Odisha, India
              </div>
            </div>
          </div>

          {/* COMPANY */}
          <FooterColumn
            title="Company"
            links={[
              ["About PhoneBhai", "/about"],
              ["How it works", "/how-it-works"],
              ["Buy devices", "/buy"],
            ]}
          />

          {/* SHOP */}
          <FooterColumn
            title="Shop"
            links={[
              ["Browse phones", "/buy"],
              ["Track order", "/orders"],
            ]}
          />

          {/* SUPPORT */}
          <FooterColumn
            title="Support & Policies"
            links={[
              ["Privacy Policy", "/privacy-policy"],
              ["Cancellation Policy", "/cancellation-policy"],
              ["Inspection Policy", "/inspection-policy"],
              ["Device Handover Policy", "/device-handover-policy"],
              ["Cookie Policy", "/cookie-policy"],
              ["Terms & Conditions", "/terms-and-conditions"],
            ]}
          />
        </div>

        {/* TRUST */}
        <div className="mt-14 grid gap-4 border-t border-white/10 pt-8 md:grid-cols-3">
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

        {/* SOCIAL */}
        <div className="mt-10 flex flex-col gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
              Follow PhoneBhai
            </p>

            <div className="mt-3 flex items-center gap-2">
              {/* INSTAGRAM */}
              <a
                href="https://www.instagram.com/surebuystore_?stkn=NHVlM2s0NTR2ejg3"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-gray-400 transition duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white hover:text-black"
              >
                <FaInstagram size={16} />
              </a>

              {/* FACEBOOK */}
              <a
                href="https://www.facebook.com/share/1BmWF5KqYP/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-gray-400 transition duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white hover:text-black"
              >
                <FaFacebook size={16} />
              </a>

              {/* YOUTUBE */}
              <a
                href="https://youtube.com/@surebuystore?si=2yYLldp6qgrbiWxA"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-gray-400 transition duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white hover:text-black"
              >
                <BsYoutube size={17} />
              </a>
              {/*Whatsapp */}
              <a
                href="https://wa.me/7853976501"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-gray-400 transition duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white hover:text-black"
              >
                <FaWhatsapp size={16} />
              </a>
            </div>
          </div>

          {/* LEGAL LINKS */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500">
            <Link
              href="/privacy-policy"
              className="transition hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms-and-conditions"
              className="transition hover:text-white"
            >
              Terms & Conditions
            </Link>

            <Link
              href="/cancellation-policy"
              className="transition hover:text-white"
            >
              Cancellation
            </Link>

            <Link href="/cookie-policy" className="transition hover:text-white">
              Cookies
            </Link>
          </div>
        </div>
      </div>
      {/* COPYRIGHT */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-gray-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
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

/* FOOTER COLUMN */

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: [string, string][];
}) {
  return (
    <div>
      {" "}
      <h3 className="text-sm font-bold text-white">{title}</h3>
      <ul className="mt-5 space-y-3.5">
        {links.map(([label, href]) => (
          <li key={href}>
            <Link
              href={href}
              className="group inline-flex items-center gap-1 text-sm text-gray-400 transition hover:text-white"
            >
              {label}

              <ArrowUpRight
                size={12}
                className="opacity-0 transition duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
              />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* TRUST */

function TrustItem({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-5 transition duration-200 hover:border-white/10 hover:bg-white/[0.04]">
      {" "}
      <p className="text-sm font-bold">{title}</p>
      <p className="mt-1 text-xs leading-5 text-gray-500">{text}</p>
    </div>
  );
}
