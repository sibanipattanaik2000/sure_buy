import Link from "next/link";
import {
  ArrowLeft,
  Ban,
  ShieldCheck,
  CalendarClock,
  RefreshCw,
  ClipboardCheck,
  Phone,
  Mail,
  ChevronRight,
} from "lucide-react";

export const metadata = {
  title: "Cancellation Policy | PhoneBhai",
  description:
    "Learn about cancellation and rescheduling of PhoneBhai mobile phone pickup requests.",
};

const sections = [
  {
    number: "01",
    title: "Pickup cancellation",
    icon: Ban,
    content: (
      <p>
        A seller may contact PhoneBhai to cancel a pickup request before the
        transaction is completed.
      </p>
    ),
  },
  {
    number: "02",
    title: "Rescheduling",
    icon: CalendarClock,
    content: (
      <p>
        Pickup dates and times may be rescheduled depending on availability and
        operational circumstances.
      </p>
    ),
  },
  {
    number: "03",
    title: "Cancellation after inspection",
    icon: ClipboardCheck,
    content: (
      <p>
        If the final offer changes following physical inspection, the seller
        may accept or reject the revised offer before the sale is completed.
      </p>
    ),
  },
  {
    number: "04",
    title: "Contact",
    icon: Phone,
    content: (
      <p>
        For cancellation or rescheduling assistance, contact
        <a
          href="mailto:support@PhoneBhai.com"
          className="font-bold text-indigo-600 transition hover:text-indigo-700"
        >
          {" "}
          support@PhoneBhai.com
        </a>{" "}
        or call
        <a
          href="tel:+918079979945"
          className="font-bold text-indigo-600 transition hover:text-indigo-700"
        >
          {" "}
          +91 80799 79945
        </a>
        .
      </p>
    ),
  },
];

