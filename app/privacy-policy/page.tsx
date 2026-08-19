import Link from "next/link";
import {
  ArrowLeft,
  LockKeyhole,
  ShieldCheck,
  Mail,
  Phone,
} from "lucide-react";

export const metadata = {
  title: "Privacy Policy | PhoneBhai",
  description:
    "Learn how PhoneBhai collects, uses, protects and retains seller information.",
};

const sections = [
  {
    title: "1. Information We May Collect",
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
    title: "2. Why We Use This Information",
    content: (
      <ul>
        <li>
          To provide a mobile-phone valuation and estimated price.
        </li>
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
    title: "3. Consent and Notices",
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
    title: "4. Lead Data Before Pickup",
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
    title: "5. Seller ID Proof",
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
    title: "6. Analytics and Cookies",
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
    title: "7. Service Providers",
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
    title: "8. Data Security",
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
    title: "9. Data Retention",
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
    title: "10. Your Privacy Requests",
    content: (
      <>
        <p>
          You may request information about your personal data, correction of
          inaccurate information, deletion where applicable, withdrawal of
          consent where processing is consent-based, or raise a grievance.
          Some information may need to be retained for completed transactions,
          legal obligations, fraud prevention or legal claims.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <a
            href="mailto:support@PhoneBhai.com"
            className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 transition hover:border-indigo-200 hover:bg-indigo-50"
          >
            <Mail size={18} className="text-indigo-600" />
            <span className="text-sm font-semibold">
              support@PhoneBhai.com
            </span>
          </a>

          <a
            href="tel:+918079979945"
            className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 transition hover:border-indigo-200 hover:bg-indigo-50"
          >
            <Phone size={18} className="text-indigo-600" />
            <span className="text-sm font-semibold">
              +91 80799 79945
            </span>
          </a>
        </div>
      </>
    ),
  },
  {
    title: "11. Children",
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
    title: "12. Changes to this Policy",
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
    <main className="min-h-screen bg-[#f7f8fa] text-gray-900">
      <div className="mx-auto max-w-5xl px-5 py-10 sm:py-14 lg:px-8">
        <header className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm sm:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <LockKeyhole size={25} />
          </div>

          <p className="mt-7 text-sm font-bold uppercase tracking-wider text-indigo-600">
            Legal
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Privacy Policy
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
            How PhoneBhai collects, uses, protects and retains seller
            information.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500">
            <ShieldCheck size={14} />
            Last Updated: 8 August 2026
          </div>
        </header>

        <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-7 shadow-sm sm:p-10">
          <div className="prose prose-gray max-w-none">
            <p className="text-sm leading-7 text-gray-600">
              PhoneBhai is operated by Sure Buy Store, a proprietorship based
              in Bhubaneswar, Odisha. This Privacy Policy explains what
              personal data we collect, why we use it, how we protect it, and
              the choices available to you.
            </p>

            <div className="mt-10 space-y-9">
              {sections.map((section) => (
                <section
                  key={section.title}
                  className="border-t border-gray-100 pt-7"
                >
                  <h2 className="text-lg font-black text-gray-950">
                    {section.title}
                  </h2>

                  <div className="mt-3 text-sm leading-7 text-gray-600 [&_li]:mb-2 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
                    {section.content}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}