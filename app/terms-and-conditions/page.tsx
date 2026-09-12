import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  ShieldCheck,
  Phone,
  Mail,
  ChevronRight,
} from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | PhoneBhai",
  description:
    "Read the Terms & Conditions governing PhoneBhai's mobile phone valuation, pickup and buyback services.",
};

const sections = [
  {
    number: "01",
    title: "Eligibility",
    content: (
      <ul>
        <li>
          You must be legally capable of entering into a transaction under
          applicable law.
        </li>
        <li>
          You must be the lawful owner of the device or have lawful authority
          from the owner to sell it.
        </li>
        <li>
          You must provide accurate information about the device and your
          contact and pickup details.
        </li>
        <li>
          PhoneBhai may request reasonable proof of identity or ownership
          before completing a purchase.
        </li>
      </ul>
    ),
  },
  {
    number: "02",
    title: "Service Area and Devices",
    content: (
      <p>
        Phase 1 services are available for supported mobile phones within
        Bhubaneswar, Odisha. Device models, variants, pickup coverage and
        supported PIN codes may change from time to time.
      </p>
    ),
  },
  {
    number: "03",
    title: "Online Estimated Price",
    content: (
      <>
        <p>
          The price shown on the website is an estimated buyback price
          generated from the device model, storage variant and the condition
          information provided by you. It is not a guaranteed final purchase
          price.
        </p>

        <ul>
          <li>
            The estimate is based on the information selected by you.
          </li>
          <li>
            Incorrect, incomplete or inconsistent answers may change the final
            offer.
          </li>
          <li>
            The estimated price is normally valid for the period shown on the
            website, with a default validity of 3 days unless otherwise
            stated.
          </li>
          <li>
            Market values may change after the validity period expires.
          </li>
          <li>
            If calculated deductions reach the platform&apos;s manual-review
            threshold, an automatic price may not be shown and our team may
            contact you for review.
          </li>
        </ul>
      </>
    ),
  },
  {
    number: "04",
    title: "Physical Inspection and Final Offer",
    content: (
      <>
        <p>
          At pickup or before completion, PhoneBhai may inspect the device to
          verify its identity, model, storage, condition, functionality and
          the submitted information.
        </p>

        <ul>
          <li>
            If the device matches the submitted information, the final offer
            may remain the same.
          </li>
          <li>
            If the actual condition differs, PhoneBhai may revise the offer.
          </li>
          <li>
            You are free to accept or reject a revised offer before
            completion.
          </li>
          <li>
            If you reject it, the device will not be purchased and no sale
            will be completed.
          </li>
        </ul>
      </>
    ),
  },
  {
    number: "05",
    title: "Device Condition and Accessories",
    content: (
      <p>
        Valuation may consider device age, screen and body condition,
        functional issues, iPhone battery health where applicable, and
        availability of the original box, invoice, charger and data cable.
        The impact of each factor may vary by model and may be updated.
      </p>
    ),
  },
  {
    number: "06",
    title: "Ownership and Lawful Sale",
    content: (
      <p>
        You represent that the device is lawfully owned by you or that you
        are lawfully authorized to sell it. PhoneBhai may refuse or cancel a
        transaction where ownership is doubtful, information is inconsistent,
        the device appears unlawfully obtained, or completion would violate
        applicable law.
      </p>
    ),
  },
  {
    number: "07",
    title: "Personal Data and Device Data",
    content: (
      <p>
        Before handover, back up data you wish to keep, sign out of personal
        accounts, remove SIM and memory cards, disable device locks where
        appropriate, and erase personal data. Please review the Data & Device
        Handover Policy and Privacy Policy.
      </p>
    ),
  },
  {
    number: "08",
    title: "Pickup",
    content: (
      <ul>
        <li>
          Pickup date and time are preferences and may need to be rescheduled
          due to operational circumstances.
        </li>
        <li>
          You must provide an accurate and accessible pickup address.
        </li>
        <li>
          PhoneBhai may contact you by phone, WhatsApp or email about the
          pickup.
        </li>
        <li>
          Repeated failed attempts or inability to contact you may result in
          cancellation.
        </li>
      </ul>
    ),
  },
  {
    number: "09",
    title: "Payment",
    content: (
      <p>
        Payment may be completed by Cash, UPI or Bank Transfer as agreed at
        completion. Where applicable, a transaction/reference number may be
        recorded. A responsive completion email will be sent to the
        seller&apos;s provided email address after the deal is marked
        Completed.
      </p>
    ),
  },
  {
    number: "10",
    title: "Seller ID Proof",
    content: (
      <p>
        PhoneBhai may securely capture front and back images of the
        seller&apos;s identity proof for transaction verification,
        record-keeping, fraud prevention and lawful business purposes,
        handled according to the Privacy Policy.
      </p>
    ),
  },
  {
    number: "11",
    title: "Right to Refuse or Cancel",
    content: (
      <p>
        PhoneBhai may refuse, pause or cancel a transaction where the device
        is unsupported, its condition materially differs, ownership cannot
        reasonably be established, verification is incomplete, pickup is
        outside the supported area, suspicious activity is detected, or the
        transaction cannot lawfully or safely be completed.
      </p>
    ),
  },
  {
    number: "12",
    title: "Website Availability",
    content: (
      <p>
        We aim to keep the website available and accurate, but do not
        guarantee uninterrupted or error-free access. Maintenance, network
        issues, third-party failures or technical problems may temporarily
        affect the service.
      </p>
    ),
  },
  {
    number: "13",
    title: "Intellectual Property",
    content: (
      <p>
        The PhoneBhai name, logo, website design, original content and
        related brand assets are owned by or licensed to Sure Buy Store. You
        may not copy, reproduce, impersonate or commercially exploit them
        without permission.
      </p>
    ),
  },
  {
    number: "14",
    title: "Limitation of Liability",
    content: (
      <p>
        To the extent permitted by applicable law, PhoneBhai will not be
        responsible for indirect or consequential loss arising solely from
        website unavailability, expired estimates, third-party network
        failures or data left on a device contrary to handover instructions.
        Nothing excludes rights or remedies that cannot lawfully be excluded.
      </p>
    ),
  },
  {
    number: "15",
    title: "Changes to Terms",
    content: (
      <p>
        We may update these Terms to reflect changes in services, technology,
        operations or legal requirements. The updated version will show a
        revised Last Updated date.
      </p>
    ),
  },
  {
    number: "16",
    title: "Governing Law and Contact",
    content: (
      <>
        <p>
          These Terms are governed by applicable laws of India. Subject to
          applicable consumer and statutory rights, disputes will be subject
          to competent courts having jurisdiction in Bhubaneswar, Odisha.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <a
            href="mailto:support@PhoneBhai.com"
            className="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50/70 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50/70 hover:shadow-sm"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm ring-1 ring-gray-100 transition group-hover:bg-indigo-600 group-hover:text-white">
              <Mail size={18} />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Email
              </p>
              <p className="truncate text-sm font-bold text-gray-800">
                support@PhoneBhai.com
              </p>
            </div>

            <ChevronRight
              size={16}
              className="ml-auto text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500"
            />
          </a>

          <a
            href="tel:+918079979945"
            className="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50/70 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-indigo-50/70 hover:shadow-sm"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm ring-1 ring-gray-100 transition group-hover:bg-indigo-600 group-hover:text-white">
              <Phone size={18} />
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Phone
              </p>
              <p className="text-sm font-bold text-gray-800">
                +91 80799 79945
              </p>
            </div>

            <ChevronRight
              size={16}
              className="ml-auto text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500"
            />
          </a>
        </div>
      </>
    ),
  },
];

