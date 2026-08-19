"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Battery,
  Check,
  ChevronRight,
  CircleHelp,
  Cpu,
  Link,
  MapPin,
  ShieldCheck,
  Smartphone,
  Truck,
  Upload,
  X,
  Zap,
} from "lucide-react";

type DeviceCategory = {
  name: string;
  icon: string;
};

const categories: DeviceCategory[] = [
  { name: "Smartphones", icon: "📱" },
  { name: "Laptops", icon: "💻" },
  { name: "Tablets", icon: "📱" },
  { name: "Smartwatches", icon: "⌚" },
];

const brands = [
  "Apple",
  "Samsung",
  "OnePlus",
  "Google",
  "Xiaomi",
  "Vivo",
  "Oppo",
  "Other",
];

const models = [
  "iPhone 15",
  "iPhone 15 Pro",
  "iPhone 14",
  "iPhone 14 Pro",
  "iPhone 13",
  "Other Model",
];

export default function SellPage() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [condition, setCondition] = useState("");
  const [working, setWorking] = useState("");
  const [screen, setScreen] = useState("");
  const [battery, setBattery] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);

  const totalSteps = 4;

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const previousStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePhotos = (files: FileList | null) => {
    if (!files) return;

    const selectedFiles = Array.from(files).slice(0, 5);
    setPhotos(selectedFiles);
  };

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-[#111827]">
      {/* HEADER */}

      {/* PAGE HEADER */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-5xl px-5 py-10 lg:px-8">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-black"
          >
            <ArrowLeft size={16} />
            Back to PhoneBhai
          </Link>

          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700">
              <BadgeCheck size={15} />
              Trusted device selling
            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
              Sell your device.
              <br />
              <span className="text-indigo-600">Get the value you deserve.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-500">
              Tell us about your device, get an estimated value and schedule a
              convenient doorstep pickup.
            </p>
          </div>
        </div>
      </section>

      {/* PROGRESS */}
      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-5xl px-5 pb-8 lg:px-8">
          <div className="flex items-center justify-between">
            {[
              ["01", "Device"],
              ["02", "Condition"],
              ["03", "Photos"],
              ["04", "Pickup"],
            ].map(([number, label], index) => {
              const current = index + 1;
              const active = current === step;
              const completed = current < step;

              return (
                <div key={number} className="flex flex-1 items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition ${
                        completed
                          ? "bg-green-500 text-white"
                          : active
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {completed ? <Check size={15} /> : number}
                    </div>

                    <span
                      className={`hidden text-xs font-bold sm:block ${
                        active ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {label}
                    </span>
                  </div>

                  {index < 3 && (
                    <div
                      className={`mx-3 h-px flex-1 ${
                        current < step ? "bg-green-400" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-5xl px-5 py-10 lg:px-8">
        {/* STEP 1 */}
        {step === 1 && (
          <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
            <div>
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                    Step 1 of 4
                  </p>

                  <h2 className="mt-2 text-2xl font-black">
                    What are you selling?
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    Choose the device category to get started.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {categories.map((item) => {
                    const selected = category === item.name;

                    return (
                      <button
                        key={item.name}
                        onClick={() => setCategory(item.name)}
                        className={`relative rounded-2xl border p-5 text-left transition ${
                          selected
                            ? "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-100"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {selected && (
                          <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
                            <Check size={12} />
                          </div>
                        )}

                        <div className="text-3xl">{item.icon}</div>

                        <p className="mt-4 text-sm font-bold">{item.name}</p>
                      </button>
                    );
                  })}
                </div>

                {category === "Smartphones" && (
                  <div className="mt-10 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-bold">Brand</label>

                      <select
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                      >
                        <option value="">Select brand</option>

                        {brands.map((item) => (
                          <option key={item}>{item}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-bold">Model</label>

                      <select
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                      >
                        <option value="">Select model</option>

                        {models.map((item) => (
                          <option key={item}>{item}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                <button
                  onClick={nextStep}
                  disabled={!category}
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3.5 text-sm font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>

            <SideInfo />
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                Step 2 of 4
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Tell us about the condition
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Accurate answers help us provide a better estimate.
              </p>

              <div className="mt-8 space-y-8">
                <Question
                  title="Is the device fully functional?"
                  icon={<Cpu size={18} />}
                  value={working}
                  onChange={setWorking}
                  options={["Yes, everything works", "Some features don't work"]}
                />

                <Question
                  title="What is the screen condition?"
                  icon={<Smartphone size={18} />}
                  value={screen}
                  onChange={setScreen}
                  options={[
                    "Perfect / no scratches",
                    "Minor scratches",
                    "Cracked / damaged",
                  ]}
                />

                <Question
                  title="How would you describe the overall condition?"
                  icon={<BadgeCheck size={18} />}
                  value={condition}
                  onChange={setCondition}
                  options={["Like New", "Good", "Fair", "Poor"]}
                />

                <Question
                  title="What is the battery condition?"
                  icon={<Battery size={18} />}
                  value={battery}
                  onChange={setBattery}
                  options={["Excellent", "Good", "Needs replacement"]}
                />
              </div>

              <div className="mt-10 flex gap-3">
                <button
                  onClick={previousStep}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3.5 text-sm font-bold transition hover:bg-gray-50"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>

                <button
                  onClick={nextStep}
                  disabled={!working || !screen || !condition || !battery}
                  className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-black px-5 py-3.5 text-sm font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continue
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>

            <SideInfo />
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                Step 3 of 4
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Add photos of your device
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Clear photos can help with a more accurate evaluation.
              </p>

              <label className="mt-8 flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 text-center transition hover:border-indigo-400 hover:bg-indigo-50/40">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <Upload className="text-indigo-600" />
                </div>

                <h3 className="mt-5 font-bold">Upload device photos</h3>

                <p className="mt-2 max-w-sm text-sm text-gray-500">
                  Upload up to 5 clear photos showing the front, back and sides
                  of your device.
                </p>

                <span className="mt-5 rounded-full bg-black px-5 py-2.5 text-xs font-bold text-white">
                  Choose Photos
                </span>

                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handlePhotos(e.target.files)}
                />
              </label>

              {photos.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {photos.map((photo, index) => (
                    <div
                      key={`${photo.name}-${index}`}
                      className="relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100 p-2"
                    >
                      <div className="flex h-24 items-center justify-center text-xs text-gray-500">
                        {photo.name}
                      </div>

                      <button
                        onClick={() =>
                          setPhotos((current) =>
                            current.filter((_, i) => i !== index),
                          )
                        }
                        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black text-white"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-8 rounded-2xl bg-indigo-50 p-5">
                <div className="flex gap-3">
                  <CircleHelp
                    size={19}
                    className="mt-0.5 shrink-0 text-indigo-600"
                  />

                  <div>
                    <p className="text-sm font-bold text-indigo-900">
                      Photo tips
                    </p>

                    <p className="mt-1 text-xs leading-5 text-indigo-700">
                      Use good lighting and make sure the device is clearly
                      visible. Avoid blurry or heavily filtered photos.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={previousStep}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3.5 text-sm font-bold transition hover:bg-gray-50"
                >
                  <ArrowLeft size={16} />
                  Back
                </button>

                <button
                  onClick={nextStep}
                  className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-black px-5 py-3.5 text-sm font-bold text-white transition hover:bg-gray-800"
                >
                  Continue
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>

            <SideInfo />
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="mx-auto max-w-3xl">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                Step 4 of 4
              </p>

              <h2 className="mt-2 text-2xl font-black">
                Schedule your doorstep pickup
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Choose where and when our pickup executive should collect your
                device.
              </p>

              {/* ESTIMATE */}
              <div className="mt-8 rounded-3xl bg-[#111827] p-6 text-white">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Estimated value
                </p>

                <div className="mt-2 text-4xl font-black">₹35,000</div>

                <p className="mt-2 text-xs text-gray-400">
                  Final value will be confirmed after physical inspection.
                </p>
              </div>

              {/* ADDRESS */}
              <div className="mt-8">
                <label className="text-sm font-bold">Pickup address</label>

                <div className="mt-2 flex items-start gap-3 rounded-xl border border-gray-200 p-4">
                  <MapPin className="mt-0.5 text-indigo-600" size={19} />

                  <textarea
                    placeholder="Enter your complete pickup address..."
                    className="min-h-24 flex-1 resize-none text-sm outline-none"
                  />
                </div>
              </div>

              {/* DATE */}
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-bold">Pickup date</label>

                  <input
                    type="date"
                    className="mt-2 h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-bold">Pickup slot</label>

                  <select className="mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none focus:border-indigo-500">
                    <option>Select a time slot</option>
                    <option>9:00 AM – 12:00 PM</option>
                    <option>12:00 PM – 3:00 PM</option>
                    <option>3:00 PM – 6:00 PM</option>
                    <option>6:00 PM – 8:00 PM</option>
                  </select>
                </div>
              </div>

              {/* BOOKING FEE */}
              <div className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="font-bold text-indigo-950">
                      Pickup booking fee
                    </p>

                    <p className="mt-1 text-xs leading-5 text-indigo-700">
                      A ₹500 booking payment will be required to confirm your
                      pickup. This will be connected to the payment gateway in
                      the next stage.
                    </p>
                  </div>

                  <span className="text-xl font-black text-indigo-950">
                    ₹500
                  </span>
                </div>
              </div>

              <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-4 text-sm font-bold text-white transition hover:bg-indigo-700">
                Continue to Secure Payment
                <ArrowRight size={17} />
              </button>

              <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck size={15} />
                Secure payment • Your information is protected
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

/* SIDE INFORMATION */

function SideInfo() {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-28 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-bold">Why sell with PhoneBhai?</p>

        <div className="mt-6 space-y-5">
          <InfoItem
            icon={<Truck size={18} />}
            title="Doorstep pickup"
            text="Choose a convenient pickup slot."
          />

          <InfoItem
            icon={<ShieldCheck size={18} />}
            title="Secure process"
            text="Your information stays protected."
          />

          <InfoItem
            icon={<BadgeCheck size={18} />}
            title="Fair evaluation"
            text="Transparent device inspection."
          />
        </div>

        <div className="mt-7 border-t border-gray-100 pt-5">
          <p className="text-xs leading-5 text-gray-400">
            Final pricing is determined after physical inspection and may
            differ from the initial estimate.
          </p>
        </div>
      </div>
    </aside>
  );
}

function InfoItem({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
        {icon}
      </div>

      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="mt-1 text-xs leading-5 text-gray-500">{text}</p>
      </div>
    </div>
  );
}

function Question({
  title,
  icon,
  value,
  onChange,
  options,
}: {
  title: string;
  icon: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
          {icon}
        </div>

        <h3 className="text-sm font-bold">{title}</h3>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const selected = value === option;

          return (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`flex items-center justify-between rounded-xl border p-4 text-left text-sm transition ${
                selected
                  ? "border-indigo-600 bg-indigo-50 text-indigo-900"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <span>{option}</span>

              {selected && (
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
                  <Check size={12} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}