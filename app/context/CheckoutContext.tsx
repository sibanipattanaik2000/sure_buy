"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

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
  setPaymentMethod: (method: string) => void;
  setAddress: (address: DeliveryAddress) => void;
  clearCheckout: () => void;
};

const CheckoutContext =
  createContext<CheckoutContextType | undefined>(undefined);

const STORAGE_KEY = "phonebuy-checkout";

const initialCheckout: CheckoutData = {
  product: null,
  selectedStorage: "",
  selectedColor: "",
  paymentMethod: "upi",
  address: null,
};

export function CheckoutProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [checkout, setCheckout] =
    useState<CheckoutData>(initialCheckout);

  /* Load checkout data */

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        setCheckout(JSON.parse(saved));
      }
    } catch (error) {
      console.error(
        "Failed to load checkout:",
        error,
      );
    }
  }, []);

  /* Save checkout data */

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

  const setProduct = (
    product: CheckoutProduct,
    storage: string,
    color: string,
  ) => {
    setCheckout((current) => ({
      ...current,
      product,
      selectedStorage: storage,
      selectedColor: color,
    }));
  };

  const setPaymentMethod = (method: string) => {
    setCheckout((current) => ({
      ...current,
      paymentMethod: method,
    }));
  };

  const setAddress = (
    address: DeliveryAddress,
  ) => {
    setCheckout((current) => ({
      ...current,
      address,
    }));
  };

  const clearCheckout = () => {
    setCheckout(initialCheckout);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <CheckoutContext.Provider
      value={{
        checkout,
        setProduct,
        setPaymentMethod,
        setAddress,
        clearCheckout,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);

  if (!context) {
    throw new Error(
      "useCheckout must be used inside CheckoutProvider",
    );
  }

  return context;
}