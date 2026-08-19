import Link from "next/link";
import { ArrowLeft, SearchCheck } from "lucide-react";

export const metadata = {
  title: "Inspection & Pricing Policy | PhoneBhai",
  description:
    "Understand how PhoneBhai inspects devices and determines the final buyback offer.",
};

export default function InspectionPolicyPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fa] px-5 py-10 text-gray-900 sm:py-14">
      <div className="mx-auto max-w-4xl">
        <section className="mt-8 rounded-3xl border border-gray-200 bg-white p-7 shadow-sm sm:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <SearchCheck size={25} />
          </div>

          <p className="mt-7 text-sm font-bold uppercase tracking-wider text-indigo-600">
            Policy
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight">
            Inspection & Pricing
          </h1>

          <p className="mt-3 text-sm leading-7 text-gray-500">
            How device information and physical condition may affect the final
            buyback price.
          </p>

          <div className="mt-10 space-y-8 text-sm leading-7 text-gray-600">
            <section>
              <h2 className="text-lg font-black text-gray-950">
                Online estimate
              </h2>
              <p className="mt-3">
                The price displayed online is an estimated value based on the
                information provided during the valuation process.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-950">
                Physical inspection
              </h2>
              <p className="mt-3">
                Before completing a transaction, the device may be inspected
                to verify its model, storage, condition, functionality and
                other information provided during valuation.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-950">
                Final offer
              </h2>
              <p className="mt-3">
                If the device matches the submitted information, the estimated
                offer may remain unchanged. If material differences are found,
                the final offer may be revised.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-950">
                Seller choice
              </h2>
              <p className="mt-3">
                The seller may accept or reject a revised offer before the
                transaction is completed.
              </p>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}