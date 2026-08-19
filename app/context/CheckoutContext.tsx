"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

/* =========================================================
   TYPES
========================================================= */

export type CheckoutProduct = {
  id: string;
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

export type CheckoutData = {
  product: CheckoutProduct | null;
  products: CheckoutProduct[];

  selectedStorage: string;
  selectedColor: string;

  paymentMethod: string;

  address: DeliveryAddress | null;
};

type CheckoutContextType = {
  checkout: CheckoutData;

  setProduct: (
    product: CheckoutProduct,
    storage: string,
    color: string,
  ) => void;

  setProductsFromCart: (
    products: CheckoutProduct[],
  ) => void;

  setPaymentMethod: (
    method: string,
  ) => void;

  setAddress: (
    address: DeliveryAddress,
  ) => void;

  clearCheckout: () => void;
};

/* =========================================================
   CONTEXT
========================================================= */

const CheckoutContext =
  createContext<
    CheckoutContextType | undefined
  >(undefined);

/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEY =
  "phonebuy-checkout";

/*
 * Permanent saved delivery address.
 *
 * This is intentionally separate from checkout.
 * Clearing checkout will NOT remove the saved address.
 */
export const SAVED_ADDRESS_KEY =
  "phonebuy-saved-address";

/* =========================================================
   INITIAL STATE
========================================================= */

const createInitialCheckout =
  (): CheckoutData => ({
    product: null,
    products: [],
    selectedStorage: "",
    selectedColor: "",
    paymentMethod: "upi",
    address: null,
  });

/* =========================================================
   PROVIDER
========================================================= */

export function CheckoutProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [checkout, setCheckout] =
    useState<CheckoutData>(
      createInitialCheckout(),
    );

  const [hydrated, setHydrated] =
    useState(false);

  /* =======================================================
     LOAD CHECKOUT
  ======================================================= */

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(
          STORAGE_KEY,
        );

      if (saved) {
        const parsed =
          JSON.parse(saved);

        if (
          parsed &&
          typeof parsed === "object"
        ) {
          setCheckout({
            ...createInitialCheckout(),
            ...parsed,
            products:
              Array.isArray(
                parsed.products,
              )
                ? parsed.products
                : parsed.product
                  ? [parsed.product]
                  : [],
          });
        }
      }
    } catch (error) {
      console.error(
        "Failed to load checkout:",
        error,
      );

      localStorage.removeItem(
        STORAGE_KEY,
      );
    } finally {
      setHydrated(true);
    }
  }, []);

  /* =======================================================
     SAVE CHECKOUT
  ======================================================= */

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      if (
        checkout.products.length === 0 &&
        !checkout.product
      ) {
        localStorage.removeItem(
          STORAGE_KEY,
        );

        return;
      }

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(checkout),
      );
    } catch (error) {
      console.error(
        "Failed to save checkout:",
        error,
      );
    }
  }, [checkout, hydrated]);

  /* =======================================================
     SINGLE PRODUCT
  ======================================================= */

  const setProduct = (
    product: CheckoutProduct,
    storage: string,
    color: string,
  ) => {
    const checkoutProduct = {
      ...product,
      storage,
      color,
      quantity: Math.max(
        1,
        product.quantity || 1,
      ),
    };

    setCheckout((current) => ({
      ...current,

      product:
        checkoutProduct,

      products: [
        checkoutProduct,
      ],

      selectedStorage:
        storage,

      selectedColor:
        color,
    }));
  };

  /* =======================================================
     CART → CHECKOUT
  ======================================================= */

  const setProductsFromCart = (
    products: CheckoutProduct[],
  ) => {
    if (!products.length) {
      setCheckout(
        createInitialCheckout(),
      );

      return;
    }

    const normalizedProducts =
      products.map((product) => ({
        ...product,
        quantity: Math.max(
          1,
          product.quantity || 1,
        ),
      }));

    const firstProduct =
      normalizedProducts[0];

    setCheckout((current) => ({
      ...current,

      product:
        firstProduct,

      products:
        normalizedProducts,

      selectedStorage:
        firstProduct.storage,

      selectedColor:
        firstProduct.color,
    }));
  };

  /* =======================================================
     PAYMENT
  ======================================================= */

  const setPaymentMethod = (
    method: string,
  ) => {
    setCheckout((current) => ({
      ...current,
      paymentMethod: method,
    }));
  };

  /* =======================================================
     ADDRESS
  ======================================================= */

  const setAddress = (
    address: DeliveryAddress,
  ) => {
    /*
     * Save it to the current checkout.
     */
    setCheckout((current) => ({
      ...current,
      address,
    }));

    /*
     * Also persist it independently
     * for My Account.
     */
    try {
      localStorage.setItem(
        SAVED_ADDRESS_KEY,
        JSON.stringify(address),
      );
    } catch (error) {
      console.error(
        "Failed to save delivery address:",
        error,
      );
    }
  };

  /* =======================================================
     CLEAR CHECKOUT
  ======================================================= */

  const clearCheckout = () => {
    const emptyCheckout =
      createInitialCheckout();

    setCheckout(
      emptyCheckout,
    );

    try {
      /*
       * IMPORTANT:
       * This removes only the temporary
       * checkout session.
       *
       * Saved address remains untouched.
       */
      localStorage.removeItem(
        STORAGE_KEY,
      );
    } catch (error) {
      console.error(
        "Failed to clear checkout:",
        error,
      );
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
  const context =
    useContext(CheckoutContext);

  if (!context) {
    throw new Error(
      "useCheckout must be used inside CheckoutProvider",
    );
  }

  return context;
}