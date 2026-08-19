import Link from "next/link";
import { ArrowLeft, Smartphone } from "lucide-react";

export const metadata = {
  title: "Device Handover Policy | PhoneBhai",
  description:
    "Prepare your mobile phone safely before handing it over to PhoneBhai.",
};

export default function DeviceHandoverPolicyPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fa] px-5 py-10 text-gray-900 sm:py-14">
      <div className="mx-auto max-w-4xl">
        <section className="mt-8 rounded-3xl border border-gray-200 bg-white p-7 shadow-sm sm:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Smartphone size={25} />
          </div>

          <p className="mt-7 text-sm font-bold uppercase tracking-wider text-indigo-600">
            Policy
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight">
            Device Handover Policy
          </h1>

          <p className="mt-3 text-sm leading-7 text-gray-500">
            Important steps to complete before handing your mobile phone to
            PhoneBhai.
          </p>

          <div className="mt-10 space-y-8 text-sm leading-7 text-gray-600">
            <section>
              <h2 className="text-lg font-black text-gray-950">
                Back up your data
              </h2>
              <p className="mt-3">
                Back up photos, contacts, documents and any other information
                you want to keep before handing over the device.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-950">
                Sign out of accounts
              </h2>
              <p className="mt-3">
                Sign out of personal accounts and disable device locks where
                appropriate before completing the handover.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-950">
                Remove SIM and memory cards
              </h2>
              <p className="mt-3">
                Remove your SIM card and any removable memory card before
                handing over the device.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-950">
                Erase personal data
              </h2>
              <p className="mt-3">
                After backing up your information and signing out of relevant
                accounts, erase personal information from the device before
                handover.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-950">
                Check the device
              </h2>
              <p className="mt-3">
                Make sure the device is available for inspection and that any
                accessories included in your valuation are available for
                verification.
              </p>
            </section>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm font-semibold text-amber-800">
              Important: PhoneBhai recommends removing all personal data
              before device handover. Keep your passwords, authentication
              codes and personal account credentials private.
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}