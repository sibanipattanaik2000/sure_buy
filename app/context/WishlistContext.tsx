
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";

import {
  getWishlist,
  addWishlistItem,
  removeWishlistItem,
  clearWishlistApi,
  type WishlistItem,
} from "@/app/lib/api";

export type WishlistPhone = {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  storage?: string;
};

type WishlistContextType = {
  wishlist: WishlistPhone[];
  wishlistCount: number;
  loading: boolean;
  isWishlisted: (id: string) => boolean;
  addToWishlist: (phone: WishlistPhone) => Promise<void>;
  removeFromWishlist: (id: string) => Promise<void>;
  toggleWishlist: (phone: WishlistPhone) => Promise<void>;
  clearWishlist: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
};

const WishlistContext =
  createContext<WishlistContextType | undefined>(undefined);

function mapWishlistItem(item: WishlistItem): WishlistPhone {
  return {
    id: String(item.productId),
    name: item.name,
    brand: item.brand,
    price: item.price,
    image: item.image ?? "",
  };
}

function getNumericProductId(id: string): number {
  const productId = Number(id);

  if (!Number.isSafeInteger(productId) || productId <= 0) {
    throw new Error(`Invalid wishlist product ID: ${id}`);
  }

  return productId;
}

export function WishlistProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [wishlist, setWishlist] = useState<WishlistPhone[]>([]);
  const [loading, setLoading] = useState(false);

  // Prevent concurrent add/remove requests for the same product.
  const pendingIds = useRef<Set<string>>(new Set());

  const refreshWishlist = useCallback(async () => {
    if (authLoading) return;

    if (!user) {
      setWishlist([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await getWishlist();

      if (!response.success || !response.data) {
        console.error(
          "Failed to refresh wishlist:",
          response.message || "Invalid wishlist response",
        );
        return;
      }

      setWishlist(response.data.map(mapWishlistItem));
    } catch (error) {
      console.error("Failed to load wishlist:", error);
    } finally {
      setLoading(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    void refreshWishlist();
  }, [refreshWishlist]);

  const isWishlisted = useCallback(
    (id: string) => {
      return wishlist.some((phone) => phone.id === String(id));
    },
    [wishlist],
  );

  const addToWishlist = useCallback(
    async (phone: WishlistPhone) => {
      if (!user) {
        router.push("/login");
        return;
      }

      const id = String(phone.id);

      if (pendingIds.current.has(id) || isWishlisted(id)) {
        return;
      }

      const productId = getNumericProductId(id);

      // Lock this product before updating the UI.
      pendingIds.current.add(id);

      setWishlist((current) => {
        if (current.some((item) => item.id === id)) {
          return current;
        }

        return [...current, phone];
      });

      try {
        const response = await addWishlistItem(productId);

        if (!response.success) {
          throw new Error(
            response.message || "Unable to add product to wishlist",
          );
        }
      } catch (error) {
        // Roll back only this product; preserve other wishlist changes.
        setWishlist((current) =>
          current.filter((item) => item.id !== id),
        );

        console.error("Failed to add wishlist item:", error);
      } finally {
        pendingIds.current.delete(id);
      }
    },
    [user, router, isWishlisted],
  );

  const removeFromWishlist = useCallback(
    async (id: string) => {
      if (!user) {
        router.push("/login");
        return;
      }

      const productIdString = String(id);

      if (pendingIds.current.has(productIdString)) {
        return;
      }

      const productId = getNumericProductId(productIdString);
      const previousItem = wishlist.find(
        (item) => item.id === productIdString,
      );

      if (!previousItem) return;

      pendingIds.current.add(productIdString);

      // Optimistic removal.
      setWishlist((current) =>
        current.filter((phone) => phone.id !== productIdString),
      );

      try {
        const response = await removeWishlistItem(productId);

        if (!response.success) {
          throw new Error(
            response.message || "Unable to remove product from wishlist",
          );
        }
      } catch (error) {
        // Restore the removed item without overwriting other changes.
        setWishlist((current) => {
          if (current.some((item) => item.id === productIdString)) {
            return current;
          }

          return [...current, previousItem];
        });

        console.error("Failed to remove wishlist item:", error);
      } finally {
        pendingIds.current.delete(productIdString);
      }
    },
    [user, router, wishlist],
  );

  const toggleWishlist = useCallback(
    async (phone: WishlistPhone) => {
      if (!user) {
        router.push("/login");
        return;
      }

      const id = String(phone.id);

      // Ignore repeated clicks while this product is being saved/removed.
      if (pendingIds.current.has(id)) {
        return;
      }

      if (isWishlisted(id)) {
        await removeFromWishlist(id);
      } else {
        await addToWishlist(phone);
      }
    },
    [user, router, isWishlisted, addToWishlist, removeFromWishlist],
  );

  const clearWishlist = useCallback(async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (pendingIds.current.size > 0) {
      return;
    }

    const previousWishlist = wishlist;
    setWishlist([]);

    try {
      const response = await clearWishlistApi();

      if (!response.success) {
        throw new Error(
          response.message || "Unable to clear wishlist",
        );
      }
    } catch (error) {
      setWishlist(previousWishlist);
      console.error("Failed to clear wishlist:", error);
    }
  }, [user, router, wishlist]);

  const value = useMemo<WishlistContextType>(
    () => ({
      wishlist,
      wishlistCount: wishlist.length,
      loading,
      isWishlisted,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      clearWishlist,
      refreshWishlist,
    }),
    [
      wishlist,
      loading,
      isWishlisted,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
      clearWishlist,
      refreshWishlist,
    ],
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider",
    );
  }

  return context;
}
