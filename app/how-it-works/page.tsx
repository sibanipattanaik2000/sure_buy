"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  MapPin,
  PackageCheck,
  Smartphone,
  ShieldCheck,
  Truck,
} from "lucide-react";

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f7] text-gray-900">
      {/* HERO */}

      <section className="overflow-hidden border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.85fr]">
            {/* LEFT */}

            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-100 px-4 py-2">
                <CheckCircle2 size={14} className="text-gray-900" />

                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-900">
                  Simple & transparent
                </span>
              </div>

              <h1 className="mt-6 max-w-2xl text-4xl font-black leading-[1.08] tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
                Selling your phone
                <br />
                made <span className="text-black">simple.</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-gray-500 sm:text-lg">
                From getting your estimate to receiving your payment, we keep
                the entire process clear, convenient and easy to understand.
              </p>

              <Link
                href="/sell"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-black px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-black/15 transition hover:-translate-y-0.5 hover:bg-gray-800"
              >
                Get instant price
                <ArrowRight size={17} />
              </Link>
            </div>

            {/* RIGHT VISUAL */}

            <div className="relative flex min-h-[380px] items-center justify-center overflow-hidden rounded-[2rem] bg-gradient-to-br from-gray-100 via-white to-gray-200 sm:min-h-[420px]">
              {/* BACKGROUND EFFECTS */}

              <div className="absolute h-72 w-72 rounded-full bg-gray-400/20 blur-3xl" />

              <div className="absolute h-64 w-64 rounded-full border border-gray-300/70" />

              <div className="absolute h-80 w-80 rounded-full border border-gray-200/80" />

              {/* PHONE */}

              <div className="relative z-10 animate-[float_4s_ease-in-out_infinite]">
                <div className="relative h-[290px] w-[145px] rotate-[-7deg] rounded-[2.2rem] border-[5px] border-gray-900 bg-gray-950 p-[5px] shadow-[0_30px_60px_rgba(0,0,0,0.25)]">
                  <div className="relative h-full w-full overflow-hidden rounded-[1.8rem] bg-gradient-to-b from-gray-800 to-black">
                    <div className="absolute left-1/2 top-2 h-5 w-14 -translate-x-1/2 rounded-full bg-black" />

                    <div className="flex h-full flex-col items-center justify-center px-5 text-center text-white">
                      <Smartphone size={35} strokeWidth={1.5} />

                      <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.2em] text-white/70">
                        PhoneBhai
                      </p>

                      <h3 className="mt-2 text-xl font-black">
                        Sell with confidence
                      </h3>

                      <p className="mt-2 text-[10px] leading-4 text-white/70">
                        A simple process from estimate to payment.
                      </p>
                    </div>

                    <div className="absolute bottom-2 left-1/2 h-1 w-12 -translate-x-1/2 rounded-full bg-white/60" />
                  </div>
                </div>
              </div>

              {/* FLOATING EASY PROCESS CARD */}

              <div className="absolute left-3 top-8 z-20 animate-[float_5s_ease-in-out_infinite] rounded-2xl border border-white/80 bg-white/95 px-4 py-3 shadow-[0_12px_35px_rgba(0,0,0,0.12)] backdrop-blur-xl sm:left-8 sm:top-12">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black text-white">
                    <CheckCircle2 size={18} />
                  </div>

                  <div>
                    <p className="whitespace-nowrap text-[9px] font-bold uppercase tracking-wider text-gray-400">
                      Easy process
                    </p>

                    <p className="whitespace-nowrap text-sm font-black text-gray-950">
                      4 simple steps
                    </p>
                  </div>
                </div>
              </div>

              {/* FLOATING TRANSPARENCY CARD */}

              <div className="absolute bottom-8 right-3 z-20 animate-[float_4.5s_ease-in-out_infinite] rounded-2xl border border-white/80 bg-white/95 px-4 py-3 shadow-[0_12px_35px_rgba(0,0,0,0.12)] backdrop-blur-xl sm:bottom-12 sm:right-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-100">
                    <CheckCircle2 size={18} className="text-green-600" />
                  </div>

                  <div>
                    <p className="whitespace-nowrap text-[9px] font-bold uppercase tracking-wider text-gray-400">
                      No confusion
                    </p>

                    <p className="whitespace-nowrap text-sm font-black text-gray-950">
                      Fully transparent
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STEPS */}

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-600">
            How it works
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
            Four simple steps.
            <br />
            That&apos;s it.
          </h2>

          <p className="mt-4 text-sm leading-6 text-gray-500">
            We&apos;ve designed the process to be straightforward from the
            moment you select your phone until you receive your payment.
          </p>
        </div>

        <div className="relative mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StepCard
            number="1"
            icon={<Smartphone size={22} />}
            title="Select your phone"
            text="Choose your device and provide its basic details, including model, storage and condition."
          />

          <StepCard
            number="2"
            icon={<CreditCard size={22} />}
            title="Get your estimate"
            text="See an estimated value for your phone before deciding whether you want to sell."
          />

          <StepCard
            number="3"
            icon={<Truck size={22} />}
            title="Schedule pickup"
            text="Provide your details and choose a convenient pickup option for your device."
          />

          <StepCard
            number="4"
            icon={<PackageCheck size={22} />}
            title="Inspection & payment"
            text="Your phone is inspected, the final value is confirmed and payment is completed."
          />
        </div>
      </section>

      {/* PROCESS DETAILS */}

      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-600">
                What you can expect
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
                Clear at every
                <br />
                stage.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-6 text-gray-500">
                Our goal is to make selling your phone feel simple. You should
                always know what happens next and why.
              </p>
            </div>

            <div className="space-y-4">
              <InfoRow
                icon={<ClipboardCheck size={19} />}
                title="Clear inspection"
                text="Your device is checked before the final value is confirmed."
              />

              <InfoRow
                icon={<MapPin size={19} />}
                title="Convenient doorstep service"
                text="We keep the pickup process practical and convenient."
              />

              <InfoRow
                icon={<ShieldCheck size={19} />}
                title="Secure process"
                text="Your device and personal details are handled carefully."
              />

              <InfoRow
                icon={<CreditCard size={19} />}
                title="Transparent payment"
                text="The final price is confirmed before completing the transaction."
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}

      <section className="mx-auto max-w-4xl px-5 py-16 lg:py-20">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-600">
            Good to know
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-gray-950">
            Before you sell
          </h2>
        </div>

        <div className="mt-10 space-y-4">
          <Faq
            question="Do I need to know the exact value of my phone?"
            answer="No. Start by selecting your phone and providing its details. PhoneBhai will show you an estimated value based on the information provided."
          />

          <Faq
            question="Will the final price always be the estimated price?"
            answer="The estimate is based on the information you provide. The final value may be confirmed after the device inspection."
          />

          <Faq
            question="Where is PhoneBhai currently available?"
            answer="PhoneBhai is currently focused on mobile-phone services in Bhubaneswar."
          />

          <Faq
            question="What happens after I submit my phone details?"
            answer="You can proceed with the selling process, provide your details and arrange the next step for your device."
          />
        </div>
      </section>

      {/* CTA */}

      <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8 lg:pb-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-black px-6 py-12 text-center sm:px-10">
          <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-gray-500/20 blur-3xl" />

          <div className="relative">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-300">
              Ready to sell?
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
              Find out what your phone
              <br />
              could be worth.
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-400">
              Get started with a quick estimate and experience a simpler way to
              sell your phone.
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

/* STEP CARD */

function StepCard({
  number,
  icon,
  title,
  text,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="group relative rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-gray-400 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-gray-900 transition group-hover:bg-black group-hover:text-white">
          {icon}
        </div>
      </div>

      <h3 className="mt-6 text-base font-black text-gray-950">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-gray-500">{text}</p>
    </div>
  );
}

/* INFO ROW */

function InfoRow({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-900">
        {icon}
      </div>

      <div>
        <h3 className="text-sm font-black text-gray-950">{title}</h3>

        <p className="mt-1 text-xs leading-5 text-gray-500">{text}</p>
      </div>
    </div>
  );
}

/* FAQ */

function Faq({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <h3 className="text-sm font-black text-gray-950">{question}</h3>

      <p className="mt-2 text-sm leading-6 text-gray-500">{answer}</p>
    </div>
  );
}
