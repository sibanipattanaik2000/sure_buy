"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";

import { useAuth } from "@/app/context/AuthContext";

/* =========================================================
   TYPES
========================================================= */

export type CheckoutProduct = {
  id: string;
  variantId?: number | null;
  name: string;
  brand: string;
  category: string;

  storage: string;
  color: string;
  condition: string;

  price: number;
  originalPrice: number;

  warranty: string;
  image: string;

  quantity?: number;
  cartId?: string;
};

export type DeliveryAddress = {
  fullName: string;
  phone: string;
  pincode: string;
  address: string;
  area: string;
  city: string;
  state: string;
};

export type CheckoutSource = "buy-now" | "cart";

export type CheckoutData = {
  product: CheckoutProduct | null;
  products: CheckoutProduct[];

  selectedStorage: string;
  selectedColor: string;

  paymentMethod: string;

  address: DeliveryAddress | null;

  source: CheckoutSource;
};

type CheckoutContextType = {
  checkout: CheckoutData;

  setProduct: (
    product: CheckoutProduct,
    storage: string,
    color: string,
  ) => void;

  setProductsFromCart: (products: CheckoutProduct[]) => void;

  setPaymentMethod: (method: string) => void;

  setAddress: (address: DeliveryAddress) => void;

  clearCheckout: () => void;
};

/* =========================================================
   CONTEXT
========================================================= */

const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined,
);

/* =========================================================
   STORAGE
========================================================= */

const CHECKOUT_STORAGE_PREFIX = "phonebhai-checkout";
const SAVED_ADDRESS_STORAGE_PREFIX = "phonebhai-saved-address";

export const getCheckoutStorageKey = (userId: string) =>
  `${CHECKOUT_STORAGE_PREFIX}:${userId}`;

export const getSavedAddressStorageKey = (userId: string) =>
  `${SAVED_ADDRESS_STORAGE_PREFIX}:${userId}`;

/* =========================================================
   INITIAL STATE
========================================================= */

const createInitialCheckout = (): CheckoutData => ({
  product: null,
  products: [],
  selectedStorage: "",
  selectedColor: "",
  paymentMethod: "upi",
  address: null,
  source: "buy-now",
});

