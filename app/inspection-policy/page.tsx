import Link from "next/link";
import {
  ArrowLeft,
  SearchCheck,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export const metadata = {
  title: "Inspection & Pricing Policy | PhoneBhai",
  description:
    "Understand how PhoneBhai inspects devices and determines the final buyback offer.",
};

const sections = [
  {
    number: "01",
    title: "Online estimate",
    content: (
      <p>
        The price displayed online is an estimated value based on the
        information provided during the valuation process.
      </p>
    ),
  },
  {
    number: "02",
    title: "Physical inspection",
    content: (
      <p>
        Before completing a transaction, the device may be inspected to verify
        its model, storage, condition, functionality and other information
        provided during valuation.
      </p>
    ),
  },
  {
    number: "03",
    title: "Final offer",
    content: (
      <p>
        If the device matches the submitted information, the estimated offer
        may remain unchanged. If material differences are found, the final
        offer may be revised.
      </p>
    ),
  },
  {
    number: "04",
    title: "Seller choice",
    content: (
      <p>
        The seller may accept or reject a revised offer before the transaction
        is completed.
      </p>
    ),
  },
];

export default function InspectionPolicyPage() {
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
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-100/60 blur-3xl" />

            <div className="relative flex flex-col gap-7 sm:flex-row sm:items-start sm:justify-between">
              <div>
                {/* Icon */}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-100 text-indigo-600 shadow-sm ring-1 ring-indigo-100">
                  <SearchCheck size={25} strokeWidth={2.2} />
                </div>

                <div className="mt-7">
                  {/* Label */}
                  <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-indigo-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    Policy
                  </div>

                  <h1 className="mt-3 text-2xl font-black tracking-[-0.03em] text-gray-950 sm:text-3xl lg:text-4xl">
                    Inspection & Pricing
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-500 sm:text-[15px]">
                    How device information and physical condition may affect
                    the final buyback price.
                  </p>
                </div>
              </div>

              {/* Trust badge */}
              <div className="shrink-0 rounded-2xl border border-gray-100 bg-gray-50/80 px-4 py-3 sm:mt-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-indigo-600" />

                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wider text-gray-400">
                      PhoneBhai
                    </p>

                    <p className="mt-0.5 text-xs font-bold text-gray-700">
                      Transparent Pricing
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Intro callout */}
            <div className="relative mt-8 rounded-2xl border border-indigo-100/80 bg-gradient-to-r from-indigo-50/70 via-white to-violet-50/50 p-5 sm:p-6">
              <div className="absolute left-0 top-5 h-10 w-1 rounded-r-full bg-gradient-to-b from-indigo-500 to-violet-500" />

              <p className="pl-3 text-sm leading-7 text-gray-600">
                Our inspection process helps ensure that the final buyback
                offer reflects the actual device condition and the information
                submitted during valuation.
              </p>
            </div>
          </div>
        </header>

        {/* Policy content */}
        <div className="mt-5 rounded-[28px] border border-gray-200/80 bg-white shadow-[0_20px_60px_-35px_rgba(15,23,42,0.25)]">
          <div className="p-5 sm:p-8 lg:p-10">
            {/* Content heading */}
            <div className="mb-2 flex items-center justify-between border-b border-gray-100 pb-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-600">
                  How it works
                </p>

                <h2 className="mt-1 text-xl font-black tracking-tight text-gray-950">
                  Inspection & Pricing Process
                </h2>
              </div>

              <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400 sm:flex">
                <SearchCheck size={18} />
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-0">
              {sections.map((section, index) => (
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
                      <h2 className="text-[17px] font-black tracking-tight text-gray-950 sm:text-lg">
                        {section.title}
                      </h2>

                      <div className="mt-3 text-sm leading-7 text-gray-600 sm:text-[14px]">
                        {section.content}
                      </div>
                    </div>
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom trust strip */}
        <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-gray-200/80 bg-white/80 p-5 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <ShieldCheck size={17} />
            </div>

            <div>
              <p className="text-xs font-bold text-gray-800">
                Transparent inspection. Fair pricing.
              </p>

              <p className="mt-0.5 text-[11px] text-gray-400">
                Your final offer reflects the actual device condition.
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