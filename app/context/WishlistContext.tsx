"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

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
  isWishlisted: (id: string) => boolean;
  addToWishlist: (phone: WishlistPhone) => void;
  removeFromWishlist: (id: string) => void;
  toggleWishlist: (phone: WishlistPhone) => void;
  clearWishlist: () => void;
};

const WishlistContext =
  createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [wishlist, setWishlist] = useState<WishlistPhone[]>([]);

  /* Load wishlist saved in browser */

  useEffect(() => {
    try {
      const savedWishlist = localStorage.getItem("phonebuy-wishlist");

      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error("Failed to load wishlist:", error);
    }
  }, []);

  /* Save wishlist whenever it changes */

  useEffect(() => {
    try {
      localStorage.setItem(
        "phonebuy-wishlist",
        JSON.stringify(wishlist)
      );
    } catch (error) {
      console.error("Failed to save wishlist:", error);
    }
  }, [wishlist]);

  /* Check whether phone is already wishlisted */

  const isWishlisted = (id: string) => {
    return wishlist.some((phone) => phone.id === id);
  };

  /* Add phone */

  const addToWishlist = (phone: WishlistPhone) => {
    setWishlist((current) => {
      if (current.some((item) => item.id === phone.id)) {
        return current;
      }

      return [...current, phone];
    });
  };

  /* Remove phone */

  const removeFromWishlist = (id: string) => {
    setWishlist((current) =>
      current.filter((phone) => phone.id !== id)
    );
  };

  /* Add / remove */

  const toggleWishlist = (phone: WishlistPhone) => {
    setWishlist((current) => {
      const exists = current.some(
        (item) => item.id === phone.id
      );

      if (exists) {
        return current.filter(
          (item) => item.id !== phone.id
        );
      }

      return [...current, phone];
    });
  };

  /* Clear everything */

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isWishlisted,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

/* Custom hook */

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error(
      "useWishlist must be used inside WishlistProvider"
    );
  }

  return context;
}