/* =========================================================
   PROVIDER
========================================================= */

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();

  const [checkout, setCheckout] = useState<CheckoutData>(
    createInitialCheckout(),
  );

  const [hydrated, setHydrated] = useState(false);

  /*
   * Keeps track of which user's checkout has actually
   * been loaded into React state.
   *
   * This prevents User A's state from accidentally
   * being saved under User B's storage key during
   * an account switch.
   */
  const loadedUserIdRef = useRef<string | null>(null);

  const userId = user?.id ?? null;

  /* =======================================================
     LOAD CHECKOUT FOR CURRENT USER
  ======================================================= */

  useEffect(() => {
    if (authLoading) {
      return;
    }

    /*
     * Do not allow the previous user's checkout
     * to remain visible while switching accounts.
     */
    setHydrated(false);
    setCheckout(createInitialCheckout());
    loadedUserIdRef.current = null;

    /*
     * No authenticated user.
     */
    if (!userId) {
      setHydrated(true);
      return;
    }

    const storageKey = getCheckoutStorageKey(userId);

    try {
      const saved = localStorage.getItem(storageKey);

      if (!saved) {
        setCheckout(createInitialCheckout());
      } else {
        const parsed = JSON.parse(saved);

        if (parsed && typeof parsed === "object") {
          setCheckout({
            ...createInitialCheckout(),
            ...parsed,

            source: parsed.source === "cart" ? "cart" : "buy-now",

            products: Array.isArray(parsed.products)
              ? parsed.products
              : parsed.product
                ? [parsed.product]
                : [],
          });
        } else {
          setCheckout(createInitialCheckout());
        }
      }

      /*
       * Only after loading the user's own checkout
       * do we mark that user's state as hydrated.
       */
      loadedUserIdRef.current = userId;
    } catch (error) {
      console.error("Failed to load checkout:", error);

      localStorage.removeItem(storageKey);

      setCheckout(createInitialCheckout());

      loadedUserIdRef.current = userId;
    } finally {
      setHydrated(true);
    }
  }, [authLoading, userId]);

  /* =======================================================
     SAVE CHECKOUT FOR CURRENT USER
  ======================================================= */

  useEffect(() => {
    /*
     * Never save until:
     *
     * 1. Auth is ready
     * 2. Checkout has loaded
     * 3. A user exists
     * 4. The loaded checkout belongs to THIS user
     */
    if (
      !hydrated ||
      authLoading ||
      !userId ||
      loadedUserIdRef.current !== userId
    ) {
      return;
    }

    const storageKey = getCheckoutStorageKey(userId);

    try {
      if (checkout.products.length === 0 && !checkout.product) {
        localStorage.removeItem(storageKey);
        return;
      }

      localStorage.setItem(storageKey, JSON.stringify(checkout));
    } catch (error) {
      console.error("Failed to save checkout:", error);
    }
  }, [checkout, hydrated, authLoading, userId]);

  /* =======================================================
     SINGLE PRODUCT
  ======================================================= */

  const setProduct = (
    product: CheckoutProduct,
    storage: string,
    color: string,
  ) => {
    const checkoutProduct: CheckoutProduct = {
      ...product,
      storage,
      color,
      quantity: Math.max(1, product.quantity || 1),
    };

    setCheckout((current) => ({
      ...current,
      product: checkoutProduct,
      products: [checkoutProduct],
      selectedStorage: storage,
      selectedColor: color,
      source: "buy-now",
    }));
  };

  /* =======================================================
     CART → CHECKOUT
  ======================================================= */

  const setProductsFromCart = (products: CheckoutProduct[]) => {
    if (!products.length) {
      setCheckout(createInitialCheckout());
      return;
    }

    const normalizedProducts = products.map((product) => ({
      ...product,
      quantity: Math.max(1, product.quantity || 1),
    }));

    const firstProduct = normalizedProducts[0];

    setCheckout((current) => ({
      ...current,
      product: firstProduct,
      products: normalizedProducts,
      selectedStorage: firstProduct.storage,
      selectedColor: firstProduct.color,
      source: "cart",
    }));
  };

  /* =======================================================
     PAYMENT
  ======================================================= */

  const setPaymentMethod = (method: string) => {
    setCheckout((current) => ({
      ...current,
      paymentMethod: method,
    }));
  };

  /* =======================================================
     ADDRESS
  ======================================================= */

  const setAddress = (address: DeliveryAddress) => {
    setCheckout((current) => ({
      ...current,
      address,
    }));

    if (!userId) {
      return;
    }

    try {
      const addressStorageKey = getSavedAddressStorageKey(userId);

      localStorage.setItem(
        addressStorageKey,
        JSON.stringify(address),
      );
    } catch (error) {
      console.error("Failed to save delivery address:", error);
    }
  };

  /* =======================================================
     CLEAR CHECKOUT
  ======================================================= */

  const clearCheckout = () => {
    const emptyCheckout = createInitialCheckout();

    setCheckout(emptyCheckout);

    if (!userId) {
      return;
    }

    try {
      const storageKey = getCheckoutStorageKey(userId);

      localStorage.removeItem(storageKey);
    } catch (error) {
      console.error("Failed to clear checkout:", error);
    }
  };

  /* =======================================================
     PROVIDER
  ======================================================= */

  return (
    <CheckoutContext.Provider
      value={{
        checkout,
        setProduct,
        setProductsFromCart,
        setPaymentMethod,
        setAddress,
        clearCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function useCheckout() {
  const context = useContext(CheckoutContext);

  if (!context) {
    throw new Error("useCheckout must be used inside CheckoutProvider");
  }

  return context;
}