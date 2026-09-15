import Link from "next/link";
import {
  ArrowLeft,
  LockKeyhole,
  ShieldCheck,
  Mail,
  Phone,
  ChevronRight,
} from "lucide-react";

export const metadata = {
  title: "Privacy Policy | PhoneBhai",
  description:
    "Learn how PhoneBhai collects, uses, protects and retains seller information.",
};

const sections = [
  {
    number: "01",
    title: "Information We May Collect",
    content: (
      <ul>
        <li>
          <strong>Contact information:</strong> name, mobile number and email
          address.
        </li>
        <li>
          <strong>Pickup information:</strong> address, PIN code, preferred
          pickup date and time.
        </li>
        <li>
          <strong>Device information:</strong> brand, series, model, storage
          variant, age, condition, issues, accessories and applicable iPhone
          battery-health range.
        </li>
        <li>
          <strong>Transaction information:</strong> estimated price, final
          purchase amount, payment method and reference number where
          applicable.
        </li>
        <li>
          <strong>Seller verification information:</strong> front and back
          images of identity proof when a deal is completed.
        </li>
        <li>
          <strong>Communications:</strong> enquiries, support notes and
          communications relating to your valuation or pickup.
        </li>
        <li>
          <strong>Technical information:</strong> browser/device information,
          IP-related security logs, website events, cookies and analytics
          information where enabled.
        </li>
      </ul>
    ),
  },
  {
    number: "02",
    title: "Why We Use This Information",
    content: (
      <ul>
        <li>To provide a mobile-phone valuation and estimated price.</li>
        <li>
          To save and manage leads, including price-unlock or abandoned leads.
        </li>
        <li>
          To arrange pickup, inspect the phone and complete a buyback.
        </li>
        <li>
          To process and document payment and send the completion email.
        </li>
        <li>
          To verify a seller, maintain records and prevent fraud or abuse.
        </li>
        <li>
          To respond to support requests, maintain security and improve the
          website.
        </li>
        <li>
          To comply with applicable legal, accounting, record-keeping or
          regulatory obligations.
        </li>
      </ul>
    ),
  },
  {
    number: "03",
    title: "Consent and Notices",
    content: (
      <p>
        Where consent is required, we aim to explain the data requested and
        its purpose clearly. Optional marketing consent, if introduced later,
        will be separate and not preselected. Contact us regarding consent or
        privacy choices using the details below.
      </p>
    ),
  },
  {
    number: "04",
    title: "Lead Data Before Pickup",
    content: (
      <p>
        When you enter your mobile number to unlock an estimated price,
        PhoneBhai saves the selected device and valuation details with your
        number even if you do not complete pickup booking. This allows us to
        manage the requested valuation and follow up about the buyback
        service.
      </p>
    ),
  },
  {
    number: "05",
    title: "Seller ID Proof",
    content: (
      <p>
        Seller identity-proof images are sensitive transaction records. They
        are stored privately with restricted administrative access and are not
        displayed publicly, included in customer emails, analytics events or
        ordinary website pages. Access is limited to authorized personnel with
        a legitimate transaction, fraud-prevention, record-keeping or legal
        need.
      </p>
    ),
  },
  {
    number: "06",
    title: "Analytics and Cookies",
    content: (
      <p>
        If Google Analytics or Google Tag Manager is enabled, the website may
        collect usage information such as page views, browser/device
        information and interaction events. PhoneBhai does not intentionally
        send names, mobile numbers, email addresses, full addresses, ID-proof
        information or other directly identifying information to analytics
        services.
      </p>
    ),
  },
  {
    number: "07",
    title: "Service Providers",
    content: (
      <p>
        We may use service providers for hosting, database infrastructure,
        email, analytics, security, communications or operations. They may
        process information only as needed to provide their services, subject
        to applicable contractual and legal requirements.
      </p>
    ),
  },
  {
    number: "08",
    title: "Data Security",
    content: (
      <p>
        We use reasonable administrative, technical and organizational
        safeguards, including access controls, secure authentication, private
        storage for seller ID images, input validation, secure communications
        and restricted administrative access. No electronic storage or
        transmission method can be guaranteed completely secure.
      </p>
    ),
  },
  {
    number: "09",
    title: "Data Retention",
    content: (
      <p>
        We retain information only as long as reasonably necessary for the
        purposes described here, including transaction records, fraud
        prevention, support, accounting, dispute resolution and legal
        obligations. Data no longer required should be securely deleted or
        anonymized where appropriate.
      </p>
    ),
  },
  {
    number: "10",
    title: "Your Privacy Requests",
    content: (
      <>
        <p>
          You may request information about your personal data, correction of
          inaccurate information, deletion where applicable, withdrawal of
          consent where processing is consent-based, or raise a grievance.
          Some information may need to be retained for completed transactions,
          legal obligations, fraud prevention or legal claims.
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
  {
    number: "11",
    title: "Children",
    content: (
      <p>
        PhoneBhai is not intended to knowingly facilitate independent
        device-sale transactions by persons who are not legally capable of
        entering into them. Lawful guardian involvement may be required where
        appropriate.
      </p>
    ),
  },
  {
    number: "12",
    title: "Changes to this Policy",
    content: (
      <p>
        We may update this Privacy Policy when services, technologies or legal
        requirements change. The current version will always show its Last
        Updated date.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f6f7fb] text-gray-900">


      <div className="relative z-10 mx-auto max-w-5xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8">

        {/* Hero */}
        <header className="relative overflow-hidden rounded-[28px] border border-gray-200/80 bg-white shadow-[0_20px_60px_-30px_rgba(15,23,42,0.25)]">
          {/* Top accent */}
          <div className="h-1.5 w-full bg-gradient-to-r from-cyan-400 via-indigo-600 to-violet-600" />

          <div className="relative p-6 sm:p-9 lg:p-10">
            {/* Decorative gradient */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-100/60 blur-3xl" />

            <div className="relative flex flex-col gap-7 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-100 text-indigo-600 shadow-sm ring-1 ring-indigo-100">
                  <LockKeyhole size={25} strokeWidth={2.2} />
                </div>

                <div className="mt-7">
                  <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-indigo-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    Legal & Privacy
                  </div>

                  <h1 className="mt-3 text-2xl font-black tracking-[-0.03em] text-gray-950 sm:text-3xl lg:text-4xl">
                    Privacy Policy
                  </h1>

                  <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-500 sm:text-[15px]">
                    How PhoneBhai collects, uses, protects and retains seller
                    information.
                  </p>
                </div>
              </div>
            </div>

            {/* Intro */}
            <div className="relative mt-8 rounded-2xl border border-indigo-100/80 bg-gradient-to-r from-indigo-50/70 via-white to-violet-50/50 p-5 sm:p-6">
              <div className="absolute left-0 top-5 h-10 w-1 rounded-r-full bg-gradient-to-b from-indigo-500 to-violet-500" />

              <p className="pl-3 text-sm leading-7 text-gray-600">
                PhoneBhai is operated by Sure Buy Store, a proprietorship
                based in Bhubaneswar, Odisha. This Privacy Policy explains what
                personal data we collect, why we use it, how we protect it, and
                the choices available to you.
              </p>
            </div>
          </div>
        </header>

        {/* Policy content */}
        <div className="mt-5 rounded-[28px] border border-gray-200/80 bg-white shadow-[0_20px_60px_-35px_rgba(15,23,42,0.25)]">
          <div className="p-5 sm:p-8 lg:p-10">
            <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-indigo-600">
                  Your data matters
                </p>
                <h2 className="mt-1 text-xl font-black tracking-tight text-gray-950">
                  Privacy & Data Protection
                </h2>
              </div>

              <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400 sm:flex">
                <LockKeyhole size={18} />
              </div>
            </div>

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
                    {/* Section number */}
                    <div className="shrink-0">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 text-[10px] font-black tracking-wider text-indigo-500 ring-1 ring-gray-100 transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:ring-indigo-600">
                        {section.number}
                      </div>
                    </div>

                    {/* Section content */}
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
                Your information deserves protection.
              </p>
              <p className="mt-0.5 text-[11px] text-gray-400">
                PhoneBhai handles your information with care.
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