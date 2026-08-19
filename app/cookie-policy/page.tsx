import Link from "next/link";
import { ArrowLeft, Cookie } from "lucide-react";

export const metadata = {
  title: "Cookie Policy | PhoneBhai",
  description:
    "Learn how PhoneBhai uses cookies and similar technologies on its website.",
};

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-[#f7f8fa] px-5 py-10 text-gray-900 sm:py-14">
      <div className="mx-auto max-w-4xl">
        <section className="mt-8 rounded-3xl border border-gray-200 bg-white p-7 shadow-sm sm:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Cookie size={25} />
          </div>

          <p className="mt-7 text-sm font-bold uppercase tracking-wider text-indigo-600">
            Legal
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight">
            Cookie Policy
          </h1>

          <p className="mt-3 text-sm leading-7 text-gray-500">
            Information about cookies and similar technologies used by
            PhoneBhai.
          </p>

          <div className="mt-10 space-y-8 text-sm leading-7 text-gray-600">
            <section>
              <h2 className="text-lg font-black text-gray-950">
                What are cookies?
              </h2>
              <p className="mt-3">
                Cookies are small files or similar technologies that may be
                stored on your device when you visit a website.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-950">
                How we may use them
              </h2>
              <p className="mt-3">
                PhoneBhai may use cookies or similar technologies to support
                essential website functionality, understand website usage,
                maintain security and improve the user experience.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-950">Analytics</h2>
              <p className="mt-3">
                Where analytics services are enabled, they may collect
                information such as page views, browser information and
                interaction events.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-black text-gray-950">
                Managing cookies
              </h2>
              <p className="mt-3">
                You can manage or disable cookies through your browser settings.
                Some website functionality may be affected when certain cookies
                are disabled.
              </p>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
