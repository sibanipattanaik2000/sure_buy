"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/* =========================================================
   TYPES
========================================================= */

export type CartItem = {
  cartId: string;

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

  quantity: number;
};

type AddToCartProduct = Omit<CartItem, "cartId" | "quantity">;

type CartContextType = {
  cartItems: CartItem[];

  cartCount: number;
  subtotal: number;
  originalTotal: number;
  savings: number;
  total: number;

  addToCart: (
    product: AddToCartProduct,
    quantity?: number
  ) => void;

  updateQuantity: (
    cartId: string,
    quantity: number
  ) => void;

  increaseQuantity: (
    cartId: string
  ) => void;

  decreaseQuantity: (
    cartId: string
  ) => void;

  removeFromCart: (
    cartId: string
  ) => void;

  clearCart: () => void;

  isInCart: (
    productId: string,
    storage: string,
    color: string
  ) => boolean;
};

/* =========================================================
   CONTEXT
========================================================= */

const CartContext =
  createContext<CartContextType | undefined>(
    undefined
  );

/* =========================================================
   STORAGE KEY
========================================================= */

const CART_STORAGE_KEY = "phonebuy_cart";

/* =========================================================
   PROVIDER
========================================================= */

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cartItems, setCartItems] = useState<CartItem[]>(
    []
  );

  const [hydrated, setHydrated] =
    useState(false);

  /* =======================================================
     LOAD CART
  ======================================================= */

  useEffect(() => {
    try {
      const savedCart =
        localStorage.getItem(
          CART_STORAGE_KEY
        );

      if (savedCart) {
        const parsedCart =
          JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        }
      }
    } catch (error) {
      console.error(
        "Failed to load cart:",
        error
      );
    } finally {
      setHydrated(true);
    }
  }, []);

  /* =======================================================
     SAVE CART
  ======================================================= */

  useEffect(() => {
    if (!hydrated) return;

    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cartItems)
      );
    } catch (error) {
      console.error(
        "Failed to save cart:",
        error
      );
    }
  }, [cartItems, hydrated]);

  /* =======================================================
     ADD TO CART
  ======================================================= */

 const addToCart = (
  product: AddToCartProduct,
  quantity = 1
) => {
  const safeQuantity = Math.max(
    1,
    Math.floor(quantity)
  );

  setCartItems((currentItems) => {
    const existingItemIndex = currentItems.findIndex(
      (item) =>
        item.id === product.id &&
        item.storage === product.storage &&
        item.color === product.color
    );

    let updatedItems: CartItem[];

    if (existingItemIndex !== -1) {
      updatedItems = currentItems.map((item, index) =>
        index === existingItemIndex
          ? {
              ...item,
              quantity: item.quantity + safeQuantity,
            }
          : item
      );
    } else {
      const newCartItem: CartItem = {
        ...product,
        cartId: `${product.id}-${product.storage}-${product.color}`
          .toLowerCase()
          .replace(/\s+/g, "-"),
        quantity: safeQuantity,
      };

      updatedItems = [
        ...currentItems,
        newCartItem,
      ];
    }

    // Keep localStorage synchronized
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(updatedItems)
      );
    } catch (error) {
      console.error("Failed to save cart:", error);
    }

    return updatedItems;
  });
};

  /* =======================================================
     UPDATE QUANTITY
  ======================================================= */

  const updateQuantity = (
    cartId: string,
    quantity: number
  ) => {
    const safeQuantity = Math.floor(quantity);

    if (safeQuantity <= 0) {
      setCartItems((items) =>
        items.filter(
          (item) =>
            item.cartId !== cartId
        )
      );

      return;
    }

    setCartItems((items) =>
      items.map((item) =>
        item.cartId === cartId
          ? {
              ...item,
              quantity: safeQuantity,
            }
          : item
      )
    );
  };

  /* =======================================================
     INCREASE
  ======================================================= */

  const increaseQuantity = (
    cartId: string
  ) => {
    setCartItems((items) =>
      items.map((item) =>
        item.cartId === cartId
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  };

  /* =======================================================
     DECREASE
  ======================================================= */

  const decreaseQuantity = (
    cartId: string
  ) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.cartId === cartId
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    );
  };

  /* =======================================================
     REMOVE
  ======================================================= */

  const removeFromCart = (
    cartId: string
  ) => {
    setCartItems((items) =>
      items.filter(
        (item) =>
          item.cartId !== cartId
      )
    );
  };

  /* =======================================================
     CLEAR
  ======================================================= */

  const clearCart = () => {
    setCartItems([]);
  };

  /* =======================================================
     CHECK IF VARIANT IS IN CART
  ======================================================= */

  const isInCart = (
    productId: string,
    storage: string,
    color: string
  ) => {
    return cartItems.some(
      (item) =>
        item.id === productId &&
        item.storage === storage &&
        item.color === color
    );
  };

  /* =======================================================
     CART COUNT
  ======================================================= */

  const cartCount = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );
  }, [cartItems]);

  /* =======================================================
     SUBTOTAL
  ======================================================= */

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total +
        item.price * item.quantity,
      0
    );
  }, [cartItems]);

  /* =======================================================
     ORIGINAL TOTAL
  ======================================================= */

  const originalTotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total +
        item.originalPrice *
          item.quantity,
      0
    );
  }, [cartItems]);

  /* =======================================================
     SAVINGS
  ======================================================= */

  const savings = useMemo(() => {
    return Math.max(
      0,
      originalTotal - subtotal
    );
  }, [
    originalTotal,
    subtotal,
  ]);

  /* =======================================================
     TOTAL
  ======================================================= */

  const total = subtotal;

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value = useMemo(
    () => ({
      cartItems,
      cartCount,
      subtotal,
      originalTotal,
      savings,
      total,

      addToCart,
      updateQuantity,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      clearCart,
      isInCart,
    }),
    [
      cartItems,
      cartCount,
      subtotal,
      originalTotal,
      savings,
      total,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}