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
  return (
    <main className="min-h-screen bg-[#f7f8fa] text-gray-900">
      {/* HERO */}
      <section className="overflow-hidden border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.9fr]">
            {/* LEFT */}

            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2">
                <MapPin
                  size={14}
                  className="text-indigo-600"
                />

                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-600">
                  Established in Bhubaneswar
                </span>
              </div>

              <h1 className="mt-6 max-w-2xl text-4xl font-black leading-[1.08] tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
                Local experience,
                <br />
                now made simpler{" "}
                <span className="text-indigo-600">
                  online.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-gray-500 sm:text-lg">
                SureBuy brings established mobile-phone
                experience into a fast, transparent and
                convenient doorstep service. Get a clear
                estimate, understand the process and sell
                your phone with confidence.
              </p>

              {/* BUTTONS */}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/sell"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700"
                >
                  Get instant price
                  <ArrowRight size={17} />
                </Link>

                <Link
                  href="/how-it-works"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-bold text-gray-700 transition hover:border-indigo-300 hover:text-indigo-600"
                >
                  How it works
                </Link>
              </div>

              {/* SMALL TRUST */}

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    size={17}
                    className="text-green-600"
                  />

                  <span className="text-xs font-semibold text-gray-500">
                    Transparent process
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <ShieldCheck
                    size={17}
                    className="text-indigo-600"
                  />

                  <span className="text-xs font-semibold text-gray-500">
                    Secure doorstep service
                  </span>
                </div>
              </div>
            </div>

            {/* RIGHT — ANIMATED PHONE */}

            <div className="relative flex min-h-[430px] items-center justify-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-50 via-white to-violet-50">
              {/* GLOW */}

              <div className="absolute h-72 w-72 rounded-full bg-indigo-300/30 blur-3xl animate-pulse" />

              {/* ORBIT RINGS */}

              <div className="absolute h-64 w-64 rounded-full border border-indigo-200/70" />

              <div className="absolute h-80 w-80 rounded-full border border-indigo-100/80" />

              {/* ORBIT DOT */}

              <div className="absolute h-72 w-72 animate-[spin_12s_linear_infinite]">
                <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-indigo-500 shadow-lg shadow-indigo-400/50" />
              </div>

              <div className="absolute h-80 w-80 animate-[spin_18s_linear_infinite_reverse]">
                <span className="absolute bottom-3 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-violet-500" />
              </div>

              {/* PHONE */}

              <div className="relative z-10 animate-[float_4s_ease-in-out_infinite]">
                <div className="relative h-[310px] w-[155px] rotate-[-8deg] rounded-[2.3rem] border-[5px] border-gray-900 bg-gray-950 p-[5px] shadow-[0_35px_70px_rgba(79,70,229,0.35)] transition-transform duration-700 hover:rotate-0">
                  {/* SCREEN */}

                  <div className="relative h-full w-full overflow-hidden rounded-[1.9rem] bg-gradient-to-b from-indigo-600 via-indigo-500 to-violet-700">
                    {/* LIGHT EFFECTS */}

                    <div className="absolute -right-12 top-8 h-36 w-36 rounded-full bg-white/20 blur-3xl" />

                    <div className="absolute -left-12 bottom-10 h-36 w-36 rounded-full bg-violet-300/20 blur-3xl" />

                    {/* CAMERA */}

                    <div className="absolute left-1/2 top-2 z-20 h-5 w-14 -translate-x-1/2 rounded-full bg-black" />

                    {/* CONTENT */}

                    <div className="relative flex h-full flex-col items-center justify-center px-4 text-center text-white">
                      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-2xl shadow-lg backdrop-blur-md">
                        📱
                      </div>

                      <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-white/70">
                        SureBuy
                      </p>

                      <h3 className="mt-2 text-2xl font-black">
                        Sell Smart.
                      </h3>

                      <p className="mt-2 text-[10px] leading-4 text-white/70">
                        Get a transparent price
                        for your phone.
                      </p>

                      <div className="mt-6 rounded-full bg-white px-4 py-2.5 text-[9px] font-black text-indigo-600 shadow-xl">
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

              <div className="absolute left-5 top-8 rounded-2xl border border-white/70 bg-white/85 px-4 py-3 shadow-xl backdrop-blur-md animate-[floatSmall_3s_ease-in-out_infinite]">
                <p className="text-[9px] font-bold uppercase tracking-wider text-gray-400">
                  Trusted locally
                </p>

                <p className="mt-1 text-sm font-black text-gray-900">
                  30,000+ customers
                </p>
              </div>

              {/* BOTTOM FLOATING CARD */}

              <div className="absolute bottom-10 right-5 rounded-2xl border border-white/70 bg-white/85 px-4 py-3 shadow-xl backdrop-blur-md animate-[floatSmall_3.5s_ease-in-out_infinite_reverse]">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
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

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
              Built on real local trust
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
              Experience you can
              <br />
              actually trust.
            </h2>
          </div>

          <div>
            <p className="text-base leading-7 text-gray-500">
              SUREBUY STORE has served more than
              30,000 customers in Bhubaneswar.
              SureBuy extends that experience
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

      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
              Our focus
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
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
        <div className="relative overflow-hidden rounded-[2rem] bg-gray-950 px-6 py-12 text-center sm:px-10">
          <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-indigo-600/30 blur-3xl" />

          <div className="relative">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-300">
              Ready to get started?
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Ready for a transparent
              <br />
              estimate?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-400">
              Get an instant estimate for your phone
              and start your selling journey with
              SureBuy.
            </p>

            <Link
              href="/sell"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-black text-gray-950 transition hover:-translate-y-0.5 hover:bg-gray-100"
            >
              Get instant price
              <ArrowRight size={17} />
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
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        {icon}
      </div>

      <p className="mt-5 text-3xl font-black tracking-tight text-gray-950">
        {value}
      </p>

      <p className="mt-1 text-sm font-semibold text-gray-500">
        {label}
      </p>
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
  return (
    <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 transition hover:-translate-y-1 hover:border-indigo-200 hover:bg-white hover:shadow-sm">
      <span className="text-xs font-black text-indigo-600">
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