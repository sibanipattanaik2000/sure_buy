import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Truck,
  Sparkles,
  PhoneCall,
  Search,
  Cpu,
  Smartphone,
  BatteryCharging,
  Wrench,
  HelpCircle,
  Check,
  Clock,
} from "lucide-react";

export const metadata = {
  title: "Phone Bhai Warranty & Guarantee | 6-Month Coverage",
  description:
    "Learn about Phone Bhai's 6-month certified refurbished warranty, 52-point quality checks, 7-day replacement guarantee, and doorstep claim process.",
};

const QUALITY_CHECKS = [
  { icon: Smartphone, label: "Screen & Touch Responsiveness" },
  { icon: BatteryCharging, label: "Battery Health & Charging Speed" },
  { icon: Cpu, label: "Processor & Memory Performance" },
  { icon: Wrench, label: "Camera, Speakers & Microphones" },
];

const FAQS = [
  {
    q: "How long is the Phone Bhai warranty period?",
    a: "All refurbished and certified old devices come with a standard 6-month warranty. New smartphones carry their respective brand manufacturer warranty.",
  },
  {
    q: "What happens if my phone cannot be repaired?",
    a: "If our technicians cannot fix your phone within 5-7 business days under warranty, we will issue a direct replacement device of equivalent condition or offer store credits.",
  },
  {
    q: "Do I need to pay for shipping during a warranty claim?",
    a: "No! Phone Bhai covers 100% of the reverse pickup and delivery shipping costs for valid warranty claims.",
  },
  {
    q: "Is accidental water or physical drop damage covered?",
    a: "No. Physical damage, screen cracks, or liquid damage caused after delivery are excluded from the standard repair warranty.",
  },
];

