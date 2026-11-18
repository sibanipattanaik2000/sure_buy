"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/app/lib/api";

type GiftCard = {
  id: string;
  code: string;
  userId: string;
  orderId: string;
  giftName: string | null;
  status: string;
  adminNote: string | null;
  createdAt: string;
};

export default function AdminGiftsPage() {
  const [cards, setCards] = useState<GiftCard[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    try {
      const response = await apiRequest<GiftCard[]>("/admin/gifts");
      setCards(response.data || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to load gift cards");
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const update = async (card: GiftCard, status: string) => {
    setBusy(card.id);
    setError("");

    try {
      await apiRequest(`/admin/gifts/${card.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status,
          adminNote: card.adminNote || "",
        }),
      });

      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gift update failed");
    } finally {
      setBusy(null);
    }
  };

  return (
    <main className="p-4 sm:p-8">
      <h1 className="text-2xl font-black">Gift card management</h1>

      <p className="mt-1 text-sm text-gray-500">
        Review claims, approve gifts, dispatch and mark fulfilled.
      </p>

      {error && (
        <p className="my-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl border">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Code", "Gift", "Customer", "Order", "Status", "Action"].map(
                (heading) => (
                  <th key={heading} className="p-3">
                    {heading}
                  </th>
                ),
              )}
            </tr>
          </thead>

          <tbody>
            {cards.map((card) => (
              <tr key={card.id} className="border-t">
                <td className="p-3 font-mono font-bold">{card.code}</td>
                <td className="p-3">{card.giftName || "Not selected"}</td>
                <td className="p-3">{card.userId}</td>
                <td className="p-3">{card.orderId}</td>
                <td className="p-3">{card.status}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    {["CLAIMED", "AVAILABLE"].includes(card.status) && (
                      <button
                        disabled={busy === card.id}
                        onClick={() => void update(card, "APPROVED")}
                        className="rounded bg-black px-3 py-2 text-white"
                      >
                        Approve
                      </button>
                    )}

                    {card.status === "APPROVED" && (
                      <button
                        disabled={busy === card.id}
                        onClick={() => void update(card, "DISPATCHED")}
                        className="rounded bg-black px-3 py-2 text-white"
                      >
                        Mark dispatched
                      </button>
                    )}

                    {card.status === "DISPATCHED" && (
                      <button
                        disabled={busy === card.id}
                        onClick={() => void update(card, "FULFILLED")}
                        className="rounded bg-green-700 px-3 py-2 text-white"
                      >
                        Fulfilled
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {cards.length === 0 && (
          <p className="p-8 text-center text-gray-500">
            No gift cards issued yet.
          </p>
        )}
      </div>
    </main>
  );
}
