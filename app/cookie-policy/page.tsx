import Link from "next/link";
import {
  ArrowLeft,
  Cookie,
  ShieldCheck,
  Settings2,
  BarChart3,
  LockKeyhole,
  ChevronRight,
} from "lucide-react";

export const metadata = {
  title: "Cookie Policy | PhoneBhai",
  description:
    "Learn how PhoneBhai uses cookies and similar technologies on its website.",
};

const sections = [
  {
    number: "01",
    title: "What are cookies?",
    icon: Cookie,
    content: (
      <p>
        Cookies are small files or similar technologies that may be stored on
        your device when you visit a website.
      </p>
    ),
  },
  {
    number: "02",
    title: "How we may use them",
    icon: Settings2,
    content: (
      <p>
        PhoneBhai may use cookies or similar technologies to support essential
        website functionality, understand website usage, maintain security and
        improve the user experience.
      </p>
    ),
  },
  {
    number: "03",
    title: "Analytics",
    icon: BarChart3,
    content: (
      <p>
        Where analytics services are enabled, they may collect information such
        as page views, browser information and interaction events.
      </p>
    ),
  },
  {
    number: "04",
    title: "Managing cookies",
    icon: LockKeyhole,
    content: (
      <p>
        You can manage or disable cookies through your browser settings. Some
        website functionality may be affected when certain cookies are
        disabled.
      </p>
    ),
  },
];

export default function CookiePolicyPage() {
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
          {/* Gradient top border */}
          <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-indigo-600 to-violet-600" />

          <div className="relative p-6 sm:p-9 lg:p-10">
            {/* Decorative glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-100/60 blur-3xl" />

            <div className="relative flex flex-col gap-7 sm:flex-row sm:items-start sm:justify-between">
              <div>
                {/* Icon */}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-100 text-indigo-600 shadow-sm ring-1 ring-indigo-100">
                  <Cookie size={25} strokeWidth={2.2} />
                </div>

                <div className="mt-7">
                  {/* Label */}
                  <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-indigo-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    Legal & Privacy
                  </div>

                  <h1 className="mt-3 text-2xl font-black tracking-[-0.03em] text-gray-950 sm:text-3xl lg:text-4xl">
                    Cookie Policy
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-500 sm:text-[15px]">
                    Information about cookies and similar technologies used by
                    PhoneBhai.
                  </p>
                </div>
              </div>

              {/* Privacy badge */}
              <div className="shrink-0 rounded-2xl border border-gray-100 bg-gray-50/80 px-4 py-3 sm:mt-1">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-indigo-600" />

                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wider text-gray-400">
                      Website
                    </p>

                    <p className="mt-0.5 text-xs font-bold text-gray-700">
                      Cookie Transparency
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Intro callout */}
            <div className="relative mt-8 rounded-2xl border border-indigo-100/80 bg-gradient-to-r from-indigo-50/70 via-white to-violet-50/50 p-5 sm:p-6">
              <div className="absolute left-0 top-5 h-10 w-1 rounded-r-full bg-gradient-to-b from-indigo-500 to-violet-500" />

              <div className="flex gap-3">
                <Cookie
                  size={18}
                  className="mt-1 shrink-0 text-indigo-500"
                />

                <p className="text-sm leading-7 text-gray-600">
                  This policy explains what cookies are, how PhoneBhai may use
                  them, and how you can manage cookies through your browser.
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Cookie overview cards */}
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Cookie size={18} />
            </div>

            <h3 className="mt-4 text-sm font-black text-gray-950">
              Website functionality
            </h3>

            <p className="mt-1.5 text-xs leading-6 text-gray-500">
              Cookies may support essential features and website operation.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <BarChart3 size={18} />
            </div>

            <h3 className="mt-4 text-sm font-black text-gray-950">
              Website insights
            </h3>

            <p className="mt-1.5 text-xs leading-6 text-gray-500">
              Analytics may help understand how visitors interact with the
              website.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
              <LockKeyhole size={18} />
            </div>

            <h3 className="mt-4 text-sm font-black text-gray-950">
              Browser controls
            </h3>

            <p className="mt-1.5 text-xs leading-6 text-gray-500">
              You can manage or disable cookies using your browser settings.
            </p>
          </div>
        </div>

        {/* Policy content */}
        <div className="mt-5 rounded-[28px] border border-gray-200/80 bg-white shadow-[0_20px_60px_-35px_rgba(15,23,42,0.25)]">
          <div className="p-5 sm:p-8 lg:p-10">
            {/* Section heading */}
            <div className="mb-2 flex items-center justify-between border-b border-gray-100 pb-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-600">
                  Please read carefully
                </p>

                <h2 className="mt-1 text-xl font-black tracking-tight text-gray-950">
                  Cookie Information
                </h2>
              </div>

              <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400 sm:flex">
                <Cookie size={18} />
              </div>
            </div>

            {/* Policy sections */}
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

                      <div className="min-w-0 flex-1">
                        {/* Title + icon */}
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

        {/* Browser management card */}
        <div className="mt-5 overflow-hidden rounded-[24px] border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-violet-50 shadow-sm">
          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm ring-1 ring-indigo-100">
                <Settings2 size={18} />
              </div>

              <div>
                <p className="text-sm font-black text-gray-950">
                  Want to manage cookies?
                </p>

                <p className="mt-1 text-xs leading-6 text-gray-500">
                  Cookie preferences can be managed through the settings
                  provided by your web browser.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-600 shadow-sm">
              <LockKeyhole size={14} className="text-indigo-500" />
              Browser controls
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
                Transparent website practices.
              </p>

              <p className="mt-0.5 text-[11px] text-gray-400">
                Learn how cookies may be used when you visit PhoneBhai.
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