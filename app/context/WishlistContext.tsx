
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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

  addToWishlist: (
    phone: WishlistPhone,
  ) => Promise<void>;

  removeFromWishlist: (
    id: string,
  ) => Promise<void>;

  toggleWishlist: (
    phone: WishlistPhone,
  ) => Promise<void>;

  clearWishlist: () => Promise<void>;

  refreshWishlist: () => Promise<void>;
};

const WishlistContext =
  createContext<WishlistContextType | undefined>(
    undefined,
  );

/**
 * Convert backend wishlist item into
 * the existing frontend WishlistPhone shape.
 */
function mapWishlistItem(
  item: WishlistItem,
): WishlistPhone {
  return {
    id: String(item.productId),
    name: item.name,
    brand: item.brand,
    price: item.price,
    image: item.image ?? "",
  };
}

export function WishlistProvider({
  children,
}: {
  children: ReactNode;
}) {
  const {
    user,
    loading: authLoading,
  } = useAuth();

  const router = useRouter();

  const [wishlist, setWishlist] =
    useState<WishlistPhone[]>([]);

  const [loading, setLoading] =
    useState(false);

  /**
   * Load wishlist from backend.
   */
  const refreshWishlist =
    useCallback(async () => {
      if (authLoading) {
        return;
      }

      /**
       * Logged-out users have no server wishlist.
       */
      if (!user) {
        setWishlist([]);
        return;
      }

      setLoading(true);

      try {
        const response = await getWishlist();

        if (
          !response.success ||
          !response.data
        ) {
          setWishlist([]);
          return;
        }

        setWishlist(
          response.data.map(mapWishlistItem),
        );
      } catch (error) {
        console.error(
          "Failed to load wishlist:",
          error,
        );

        setWishlist([]);
      } finally {
        setLoading(false);
      }
    }, [user, authLoading]);

  /**
   * Load wishlist whenever authentication changes.
   */
  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  /**
   * Check whether product is wishlisted.
   */
  const isWishlisted = useCallback(
    (id: string) => {
      return wishlist.some(
        (phone) => phone.id === id,
      );
    },
    [wishlist],
  );

  /**
   * Add product to backend wishlist.
   */
  const addToWishlist = useCallback(
    async (phone: WishlistPhone) => {
      /**
       * Redirect unauthenticated users.
       * Never throw LOGIN_REQUIRED into
       * the React event handler.
       */
      if (!user) {
        router.push("/login");
        return;
      }

      /**
       * Prevent duplicate request.
       */
      if (isWishlisted(phone.id)) {
        return;
      }

      /**
       * Optimistic UI update.
       */
      setWishlist((current) => [
        ...current,
        phone,
      ]);

      try {
        await addWishlistItem(
          Number(phone.id),
        );
      } catch (error) {
        /**
         * Roll back UI if backend fails.
         */
        setWishlist((current) =>
          current.filter(
            (item) =>
              item.id !== phone.id,
          ),
        );

        console.error(
          "Failed to add wishlist item:",
          error,
        );
      }
    },
    [
      user,
      router,
      isWishlisted,
    ],
  );

  /**
   * Remove product from backend wishlist.
   */
  const removeFromWishlist =
    useCallback(
      async (id: string) => {
        /**
         * Redirect unauthenticated users.
         */
        if (!user) {
          router.push("/login");
          return;
        }

        const previousWishlist =
          wishlist;

        /**
         * Optimistic removal.
         */
        setWishlist((current) =>
          current.filter(
            (phone) => phone.id !== id,
          ),
        );

        try {
          await removeWishlistItem(
            Number(id),
          );
        } catch (error) {
          /**
           * Roll back if API fails.
           */
          setWishlist(
            previousWishlist,
          );

          console.error(
            "Failed to remove wishlist item:",
            error,
          );
        }
      },
      [
        user,
        router,
        wishlist,
      ],
    );

  /**
   * Toggle wishlist state.
   */
  const toggleWishlist = useCallback(
    async (phone: WishlistPhone) => {
      /**
       * IMPORTANT:
       * Never throw LOGIN_REQUIRED here.
       * This function is called directly by
       * button onClick handlers.
       */
      if (!user) {
        router.push("/login");
        return;
      }

      if (isWishlisted(phone.id)) {
        await removeFromWishlist(
          phone.id,
        );
      } else {
        await addToWishlist(phone);
      }
    },
    [
      user,
      router,
      isWishlisted,
      removeFromWishlist,
      addToWishlist,
    ],
  );

  /**
   * Clear entire backend wishlist.
   */
  const clearWishlist =
    useCallback(async () => {
      /**
       * Redirect unauthenticated users.
       */
      if (!user) {
        router.push("/login");
        return;
      }

      const previousWishlist =
        wishlist;

      /**
       * Optimistic clear.
       */
      setWishlist([]);

      try {
        await clearWishlistApi();
      } catch (error) {
        /**
         * Roll back if API fails.
         */
        setWishlist(
          previousWishlist,
        );

        console.error(
          "Failed to clear wishlist:",
          error,
        );
      }
    }, [
      user,
      router,
      wishlist,
    ]);

  const value =
    useMemo<WishlistContextType>(
      () => ({
        wishlist,
        wishlistCount:
          wishlist.length,
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
    <WishlistContext.Provider
      value={value}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context =
    useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider",
    );
  }

  return context;
}
