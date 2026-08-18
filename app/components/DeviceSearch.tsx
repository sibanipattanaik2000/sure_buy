"use client";

import { useState } from "react";
import { Search, Smartphone, X } from "lucide-react";
import { useRouter } from "next/navigation";

const devices = [
  "iPhone 15",
  "iPhone 15 Pro",
  "iPhone 15 Pro Max",
  "iPhone 14",
  "iPhone 14 Pro",
  "iPhone 14 Pro Max",
  "iPhone 13",
  "Samsung Galaxy S24",
  "Samsung Galaxy S24 Ultra",
  "Samsung Galaxy S23",
  "OnePlus 12",
  "OnePlus 11",
  "Google Pixel 8",
  "Google Pixel 8 Pro",
  "Xiaomi 14",
];

export default function DeviceSearch() {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const filteredDevices =
    search.trim().length > 0
      ? devices.filter((device) =>
          device.toLowerCase().includes(search.toLowerCase()),
        )
      : [];

  const handleDeviceSelect = (device: string) => {
    const slug = device
      .toLowerCase()
      .replace(/\s+/g, "-");

    router.push(`/sell?device=${encodeURIComponent(slug)}`);
  };

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <div className="relative mt-8 max-w-xl">
      {/* SEARCH BOX */}

      <div
        className={`flex items-center rounded-2xl border bg-white p-2 transition-all duration-200 ${
          isFocused
            ? "border-indigo-400 shadow-[0_12px_40px_rgba(79,70,229,0.15)]"
            : "border-gray-200 shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
        }`}
      >
        <Search
          className="ml-3 shrink-0 text-gray-400"
          size={21}
        />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder="Search phones, laptops, tablets..."
          className="h-12 flex-1 bg-transparent px-4 text-sm outline-none"
          aria-label="Search device"
          autoComplete="off"
        />

        {search && (
          <button
            type="button"
            onClick={clearSearch}
            className="mr-2 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="Clear search"
          >
            <X size={17} />
          </button>
        )}
      </div>

      {/* SEARCH RESULTS */}

{isFocused && search.trim() && (
<div className="relative z-[99999] mt-2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
    <div className="max-h-[380px] overflow-y-auto overscroll-contain">    {filteredDevices.length > 0 ? (
      <div className="max-h-[360px] overflow-y-auto p-2">

        <p className="sticky top-0  bg-white px-3 pb-2 pt-2 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
          Select your device
        </p>

        {filteredDevices.map((device) => (
          <button
            key={device}
            type="button"
            onClick={() => handleDeviceSelect(device)}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-indigo-50"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition group-hover:bg-white group-hover:text-indigo-600">
              <Smartphone size={18} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-800 group-hover:text-indigo-700">
                {device}
              </p>

              <p className="mt-0.5 text-[11px] text-gray-400">
                Select this device to sell
              </p>
            </div>

            {/* <span className="text-xs font-medium text-gray-300 transition group-hover:text-indigo-500">
              →
            </span> */}
          </button>
        ))}
      </div>
    ) : (
      <div className="px-5 py-8 text-center">
        <Search
          size={24}
          className="mx-auto text-gray-300"
        />

        <p className="mt-3 text-sm font-semibold text-gray-700">
          Device not found
        </p>

        <p className="mt-1 text-xs text-gray-400">
          Try another phone or device name.
        </p>
      </div>
    )}
  </div>
  </div>
)}
    </div>
  );
}