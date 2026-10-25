
import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  RefreshCw,
  CalendarDays,
  ClipboardCheck,
  PackageCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Headphones,
  ArrowLeft,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Return & Replacement Policy | PhoneBhai",
  description:
    "Read PhoneBhai's return and replacement policy. No refunds are offered. Eligible product issues can be reported within 7 days of delivery for verification and possible replacement.",
  robots: {
    index: false,
    follow: true,
  },
};

const sections = [
  {
    id: "eligibility",
    title: "1. Seven-Day Replacement Window",
    icon: CalendarDays,
    content:
      "If you experience an eligible functional issue with your purchased device, you must contact our support team within 7 calendar days from the date of delivery. Requests submitted after this period may not qualify for replacement under this policy.",
  },
  {
    id: "verification",
    title: "2. Inspection and Verification",
    icon: ClipboardCheck,
    content:
      "Every replacement request is subject to inspection and verification by our team. We may ask you to provide your order ID, a description of the issue, photographs or videos, and other information reasonably required to assess the claim. A replacement is not guaranteed merely because a request has been submitted.",
  },
  {
    id: "conditions",
    title: "3. Replacement Conditions",
    icon: PackageCheck,
    content:
      "The device must be made available for inspection and returned as instructed by our support team. Please retain the original packaging, accessories, and other items supplied with the product. The device must not have been intentionally damaged, tampered with, or subjected to unauthorized repairs. Any applicable statutory rights remain unaffected.",
  },
  {
    id: "process",
    title: "4. How to Request a Replacement",
    icon: RefreshCw,
    content:
      "Contact our support team within 7 days of receiving your order. Provide your order ID, delivery date, details of the issue, and supporting photographs or videos where possible. Our team will review the information, explain the next steps, and arrange an inspection if required. If the claim is approved, we will communicate the available replacement arrangements.",
  },
];

export default function ReturnRefundPolicyPage() {
  return (
    <main className="min-h-screen bg-[#080a12] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.20),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(6,182,212,0.12),transparent_45%)]" />

        <div className="relative mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-400/30 bg-indigo-500/10 text-indigo-300">
            <RefreshCw size={28} />
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Customer Protection
          </p>

          <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">
            Return &{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-300 bg-clip-text text-transparent">
              Replacement Policy
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
            We want you to have a reliable experience with your device.
            Please review our replacement terms before making a purchase.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-200">
              <CalendarDays size={16} />
              7 days from delivery
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 bg-rose-400/10 px-4 py-2 text-sm text-rose-200">
              <XCircle size={16} />
              No refunds
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-rose-400/20 bg-rose-400/[0.06] p-6 sm:p-7">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-rose-400/10 text-rose-300">
              <XCircle size={23} />
            </div>

            <h2 className="text-xl font-semibold">Refund Policy</h2>

            <p className="mt-3 text-sm leading-7 text-gray-400">
              Purchases are not eligible for refunds under our standard
              return policy. If an eligible product issue occurs within
              the replacement window, you may request a replacement
              instead. This policy does not exclude refunds or other
              remedies where required by applicable law.
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.06] p-6 sm:p-7">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
              <RefreshCw size={23} />
            </div>

            <h2 className="text-xl font-semibold">Replacement Policy</h2>

            <p className="mt-3 text-sm leading-7 text-gray-400">
              If your device develops an eligible functional issue within
              7 calendar days of delivery, contact us promptly. We will
              assess the request and verify the issue before determining
              whether a replacement can be provided.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="mb-2 text-2xl font-bold sm:text-3xl">
            Policy Details
          </h2>
          <p className="mb-7 text-sm leading-6 text-gray-400">
            Please read the following conditions carefully.
          </p>

          <div className="space-y-5">
            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <article
                  key={section.id}
                  id={section.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-indigo-400/30 sm:p-7"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-indigo-400/20 bg-indigo-500/10 text-indigo-300">
                      <Icon size={22} />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold">
                        {section.title}
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-gray-400">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <section
          id="not-covered"
          className="mt-10 rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-8"
        >
          <div className="mb-5 flex items-center gap-3">
            <AlertCircle className="shrink-0 text-amber-300" size={24} />
            <h2 className="text-xl font-semibold">
              Issues That May Not Qualify
            </h2>
          </div>

          <p className="mb-5 text-sm leading-7 text-gray-400">
            Replacement requests may be declined following verification
            where the reported issue results from circumstances such as:
          </p>

          <ul className="space-y-3">
            {[
              "Accidental or physical damage after delivery.",
              "Liquid damage or exposure to moisture.",
              "Misuse, negligence, or use contrary to device instructions.",
              "Unauthorized opening, modification, or repair.",
              "Damage caused by an external accident or event after delivery.",
              "A request made outside the applicable replacement period.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm leading-6 text-gray-300">
                <XCircle
                  size={17}
                  className="mt-1 shrink-0 text-rose-300"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p className="mt-5 text-xs leading-6 text-gray-500">
            These exclusions are subject to the facts of the case and
            applicable consumer protection laws. They do not automatically
            exclude claims involving a defect or responsibility attributable
            to the seller.
          </p>
        </section>

        <section className="mt-10 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.04] p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <CheckCircle2
              size={25}
              className="mt-1 shrink-0 text-emerald-300"
            />

            <div>
              <h2 className="text-xl font-semibold">
                What Happens After Approval?
              </h2>
              <p className="mt-3 text-sm leading-7 text-gray-400">
                If your request is approved after inspection, our team
                will explain the replacement process, return instructions,
                and the expected next steps. Replacement availability,
                timelines, and any applicable arrangements will be
                communicated to you directly.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10 overflow-hidden rounded-2xl border border-indigo-400/20 bg-gradient-to-br from-indigo-500/10 to-cyan-500/[0.06] p-6 sm:p-9">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-cyan-300">
              <Headphones size={24} />
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                Need Help With Your Order?
              </h2>
              <p className="mt-3 text-sm leading-7 text-gray-400">
                If you encounter an issue with your device, contact
                PhoneBhai customer support as soon as possible within
                7 days of delivery. Keep your order details and evidence
                of the issue ready to help us assess your request.
              </p>

              <p className="mt-3 text-sm leading-7 text-gray-400">
                Please use the official contact details provided on your
                order confirmation or on the PhoneBhai website.
              </p>

              <Link
                href="/"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Continue Shopping
                <ArrowLeft className="rotate-180" size={16} />
              </Link>
            </div>
          </div>
        </section>

        <p className="mt-8 text-center text-xs leading-6 text-gray-500">
          PhoneBhai reserves the right to verify replacement claims.
          Nothing in this policy limits any non-excludable rights or
          remedies available under applicable law.
        </p>
      </section>
    </main>
  );
}