export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* HERO HEADER */}
        <div className="relative overflow-hidden rounded-3xl bg-gray-950 p-8 text-white shadow-2xl sm:p-12">
          {/* Vibrant Top Border Accent */}
          {/* <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-indigo-600 to-violet-600" /> */}

          {/* Ambient Lighting Gradients */}
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-indigo-600/30 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-violet-600/30 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-start gap-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3.5 py-1 text-xs font-extrabold text-indigo-300 ring-1 ring-indigo-500/30">
              <ShieldCheck className="h-4 w-4 text-indigo-400" />
              Phone Bhai Certified Protection
            </span>

            <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
              Buy With Confidence{" "}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
                Fully Covered
              </span>
            </h1>

            <p className="max-w-2xl text-sm text-gray-300 sm:text-base leading-relaxed">
              Every refurbished phone undergoes a rigorous 52-point quality inspection before leaving our facility. Backed by up to 6 months of hassle-free repair warranty and doorstep pickup.
            </p>

            <div className="mt-2 flex flex-wrap gap-3">
              <a
                href="#claim-process"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-indigo-500"
              >
                <Wrench size={15} />
                Claim Warranty Now
              </a>
              <a
                href="#check-coverage"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/20"
              >
                <Search size={15} />
                Check IMEi Coverage
              </a>
            </div>
          </div>
        </div>

        {/* TOP STATS BADGES */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs transition hover:border-indigo-200">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-950">6 Months</p>
              <p className="text-xs font-semibold text-gray-500">
                Repair Warranty
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs transition hover:border-indigo-200">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <RotateCcw size={24} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-950">7 Days</p>
              <p className="text-xs font-semibold text-gray-500">
                Replacement Guarantee
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs transition hover:border-indigo-200">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
              <Truck size={24} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-950">Free Pickup</p>
              <p className="text-xs font-semibold text-gray-500">
                Zero Cost Doorstep Claims
              </p>
            </div>
          </div>
        </div>

        {/* WARRANTY STATUS CHECKER TOOL */}
        <section
          id="check-coverage"
          className="mt-10 rounded-2xl border border-indigo-100 bg-gradient-to-b from-indigo-50/60 to-white p-6 shadow-xs sm:p-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600">
                Quick Lookup
              </span>
              <h2 className="text-xl font-bold text-gray-950">
                Check Your Phone's Warranty Status
              </h2>
              <p className="mt-1 text-xs text-gray-600">
                Enter your device IMEI number (printed on your invoice) to check remaining warranty days.
              </p>
            </div>

            <div className="flex w-full md:w-auto items-center gap-2">
              <div className="relative flex-1 md:w-64">
                <input
                  type="text"
                  placeholder="Enter 15-digit IMEI..."
                  className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-900 placeholder-gray-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                />
              </div>
              <button
                type="button"
                className="rounded-xl bg-gray-950 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-gray-800 transition"
              >
                Verify
              </button>
            </div>
          </div>
        </section>

        {/* 52-POINT QUALITY GUARANTEE */}
        <section className="mt-10 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8">
          <div className="flex items-center gap-2">
            <Sparkles className="text-indigo-600" size={20} />
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600">
              Quality Assurance
            </span>
          </div>
          <h2 className="mt-1 text-2xl font-extrabold text-gray-950">
            Tested & Verified: The 52-Point Inspection
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-gray-600 sm:text-sm">
            Before any refurbished device is listed on Phone Bhai, our certified engineers run diagnostic software and hardware stress tests to guarantee 100% functionality.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {QUALITY_CHECKS.map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-start rounded-xl border border-gray-100 bg-gray-50/70 p-4 transition hover:bg-gray-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-xs">
                  <item.icon size={20} />
                </div>
                <p className="mt-3 text-xs font-bold text-gray-900">
                  {item.label}
                </p>
                <span className="mt-1 flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                  <Check size={12} /> Verified Passed
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* COVERAGE COMPARISON TABLE */}
        <section className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* WHAT IS COVERED */}
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-xs sm:p-8">
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle2 size={22} />
              <h3 className="text-lg font-bold text-gray-950">
                What IS Covered
              </h3>
            </div>
            <ul className="mt-4 space-y-3 text-xs text-gray-600 sm:text-sm">
              <li className="flex items-start gap-2.5">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                <span>
                  <strong>Touch & Display Issues:</strong> Touch dead zones or flickering screens not caused by drops.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                <span>
                  <strong>Battery Malfunction:</strong> Excessive drain, inability to hold charge, or charging port issues.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                <span>
                  <strong>Hardware Failures:</strong> Speaker distortion, mic failure, camera sensor errors, or Bluetooth/Wi-Fi bugs.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                <span>
                  <strong>Software Glitches:</strong> Operating system crashes or bootloop faults.
                </span>
              </li>
            </ul>
          </div>

          {/* WHAT IS NOT COVERED */}
          <div className="rounded-2xl border border-rose-100 bg-white p-6 shadow-xs sm:p-8">
            <div className="flex items-center gap-2 text-rose-500">
              <XCircle size={22} />
              <h3 className="text-lg font-bold text-gray-950">
                What IS NOT Covered
              </h3>
            </div>
            <ul className="mt-4 space-y-3 text-xs text-gray-600 sm:text-sm">
              <li className="flex items-start gap-2.5">
                <span className="mt-1 h-2 w-2 rounded-full bg-rose-400 shrink-0" />
                <span>
                  <strong>Accidental Physical Drops:</strong> Cracked screens, broken back glass, or bent frames after delivery.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1 h-2 w-2 rounded-full bg-rose-400 shrink-0" />
                <span>
                  <strong>Liquid & Moisture Damage:</strong> Water immersion or corrosion inside the chassis.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1 h-2 w-2 rounded-full bg-rose-400 shrink-0" />
                <span>
                  <strong>Unauthorized Repairs:</strong> Opening the phone at third-party local repair centers.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-1 h-2 w-2 rounded-full bg-rose-400 shrink-0" />
                <span>
                  <strong>Normal Wear:</strong> Minor cosmetic scuffs accumulated over daily usage.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* 3-STEP CLAIM PROCESS */}
        <section
          id="claim-process"
          className="mt-10 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8"
        >
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600">
              Simple & Fast
            </span>
            <h2 className="text-2xl font-extrabold text-gray-950">
              How to Claim Your Warranty
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Get your device fixed or replaced in 3 effortless steps.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="relative rounded-2xl bg-gray-50 p-5 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-xs font-black text-white">
                1
              </div>
              <p className="mt-3 font-bold text-gray-950 text-sm">
                Submit Request
              </p>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                Go to <strong>My Account &gt; Orders</strong>, select your device and click "Claim Warranty".
              </p>
            </div>

            <div className="relative rounded-2xl bg-gray-50 p-5 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-xs font-black text-white">
                2
              </div>
              <p className="mt-3 font-bold text-gray-950 text-sm">
                Doorstep Pickup
              </p>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                Our logistics executive arrives at your location to collect the packaged device for free.
              </p>
            </div>

            <div className="relative rounded-2xl bg-gray-50 p-5 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-xs font-black text-white">
                3
              </div>
              <p className="mt-3 font-bold text-gray-950 text-sm">
                Repair & Delivery
              </p>
              <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                Our certified team fixes the phone with genuine parts and delivers it back to you within 48–72 hours.
              </p>
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS */}
        <section className="mt-10 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8">
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-950">
            <HelpCircle className="text-indigo-600" size={22} />
            Warranty FAQs
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="rounded-xl bg-gray-50/80 p-4">
                <p className="font-bold text-xs text-gray-900">{faq.q}</p>
                <p className="mt-2 text-xs leading-relaxed text-gray-600">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* SUPPORT FOOTER CTA */}
        <div className="mt-10 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-white p-8 text-center sm:p-10">
          {/* <Clock className="mx-auto h-8 w-8 text-indigo-600" /> */}
          <h3 className="mt-3 text-xl font-extrabold text-gray-950">
            Have Questions About a Repair or Claim?
          </h3>
          <p className="mt-1 text-xs text-gray-600 sm:text-sm">
            Our technical support team is standing by to help you resolve hardware issues.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/account"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition"
            >
              Go to Account Orders
            </Link>
            <a
              href="tel:+918079979945"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-xs font-bold text-gray-800 hover:bg-gray-50 transition"
            >
              <PhoneCall size={14} />
              Contact Support Team
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}