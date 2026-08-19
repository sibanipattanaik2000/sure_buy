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
  /*
   * First product.
   * Kept for compatibility with your existing orderStorage.
   */
  product: CheckoutProduct | null;

  /*
   * All products coming from cart.
   */
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
  createContext<CheckoutContextType | undefined>(
    undefined,
  );

/* =========================================================
   STORAGE
========================================================= */

const STORAGE_KEY = "phonebuy-checkout";

/* =========================================================
   INITIAL STATE
========================================================= */

const initialCheckout: CheckoutData = {
  product: null,
  products: [],
  selectedStorage: "",
  selectedColor: "",
  paymentMethod: "upi",
  address: null,
};

/* =========================================================
   PROVIDER
========================================================= */

export function CheckoutProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [checkout, setCheckout] =
    useState<CheckoutData>(initialCheckout);

  /* =======================================================
     LOAD
  ======================================================= */

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        setCheckout({
          ...initialCheckout,
          ...parsed,
          products:
            Array.isArray(parsed.products)
              ? parsed.products
              : parsed.product
              ? [parsed.product]
              : [],
        });
      }
    } catch (error) {
      console.error(
        "Failed to load checkout:",
        error,
      );
    }
  }, []);

  /* =======================================================
     SAVE
  ======================================================= */

  useEffect(() => {
    try {
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
  }, [checkout]);

  /* =======================================================
     SINGLE PRODUCT
  ======================================================= */

  const setProduct = (
    product: CheckoutProduct,
    storage: string,
    color: string,
  ) => {
    setCheckout((current) => ({
      ...current,

      product,

      products: [
        {
          ...product,
          storage,
          color,
          quantity: product.quantity || 1,
        },
      ],

      selectedStorage: storage,
      selectedColor: color,
    }));
  };

  /* =======================================================
     CART → CHECKOUT
  ======================================================= */

  const setProductsFromCart = (
    products: CheckoutProduct[],
  ) => {
    if (!products.length) {
      setCheckout((current) => ({
        ...current,
        product: null,
        products: [],
      }));

      return;
    }

    const firstProduct = products[0];

    setCheckout((current) => ({
      ...current,

      /*
       * Keep first product for compatibility.
       */
      product: firstProduct,

      /*
       * Store every cart product.
       */
      products,

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
    setCheckout((current) => ({
      ...current,
      address,
    }));
  };

  /* =======================================================
     CLEAR
  ======================================================= */

  const clearCheckout = () => {
    setCheckout(initialCheckout);

    localStorage.removeItem(
      STORAGE_KEY,
    );
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