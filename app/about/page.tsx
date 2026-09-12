"use client";

import Link from "next/link";

import {
ArrowRight,
CheckCircle2,
MapPin,
ShieldCheck,
Star,
Users,
} from "lucide-react";

export default function AboutPage() {
return ( <main className="min-h-screen overflow-hidden bg-[#f7f8fa] text-gray-900">
{/* HERO */} <section className="relative overflow-hidden border-b border-gray-200 bg-white">
{/* BACKGROUND GLOW */} <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl" /> <div className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-violet-200/30 blur-3xl" />
    <div className="relative mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
        {/* LEFT */}
        <div>
          <div className="group inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/80 px-4 py-2 shadow-sm backdrop-blur-sm transition duration-300 hover:border-indigo-200 hover:bg-indigo-50 hover:shadow-md">
            <MapPin
              size={14}
              className="text-indigo-600 transition-transform duration-300 group-hover:-translate-y-0.5"
            />

            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-600">
              Established in Bhubaneswar
            </span>
          </div>

          <h1 className="mt-6 max-w-2xl text-3xl font-black leading-[1.05] tracking-[-0.035em] text-gray-950 sm:text-4xl lg:text-5xl">
            Local experience,
            <br />
            now made simpler{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 bg-clip-text text-transparent">
              online.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-gray-500 sm:text-lg">
            PhoneBhai brings established mobile-phone
            experience into a fast, transparent and
            convenient doorstep service. Get a clear
            estimate, understand the process and sell
            your phone with confidence.
          </p>

          {/* BUTTONS */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/sell"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gray-950 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-gray-950/15 transition duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 transition-transform duration-500 group-hover:translate-x-0" />

              <span className="relative">
                Get instant price
              </span>

              <ArrowRight
                size={17}
                className="relative transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            <Link
              href="/how-it-works"
              className="group inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-bold text-gray-700 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:text-indigo-600 hover:shadow-md"
            >
              How it works
              <ArrowRight
                size={15}
                className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
              />
            </Link>
          </div>

          {/* SMALL TRUST */}
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-50">
                <CheckCircle2
                  size={15}
                  className="text-green-600"
                />
              </div>

              <span className="text-xs font-semibold text-gray-500">
                Transparent process
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-50">
                <ShieldCheck
                  size={15}
                  className="text-indigo-600"
                />
              </div>

              <span className="text-xs font-semibold text-gray-500">
                Secure doorstep service
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT — ANIMATED PHONE */}
        <div className="group relative flex min-h-[430px] items-center justify-center overflow-hidden rounded-[2rem] border border-indigo-100/70 bg-gradient-to-br from-indigo-50 via-white to-violet-50 shadow-[0_25px_80px_rgba(79,70,229,0.10)]">
          {/* BACKGROUND LIGHT */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.12),transparent_55%)]" />

          {/* GLOW */}
          <div className="absolute h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl animate-pulse" />

          {/* ORBIT RINGS */}
          <div className="absolute h-64 w-64 rounded-full border border-indigo-200/70 shadow-[0_0_40px_rgba(99,102,241,0.08)]" />

          <div className="absolute h-80 w-80 rounded-full border border-indigo-100/80" />

          {/* ORBIT DOT */}
          <div className="absolute h-72 w-72 animate-[spin_12s_linear_infinite]">
            <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-indigo-500 shadow-lg shadow-indigo-400/50" />
          </div>

          <div className="absolute h-80 w-80 animate-[spin_18s_linear_infinite_reverse]">
            <span className="absolute bottom-3 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-violet-500 shadow-lg shadow-violet-400/40" />
          </div>

          {/* PHONE */}
          <div className="relative z-10 animate-[float_4s_ease-in-out_infinite]">
            <div className="absolute -inset-3 rounded-[2.7rem] bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-indigo-500/20 blur-xl opacity-70" />

            <div className="relative h-[310px] w-[155px] rotate-[-8deg] rounded-[2.3rem] border-[5px] border-gray-900 bg-gray-950 p-[5px] shadow-[0_35px_70px_rgba(79,70,229,0.35)] transition-transform duration-700 group-hover:rotate-0">
              {/* SCREEN */}
              <div className="relative h-full w-full overflow-hidden rounded-[1.9rem] bg-gradient-to-b from-indigo-600 via-indigo-500 to-violet-700">
                {/* LIGHT EFFECTS */}
                <div className="absolute -right-12 top-8 h-36 w-36 rounded-full bg-white/20 blur-3xl" />

                <div className="absolute -left-12 bottom-10 h-36 w-36 rounded-full bg-violet-300/20 blur-3xl" />

                {/* CAMERA */}
                <div className="absolute left-1/2 top-2 z-20 h-5 w-14 -translate-x-1/2 rounded-full bg-black shadow-sm" />

                {/* CONTENT */}
                <div className="relative flex h-full flex-col items-center justify-center px-4 text-center text-white">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/15 text-2xl shadow-lg backdrop-blur-md">
                    📱
                  </div>

                  <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/70">
                    PhoneBhai
                  </p>

                  <h3 className="mt-2 text-2xl font-black">
                    Sell Smart.
                  </h3>

                  <p className="mt-2 text-[10px] leading-4 text-white/70">
                    Get a transparent price
                    for your phone.
                  </p>

                  <div className="mt-6 rounded-full bg-white px-4 py-2.5 text-[9px] font-black text-indigo-600 shadow-xl transition-transform duration-300 hover:scale-105">
                    Get instant price
                  </div>
                </div>

                {/* HOME INDICATOR */}
                <div className="absolute bottom-2 left-1/2 h-1 w-12 -translate-x-1/2 rounded-full bg-white/60" />
              </div>
            </div>

            {/* PHONE SHADOW */}
            <div className="absolute -bottom-8 left-1/2 h-8 w-24 -translate-x-1/2 rounded-full bg-indigo-500/20 blur-xl" />
          </div>

          {/* TOP FLOATING CARD */}
          <div className="absolute left-5 top-8 rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-[0_15px_35px_rgba(15,23,42,0.10)] backdrop-blur-xl animate-[floatSmall_3s_ease-in-out_infinite]">
            <div className="mb-1 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-sm shadow-green-500/50" />

              <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                Trusted locally
              </p>
            </div>

            <p className="text-sm font-black text-gray-900">
              30,000+ customers
            </p>
          </div>

          {/* BOTTOM FLOATING CARD */}
          <div className="absolute bottom-10 right-5 rounded-2xl border border-white/80 bg-white/80 px-4 py-3 shadow-[0_15px_35px_rgba(15,23,42,0.10)] backdrop-blur-xl animate-[floatSmall_3.5s_ease-in-out_infinite_reverse]">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 shadow-sm">
                <CheckCircle2
                  size={17}
                  className="text-green-600"
                />
              </div>

              <div>
                <p className="text-[9px] font-bold text-gray-400">
                  Transparent
                </p>

                <p className="text-xs font-black text-gray-900">
                  Simple & Secure
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* BUILT ON TRUST */}
  <section className="relative mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
          Built on real local trust
        </p>

        <h2 className="mt-3 text-3xl font-black tracking-[-0.025em] text-gray-950 sm:text-4xl">
          Experience you can
          <br />
          actually trust.
        </h2>
      </div>

      <div>
        <p className="text-base leading-7 text-gray-500">
          PhoneBhai STORE has served more than
          30,000 customers in Bhubaneswar.
          PhoneBhai extends that experience
          online so sellers can understand
          their phone&apos;s estimated value
          before arranging a visit or pickup.
        </p>
      </div>
    </div>

    {/* STATS */}
    <div className="mt-12 grid gap-4 sm:grid-cols-3">
      <StatCard
        icon={<Users size={20} />}
        value="30,000+"
        label="Customers served"
      />

      <StatCard
        icon={<Star size={20} />}
        value="1,400+"
        label="Google reviews"
      />

      <StatCard
        icon={<Star size={20} />}
        value="4.2 ★"
        label="Google rating"
      />
    </div>
  </section>

  {/* FOCUS */}
  <section className="relative overflow-hidden border-y border-gray-200 bg-white">
    <div className="pointer-events-none absolute -right-40 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-indigo-100/40 blur-3xl" />

    <div className="relative mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
      <div className="max-w-2xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
          Our focus
        </p>

        <h2 className="mt-3 text-3xl font-black tracking-[-0.025em] text-gray-950 sm:text-4xl">
          Focused on one city
          <br />
          and one category.
        </h2>

        <p className="mt-5 text-base leading-7 text-gray-500">
          Phase 1 is intentionally dedicated to
          mobile phones in Bhubaneswar. That
          focus helps us provide responsive local
          support, practical pickup windows and
          a clear inspection process.
        </p>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <FeatureCard
          number="01"
          title="Local support"
          text="Get practical support from a team focused on your city."
        />

        <FeatureCard
          number="02"
          title="Clear inspection"
          text="Understand how your device is evaluated before the final offer."
        />

        <FeatureCard
          number="03"
          title="Convenient pickup"
          text="Choose a practical pickup window without unnecessary hassle."
        />
      </div>
    </div>
  </section>

  {/* CTA */}
  <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
    <div className="group relative overflow-hidden rounded-[2rem] bg-gray-950 px-6 py-12 text-center shadow-[0_25px_80px_rgba(15,23,42,0.15)] sm:px-10">
      {/* CTA GLOWS */}
      <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-indigo-600/30 blur-3xl transition duration-700 group-hover:bg-indigo-500/40" />

      <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-violet-600/20 blur-3xl" />

      <div className="absolute -bottom-20 -left-20 h-52 w-52 rounded-full bg-indigo-600/20 blur-3xl" />

      <div className="relative">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-300">
          Ready to get started?
        </p>

        <h2 className="mt-3 text-3xl font-black tracking-[-0.025em] text-white sm:text-4xl">
          Ready for a transparent
          <br />
          estimate?
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-400">
          Get an instant estimate for your phone
          and start your selling journey with
          PhoneBhai.
        </p>

        <Link
          href="/sell"
          className="group/button mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-black text-gray-950 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:bg-indigo-50 hover:shadow-2xl"
        >
          Get instant price

          <ArrowRight
            size={17}
            className="transition-transform duration-300 group-hover/button:translate-x-1"
          />
        </Link>
      </div>
    </div>
  </section>
