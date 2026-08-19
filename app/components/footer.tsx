import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
  Zap,
} from "lucide-react";

import {
    FaFacebook,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-[#0b0f19] text-white">

      {/* NEWSLETTER / CTA */}

      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-0 px-0 py-10 lg:flex-row lg:items-center lg:justify-between lg:px-8">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-400">
              Stay updated
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight">
              Get the latest tech deals.
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              New arrivals, offers and useful device tips.
            </p>
          </div>

          <div className="flex w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-1.5">
            <input
              type="email"
              placeholder="Enter your email"
              aria-label="Email address"
              className="min-w-0 flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-gray-500"
            />

            <button className="rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-black transition hover:bg-gray-200">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* MAIN FOOTER */}

      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">

          {/* BRAND */}

          <div>
            <Link
              href="/"
              className="group inline-flex items-center gap-2.5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black transition group-hover:scale-105">
                <Zap size={18} />
              </div>

              <span className="text-2xl font-black tracking-tight">
                Phone<span className="text-indigo-400">Bhai</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-gray-400">
              A smarter way to buy, sell and repair technology. Transparent
              pricing, quality checked devices and a simple digital experience.
            </p>

            {/* CONTACT */}

            <div className="mt-6 space-y-3">
              <ContactItem
                icon={<Mail size={15} />}
                text="support@PhoneBhai.com"
              />

              <ContactItem
                icon={<Phone size={15} />}
                text="+91 8079979945"
              />

              <ContactItem
                icon={<MapPin size={15} />}
                text="India"
              />
            </div>
          </div>

          {/* COMPANY */}

          <FooterColumn
            title="Company"
            links={[
              ["About PhoneBhai", "/about"],
              ["Careers", "/careers"],
              ["Contact", "/contact"],
              ["Our stores", "/stores"],
            ]}
          />

          {/* SERVICES */}

          <FooterColumn
            title="Services"
            links={[
              ["Buy a device", "/buy"],
              ["Sell your device", "/sell"],
              ["Device repair", "/repair"],
              ["Track order", "/orders"],
            ]}
          />

          {/* SUPPORT */}

          <FooterColumn
            title="Support"
            links={[
              ["Help center", "/help"],
              ["FAQs", "/faq"],
              ["Warranty", "/warranty"],
              ["Shipping", "/shipping"],
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

        {/* SOCIAL + LEGAL */}

      {/* SOCIAL + LEGAL */}

<div className="mt-10 flex flex-col gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">

{/* SOCIAL */}

<div className="flex items-center gap-2">
  <a
    href="https://www.facebook.com/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Facebook"
    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-gray-500 transition duration-200 hover:border-white/20 hover:bg-white hover:text-black"
  >
    <FaFacebook size={15} />
  </a>

  <a
    href="https://www.instagram.com/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Instagram"
    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-gray-500 transition duration-200 hover:border-white/20 hover:bg-white hover:text-black"
  >
    <FaInstagram size={15} />
  </a>

  <a
    href="https://x.com/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="X"
    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-gray-500 transition duration-200 hover:border-white/20 hover:bg-white hover:text-black"
  >
    <FaXTwitter size={15} />
  </a>
</div>

  {/* LEGAL */}

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
      Cancellation Policy
    </Link>

    <Link
      href="/inspection-policy"
      className="transition hover:text-white"
    >
      Inspection & Pricing
    </Link>

    <Link
      href="/cookie-policy"
      className="transition hover:text-white"
    >
      Cookies
    </Link>

    <Link
      href="/device-handover-policy"
      className="transition hover:text-white"
    >
      Device Handover
    </Link>
  </div>

</div>
      </div>

      {/* COPYRIGHT */}

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-xs text-gray-600 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>
            © {new Date().getFullYear()} PhoneBhai Technologies. All rights
            reserved.
          </p>

          <p>Built for a smarter way to buy and sell tech.</p>
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

/* CONTACT */

function ContactItem({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3 text-xs text-gray-400">
      <span className="text-indigo-400">{icon}</span>
      {text}
    </div>
  );
}

/* TRUST */

function TrustItem({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.025] p-5">
      <p className="text-sm font-bold">{title}</p>

      <p className="mt-1 text-xs leading-5 text-gray-500">{text}</p>
    </div>
  );
}

/* SOCIAL */

function SocialButton({
  label,
  icon,
}: {
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-gray-500 transition duration-200 hover:border-white/20 hover:bg-white hover:text-black"
    >
      {icon}
    </button>
  );
}