export default function CancellationPolicyPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f7fb] text-gray-900">
      {/* Background accents */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="absolute -right-32 top-40 h-96 w-96 rounded-full bg-violet-200/25 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">
        {/* Hero */}
        <header className="relative overflow-hidden rounded-[28px] border border-gray-200/80 bg-white shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)]">
          {/* Gradient top line */}
          <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-indigo-600 to-violet-600" />

          <div className="relative p-6 sm:p-9 lg:p-10">
            {/* Decorative glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-100/60 blur-3xl" />

            <div className="relative flex flex-col gap-7 sm:flex-row sm:items-start sm:justify-between">
              <div>
                {/* Icon */}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-100 text-indigo-600 shadow-sm ring-1 ring-indigo-100">
                  <Ban size={25} strokeWidth={2.2} />
                </div>

                <div className="mt-7">
                  {/* Label */}
                  <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-indigo-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    Legal & Service
                  </div>

                  <h1 className="mt-3 text-2xl font-black tracking-[-0.03em] text-gray-950 sm:text-3xl lg:text-4xl">
                    Cancellation Policy
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-500 sm:text-[15px]">
                    Information about cancelling or rescheduling a PhoneBhai
                    pickup request.
                  </p>
                </div>
              </div>

              {/* Policy badge */}
              <div className="shrink-0 rounded-2xl border border-gray-100 bg-gray-50/80 px-4 py-3 sm:mt-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-indigo-600" />

                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wider text-gray-400">
                      PhoneBhai
                    </p>

                    <p className="mt-0.5 text-xs font-bold text-gray-700">
                      Flexible Pickup
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Intro callout */}
            <div className="relative mt-8 rounded-2xl border border-indigo-100/80 bg-gradient-to-r from-indigo-50/70 via-white to-violet-50/50 p-5 sm:p-6">
              <div className="absolute left-0 top-5 h-10 w-1 rounded-r-full bg-gradient-to-b from-indigo-500 to-violet-500" />

              <div className="flex gap-3">
                <RefreshCw
                  size={18}
                  className="mt-1 shrink-0 text-indigo-500"
                />

                <p className="text-sm leading-7 text-gray-600">
                  Need to change your pickup plans? This policy explains how
                  cancellation and rescheduling work before a transaction is
                  completed.
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Quick overview */}
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Ban size={18} />
            </div>

            <h3 className="mt-4 text-sm font-black text-gray-950">
              Cancel pickup
            </h3>

            <p className="mt-1.5 text-xs leading-6 text-gray-500">
              Pickup requests can be cancelled before the transaction is
              completed.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <CalendarClock size={18} />
            </div>

            <h3 className="mt-4 text-sm font-black text-gray-950">
              Reschedule
            </h3>

            <p className="mt-1.5 text-xs leading-6 text-gray-500">
              Pickup dates and times may be changed based on availability.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
              <RefreshCw size={18} />
            </div>

            <h3 className="mt-4 text-sm font-black text-gray-950">
              Seller choice
            </h3>

            <p className="mt-1.5 text-xs leading-6 text-gray-500">
              You can accept or reject a revised offer before completing the
              sale.
            </p>
          </div>
        </div>

        {/* Policy content */}
        <div className="mt-5 rounded-[28px] border border-gray-200/80 bg-white shadow-[0_20px_60px_-35px_rgba(15,23,42,0.25)]">
          <div className="p-5 sm:p-8 lg:p-10">
            {/* Heading */}
            <div className="mb-2 flex items-center justify-between border-b border-gray-100 pb-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-600">
                  Please read carefully
                </p>

                <h2 className="mt-1 text-xl font-black tracking-tight text-gray-950">
                  Cancellation & Rescheduling
                </h2>
              </div>

              <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400 sm:flex">
                <Ban size={18} />
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-0">
              {sections.map((section, index) => {
                const Icon = section.icon;

                return (
                  <section
                    key={section.title}
                    className={`group relative py-7 ${
                      index !== sections.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    <div className="flex gap-4 sm:gap-6">
                      {/* Number */}
                      <div className="shrink-0">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-[10px] font-black tracking-wider text-indigo-500 ring-1 ring-gray-100 transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:ring-indigo-600">
                          {section.number}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <Icon
                            size={16}
                            className="text-indigo-500 transition-colors group-hover:text-indigo-600"
                          />

                          <h2 className="text-[17px] font-black tracking-tight text-gray-950 sm:text-lg">
                            {section.title}
                          </h2>
                        </div>

                        <div className="mt-3 text-sm leading-7 text-gray-600 sm:text-[14px]">
                          {section.content}
                        </div>
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </div>

        {/* Contact card */}
        <div className="mt-5 overflow-hidden rounded-[24px] border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-violet-50 shadow-sm">
          <div className="p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100">
                <Phone size={18} />
              </div>

              <div>
                <p className="text-sm font-black text-gray-950">
                  Need cancellation assistance?
                </p>

                <p className="mt-1 text-xs leading-6 text-gray-500">
                  Contact the PhoneBhai support team for help with your pickup
                  request.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <a
                href="mailto:support@PhoneBhai.com"
                className="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                  <Mail size={16} />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-black uppercase tracking-wider text-gray-400">
                    Email
                  </p>

                  <p className="truncate text-xs font-bold text-gray-800">
                    support@PhoneBhai.com
                  </p>
                </div>

                <ChevronRight
                  size={15}
                  className="ml-auto text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500"
                />
              </a>

              <a
                href="tel:+918079979945"
                className="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition group-hover:bg-indigo-600 group-hover:text-white">
                  <Phone size={16} />
                </div>

                <div>
                  <p className="text-[9px] font-black uppercase tracking-wider text-gray-400">
                    Phone
                  </p>

                  <p className="text-xs font-bold text-gray-800">
                    +91 80799 79945
                  </p>
                </div>

                <ChevronRight
                  size={15}
                  className="ml-auto text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-gray-200/80 bg-white/80 p-5 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <ShieldCheck size={17} />
            </div>

            <div>
              <p className="text-xs font-bold text-gray-800">
                Simple. Flexible. Transparent.
              </p>

              <p className="mt-0.5 text-[11px] text-gray-400">
                Please review the policy before scheduling your pickup.
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gray-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-indigo-600"
          >
            Visit PhoneBhai
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </main>
  );
}