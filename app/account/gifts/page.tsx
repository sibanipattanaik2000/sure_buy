"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/app/lib/api";
import { Gift, Copy, CheckCircle2 } from "lucide-react";

type GiftCard = {
  id: string;
  code: string;
  giftName: string | null;
  status: string;
  claimedAt: string | null;
  fulfilledAt: string | null;
  createdAt: string;
};

export default function MyGiftsPage() {
  const [cards, setCards] = useState<GiftCard[]>([]);
  const [giftName, setGiftName] = useState("Smartwatch");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const response = await apiRequest<GiftCard[]>("/gifts/cards");
      setCards(response.data || []);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to load gifts",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const claim = async (code: string) => {
    setMessage("");

    try {
      await apiRequest("/gifts/cards/claim", {
        method: "POST",
        body: JSON.stringify({ code, giftName }),
      });

      setMessage(
        "Gift selection saved. PhoneBhai will verify and process dispatch.",
      );

      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Gift claim failed");
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-10 text-gray-900">
      <div className="mb-8 flex items-center gap-3">
        <Gift className="text-amber-600" size={30} />
        <div>
          <h1 className="text-2xl font-black">My Gift Cards</h1>
          <p className="text-sm text-gray-500">
            Claim one physical gift using your unique code.
          </p>
        </div>
      </div>

      {message && (
        <p className="mb-4 rounded-xl bg-gray-100 p-3 text-sm">{message}</p>
      )}

      {loading ? (
        <p>Loading your gifts…</p>
      ) : cards.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-8 text-center text-gray-500">
          No gift codes yet. A code appears here after your eligible order
          payment is verified.
        </div>
      ) : (
        <div className="space-y-4">
          {cards.map((card) => (
            <section key={card.id} className="rounded-2xl border p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase text-gray-500">
                    Your gift code
                  </p>
                  <p className="font-mono text-xl font-black tracking-wider">
                    {card.code}
                  </p>
                </div>

                <button
                  onClick={() => navigator.clipboard.writeText(card.code)}
                  className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
                >
                  <Copy size={15} />
                  Copy
                </button>
              </div>

              <p className="mt-3 text-sm text-gray-600">
                Status: <b>{card.status}</b>
                {card.giftName ? ` · ${card.giftName}` : ""}
              </p>

              {card.status === "AVAILABLE" && (
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <select
                    value={giftName}
                    onChange={(event) => setGiftName(event.target.value)}
                    className="rounded-lg border px-3 py-2"
                  >
                    <option>Smartwatch</option>
                    <option>Wireless Earbuds</option>
                    <option>Neckband</option>
                  </select>

                  <button
                    onClick={() => void claim(card.code)}
                    className="rounded-lg bg-black px-5 py-2 font-bold text-white"
                  >
                    Claim physical gift
                  </button>
                </div>
              )}

              {card.status === "FULFILLED" && (
                <p className="mt-3 flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle2 size={16} />
                  Gift fulfilled
                </p>
              )}
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