</main>

);
}

/* STAT CARD */

function StatCard({
icon,
value,
label,
}: {
icon: React.ReactNode;
value: string;
label: string;
}) {
return ( <div className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-200 hover:shadow-[0_20px_45px_rgba(79,70,229,0.10)]">
{/* HOVER GLOW */} <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-indigo-100/60 blur-2xl opacity-0 transition duration-500 group-hover:opacity-100" />

  <div className="relative">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-violet-50 text-indigo-600 transition duration-300 group-hover:scale-105 group-hover:shadow-md">
      {icon}
    </div>

    <p className="mt-5 text-3xl font-black tracking-tight text-gray-950">
      {value}
    </p>

    <p className="mt-1 text-sm font-semibold text-gray-500">
      {label}
    </p>
  </div>
</div>
);
}

/* FEATURE CARD */

function FeatureCard({
number,
title,
text,
}: {
number: string;
title: string;
text: string;
}) {
return ( <div className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-200 hover:bg-white hover:shadow-[0_20px_45px_rgba(79,70,229,0.08)]">
{/* TOP GRADIENT LINE */} <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
  <span className="inline-flex h-7 items-center rounded-full border border-indigo-100 bg-indigo-50 px-2.5 text-[10px] font-black text-indigo-600 transition duration-300 group-hover:border-indigo-200 group-hover:bg-indigo-100">
    {number}
  </span>

  <h3 className="mt-4 text-base font-black text-gray-950">
    {title}
  </h3>

  <p className="mt-2 text-sm leading-6 text-gray-500">
    {text}
  </p>
</div>
);
}
