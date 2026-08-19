import Link from "next/link";
import { ArrowLeft, Ban } from "lucide-react";

export const metadata = {
  title: "Cancellation Policy | PhoneBhai",
  description:
    "Learn about cancellation and rescheduling of PhoneBhai mobile phone pickup requests.",
};

export default function CancellationPolicyPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fa] px-5 py-10 text-gray-900 sm:py-14">
      <div className="mx-auto max-w-4xl">
        <section className="mt-8 rounded-3xl border border-gray-200 bg-white p-7 shadow-sm sm:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Ban size={25} />
          </div>

          <p className="mt-7 text-sm font-bold uppercase tracking-wider text-indigo-600">
            Legal
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight">
            Cancellation Policy
          </h1>

          <p className="mt-3 text-sm leading-7 text-gray-500">
            Information about cancelling or rescheduling a PhoneBhai
            pickup request.
          </p>

          <div className="mt-10 space-y-8 text-sm leading-7 text-gray-600">
            <section>
              <h2 className="text-lg font-black text-gray-950">
                Pickup cancellation
              </h2>
              <p className="mt-3">
                A seller may contact PhoneBhai to cancel a pickup request
                before the transaction is completed.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-950">
                Rescheduling
              </h2>
              <p className="mt-3">
                Pickup dates and times may be rescheduled depending on
                availability and operational circumstances.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-950">
                Cancellation after inspection
              </h2>
              <p className="mt-3">
                If the final offer changes following physical inspection, the
                seller may accept or reject the revised offer before the sale
                is completed.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-950">
                Contact
              </h2>
              <p className="mt-3">
                For cancellation or rescheduling assistance, contact
                support@PhoneBhai.com or call +91 80799 79945.
              </p>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}