export default function TermsAndConditionsPage() {
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
          {/* Top gradient */}
          <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-indigo-600 to-violet-600" />

          <div className="relative p-6 sm:p-9 lg:p-10">
            {/* Decorative glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-100/60 blur-3xl" />

            <div className="relative flex flex-col gap-7 sm:flex-row sm:items-start sm:justify-between">
              <div>
                {/* Icon */}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-100 text-indigo-600 shadow-sm ring-1 ring-indigo-100">
                  <FileText size={25} strokeWidth={2.2} />
                </div>

                <div className="mt-7">
                  <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-indigo-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    Legal & Agreement
                  </div>

                  <h1 className="mt-3 text-2xl font-black tracking-[-0.03em] text-gray-950 sm:text-3xl lg:text-4xl">
                    Terms & Conditions
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-500 sm:text-[15px]">
                    Terms for using PhoneBhai&apos;s valuation, pickup and
                    mobile-phone buyback service.
                  </p>
                </div>
              </div>
            </div>

            {/* Agreement introduction */}
            <div className="relative mt-8 space-y-3">
              <div className="rounded-2xl border border-indigo-100/80 bg-gradient-to-r from-indigo-50/70 via-white to-violet-50/50 p-5 sm:p-6">
                <div className="absolute left-0 mt-0 h-10 w-1 rounded-r-full bg-gradient-to-b from-indigo-500 to-violet-500" />

                <p className="pl-3 text-sm leading-7 text-gray-600">
                  Welcome to PhoneBhai. These Terms & Conditions govern your
                  access to and use of PhoneBhai.com, PhoneBhai.in (where
                  redirected to the primary website), and the mobile phone
                  valuation, pickup and buyback services offered under the
                  PhoneBhai brand by Sure Buy Store, a proprietorship operating
                  from Bhubaneswar, Odisha.
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-5 sm:p-6">
                <p className="text-sm leading-7 text-gray-600">
                  By using the website, requesting an estimated price,
                  scheduling a pickup, or selling a device to PhoneBhai, you
                  agree to these Terms & Conditions. If you do not agree,
                  please do not use the service.
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Terms content */}
        <div className="mt-5 rounded-[28px] border border-gray-200/80 bg-white shadow-[0_20px_60px_-35px_rgba(15,23,42,0.25)]">
          <div className="p-5 sm:p-8 lg:p-10">
            {/* Content heading */}
            <div className="mb-2 flex items-center justify-between border-b border-gray-100 pb-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-600">
                  Please read carefully
                </p>

                <h2 className="mt-1 text-xl font-black tracking-tight text-gray-950">
                  Terms of Service
                </h2>
              </div>

              <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400 sm:flex">
                <FileText size={18} />
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

                      <div className="mt-3 text-sm leading-7 text-gray-600 sm:text-[14px] [&_li]:relative [&_li]:mb-2.5 [&_li]:pl-1 [&_strong]:font-bold [&_strong]:text-gray-800 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
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
                Clear terms. Safer transactions.
              </p>

              <p className="mt-0.5 text-[11px] text-gray-400">
                Please review these terms before using PhoneBhai.
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