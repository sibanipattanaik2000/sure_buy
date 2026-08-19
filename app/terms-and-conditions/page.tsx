import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  ShieldCheck,
  Phone,
  Mail,
} from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | PhoneBhai",
  description:
    "Read the Terms & Conditions governing PhoneBhai's mobile phone valuation, pickup and buyback services.",
};

const sections = [
  {
    title: "1. Eligibility",
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
    title: "2. Service Area and Devices",
    content: (
      <p>
        Phase 1 services are available for supported mobile phones within
        Bhubaneswar, Odisha. Device models, variants, pickup coverage and
        supported PIN codes may change from time to time.
      </p>
    ),
  },
  {
    title: "3. Online Estimated Price",
    content: (
      <>
        <p>
          The price shown on the website is an estimated buyback price
          generated from the device model, storage variant and the condition
          information provided by you. It is not a guaranteed final purchase
          price.
        </p>

        <ul>
          <li>The estimate is based on the information selected by you.</li>
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
    title: "4. Physical Inspection and Final Offer",
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
    title: "5. Device Condition and Accessories",
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
    title: "6. Ownership and Lawful Sale",
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
    title: "7. Personal Data and Device Data",
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
    title: "8. Pickup",
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
    title: "9. Payment",
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
    title: "10. Seller ID Proof",
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
    title: "11. Right to Refuse or Cancel",
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
    title: "12. Website Availability",
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
    title: "13. Intellectual Property",
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
    title: "14. Limitation of Liability",
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
    title: "15. Changes to Terms",
    content: (
      <p>
        We may update these Terms to reflect changes in services, technology,
        operations or legal requirements. The updated version will show a
        revised Last Updated date.
      </p>
    ),
  },
  {
    title: "16. Governing Law and Contact",
    content: (
      <>
        <p>
          These Terms are governed by applicable laws of India. Subject to
          applicable consumer and statutory rights, disputes will be subject
          to competent courts having jurisdiction in Bhubaneswar, Odisha.
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
];

export default function TermsAndConditionsPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fa] text-gray-900">
      <div className="mx-auto max-w-5xl px-5 py-10 sm:py-14 lg:px-8">
        <header className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm sm:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <FileText size={25} />
          </div>

          <p className="mt-7 text-sm font-bold uppercase tracking-wider text-indigo-600">
            Legal
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Terms & Conditions
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
            Terms for using PhoneBhai&apos;s valuation, pickup and
            mobile-phone buyback service.
          </p>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500">
            <ShieldCheck size={14} />
            Last Updated: 8 August 2026
          </div>
        </header>

        <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-7 shadow-sm sm:p-10">
          <div className="prose prose-gray max-w-none">
            <p className="text-sm leading-7 text-gray-600">
              Welcome to PhoneBhai. These Terms & Conditions govern your
              access to and use of PhoneBhai.com, PhoneBhai.in (where
              redirected to the primary website), and the mobile phone
              valuation, pickup and buyback services offered under the
              PhoneBhai brand by Sure Buy Store, a proprietorship operating
              from Bhubaneswar, Odisha.
            </p>

            <p className="mt-5 text-sm leading-7 text-gray-600">
              By using the website, requesting an estimated price, scheduling
              a pickup, or selling a device to PhoneBhai, you agree to these
              Terms & Conditions. If you do not agree, please do not use the
              service.
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