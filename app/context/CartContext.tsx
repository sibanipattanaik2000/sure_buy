"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/* =========================================================
   API CONFIG
========================================================= */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1";

/* =========================================================
   TYPES
========================================================= */

export type CartItem = {
  cartId: string;

  id: string;
  variantId: number | null;

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
  stock: number;
};

type AddToCartProduct = Omit<
  CartItem,
  "cartId" | "quantity" | "variantId" | "stock"
> & {
  variantId?: number | null;
};

type CartContextType = {
  cartItems: CartItem[];

  cartCount: number;
  subtotal: number;
  originalTotal: number;
  savings: number;
  total: number;

  loading: boolean;
  syncing: boolean;
  error: string | null;

  refreshCart: () => Promise<void>;

  addToCart: (
    product: AddToCartProduct,
    quantity?: number,
  ) => Promise<void>;

  updateQuantity: (
    cartId: string,
    quantity: number,
  ) => Promise<void>;

  increaseQuantity: (
    cartId: string,
  ) => Promise<void>;

  decreaseQuantity: (
    cartId: string,
  ) => Promise<void>;

  removeFromCart: (
    cartId: string,
  ) => Promise<void>;

  clearCart: () => Promise<void>;

  validateCart: () => Promise<boolean>;

  isInCart: (
    productId: string,
    storage: string,
    color: string,
  ) => boolean;
};

/* =========================================================
   API RESPONSE TYPES
========================================================= */

type ApiCartItem = {
  id: string;

  productId: number;
  variantId: number | null;

  quantity: number;

  unitPrice: number | string;
  subtotal: number | string;

  product: {
    id: number;
    slug: string;
    brand: string;
    name: string;
    category: string;
    condition: string;

    price: number | string;
    originalPrice: number | string;

    warranty: string;

    rating: number | string;
    reviewCount: number;

    image:
      | {
          id: number;
          url: string;
          altText?: string | null;
        }
      | null;
  };

  variant: {
    id: number;

    storage: string;
    color: string;

    price: number | string;
    originalPrice: number | string;

    stock: number;

    image:
      | {
          id: number;
          url: string;
          altText?: string | null;
        }
      | null;
  } | null;
};

type ApiCart = {
  id: string;
  userId: string;

  items: ApiCartItem[];

  summary: {
    itemCount: number;
    totalQuantity: number;
    subtotal: number | string;
  };

  createdAt: string;
  updatedAt: string;
};

type CartApiResponse = {
  success: boolean;
  message?: string;
  data?: ApiCart;
};

type CartValidationResponse = {
  success: boolean;
  message?: string;
  data?: {
    valid: boolean;

    issues: Array<{
      itemId: string;
      code: string;
      message: string;
    }>;

    cart: ApiCart;
  };
};

/* =========================================================
   HELPERS
========================================================= */

function toNumber(
  value: number | string | null | undefined,
): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string") {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  /*
   * Your backend expects:
   *
   * Authorization: Bearer <token>
   *
   * Keep this lookup compatible with the token
   * storage used by the existing frontend.
   */
const possibleKeys = [
  "phonebhai-access-token",
  "accessToken",
  "access_token",
  "token",
  "userToken",
  "authToken",
  "PhoneBhai_token",
];

  for (const key of possibleKeys) {
    const token = localStorage.getItem(key);

    if (token) {
      return token;
    }
  }

  return null;
}

/* =========================================================
   CONTEXT
========================================================= */

const CartContext =
  createContext<CartContextType | undefined>(
    undefined,
  );

/* =========================================================
   PROVIDER
========================================================= */

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cartItems, setCartItems] =
    useState<CartItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [syncing, setSyncing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  /* =======================================================
     NORMALIZE BACKEND CART
  ======================================================= */

  const normalizeCart = useCallback(
    (cart: ApiCart): CartItem[] => {
      return cart.items.map((item) => {
        const variant = item.variant;

        const productImage =
          item.product.image?.url || "";

        const variantImage =
          variant?.image?.url || "";

        return {
          cartId: item.id,

          id: String(item.product.id),

          variantId:
            item.variantId ?? null,

          name: item.product.name,

          brand: item.product.brand,

          category: item.product.category,

          storage:
            variant?.storage || "",

          color:
            variant?.color || "",

          condition:
            item.product.condition,

          price: toNumber(
            item.unitPrice,
          ),

          originalPrice: toNumber(
            variant?.originalPrice ??
              item.product.originalPrice,
          ),

          warranty:
            item.product.warranty,

          image:
            variantImage ||
            productImage,

          quantity:
            Math.max(
              1,
              item.quantity,
            ),

          stock:
            variant?.stock ?? 0,
        };
      });
    },
    [],
  );

  /* =======================================================
     AUTHENTICATED API REQUEST
  ======================================================= */

  const apiRequest = useCallback(
    async <T,>(
      endpoint: string,
      options?: RequestInit,
    ): Promise<T> => {
      const token =
        getAuthToken();

      if (!token) {
        throw new Error(
          "Please sign in to use your cart.",
        );
      }

      const response =
        await fetch(
          `${API_BASE_URL}${endpoint}`,
          {
            ...options,

            headers: {
              Accept:
                "application/json",

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,

              ...(options?.headers || {}),
            },

            cache: "no-store",
          },
        );

      let payload:
        | T
        | {
            success?: boolean;
            message?: string;
          };

      try {
        payload =
          await response.json();
      } catch {
        throw new Error(
          "The server returned an invalid response.",
        );
      }

      if (!response.ok) {
        const message =
          typeof payload === "object" &&
          payload !== null &&
          "message" in payload
            ? String(
                (
                  payload as {
                    message?: string;
                  }
                ).message ||
                  "Cart request failed.",
              )
            : "Cart request failed.";

        throw new Error(
          message,
        );
      }

      return payload as T;
    },
    [],
  );

  /* =======================================================
     REFRESH CART
  ======================================================= */

  const refreshCart =
    useCallback(async () => {
      const token =
        getAuthToken();

      /*
       * Guest users don't have a backend cart.
       *
       * We intentionally don't create fake backend
       * cart records without authentication.
       */
      if (!token) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      try {
        setError(null);

        const response =
          await apiRequest<CartApiResponse>(
            "/cart",
          );

        if (
          !response.success ||
          !response.data
        ) {
          throw new Error(
            response.message ||
              "Unable to load your cart.",
          );
        }

        setCartItems(
          normalizeCart(
            response.data,
          ),
        );
      } catch (requestError) {
        console.error(
          "Failed to load cart:",
          requestError,
        );

        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load your cart.",
        );
      } finally {
        setLoading(false);
      }
    }, [
      apiRequest,
      normalizeCart,
    ]);

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    void refreshCart();
  }, [refreshCart]);

  /* =======================================================
     ADD TO CART
  ======================================================= */

  const addToCart =
    useCallback(
      async (
        product: AddToCartProduct,
        quantity = 1,
      ) => {
        const safeQuantity =
          Math.min(
            99,
            Math.max(
              1,
              Math.floor(
                quantity,
              ),
            ),
          );

        try {
          setSyncing(true);
          setError(null);

          const response =
            await apiRequest<CartApiResponse>(
              "/cart/items",
              {
                method: "POST",

                body: JSON.stringify({
                  productId:
                    Number(
                      product.id,
                    ),

                  variantId:
                    product.variantId ??
                    null,

                  quantity:
                    safeQuantity,
                }),
              },
            );

          if (
            !response.success ||
            !response.data
          ) {
            throw new Error(
              response.message ||
                "Unable to add item to cart.",
            );
          }

          setCartItems(
            normalizeCart(
              response.data,
            ),
          );
        } catch (requestError) {
          console.error(
            "Failed to add item to cart:",
            requestError,
          );

          const message =
            requestError instanceof Error
              ? requestError.message
              : "Unable to add item to cart.";

          setError(message);

          throw new Error(
            message,
          );
        } finally {
          setSyncing(false);
        }
      },
      [
        apiRequest,
        normalizeCart,
      ],
    );

  /* =======================================================
     UPDATE QUANTITY
  ======================================================= */

  const updateQuantity =
    useCallback(
      async (
        cartId: string,
        quantity: number,
      ) => {
        const safeQuantity =
          Math.min(
            99,
            Math.max(
              1,
              Math.floor(
                quantity,
              ),
            ),
          );

        try {
          setSyncing(true);
          setError(null);

          const response =
            await apiRequest<CartApiResponse>(
              `/cart/items/${encodeURIComponent(
                cartId,
              )}`,
              {
                method: "PATCH",

                body: JSON.stringify({
                  quantity:
                    safeQuantity,
                }),
              },
            );

          if (
            !response.success ||
            !response.data
          ) {
            throw new Error(
              response.message ||
                "Unable to update quantity.",
            );
          }

          setCartItems(
            normalizeCart(
              response.data,
            ),
          );
        } catch (requestError) {
          console.error(
            "Failed to update cart quantity:",
            requestError,
          );

          const message =
            requestError instanceof Error
              ? requestError.message
              : "Unable to update quantity.";

          setError(message);

          /*
           * Refresh from backend so the UI reflects
           * the authoritative stock/quantity.
           */
          await refreshCart();

          throw new Error(
            message,
          );
        } finally {
          setSyncing(false);
        }
      },
      [
        apiRequest,
        normalizeCart,
        refreshCart,
      ],
    );

  /* =======================================================
     INCREASE QUANTITY
  ======================================================= */

  const increaseQuantity =
    useCallback(
      async (
        cartId: string,
      ) => {
        const item =
          cartItems.find(
            (cartItem) =>
              cartItem.cartId ===
              cartId,
          );

        if (!item) {
          return;
        }

        if (
          item.stock > 0 &&
          item.quantity >= item.stock
        ) {
          setError(
            `Only ${item.stock} item(s) are currently available.`,
          );

          return;
        }

        await updateQuantity(
          cartId,
          item.quantity + 1,
        );
      },
      [
        cartItems,
        updateQuantity,
      ],
    );

  /* =======================================================
     DECREASE QUANTITY
  ======================================================= */

  const decreaseQuantity =
    useCallback(
      async (
        cartId: string,
      ) => {
        const item =
          cartItems.find(
            (cartItem) =>
              cartItem.cartId ===
              cartId,
          );

        if (!item) {
          return;
        }

        if (
          item.quantity <= 1
        ) {
          await removeFromCart(
            cartId,
          );

          return;
        }

        await updateQuantity(
          cartId,
          item.quantity - 1,
        );
      },
      [
        cartItems,
        updateQuantity,
      ],
    );

  /* =======================================================
     REMOVE ITEM
  ======================================================= */

  const removeFromCart =
    useCallback(
      async (
        cartId: string,
      ) => {
        try {
          setSyncing(true);
          setError(null);

          const response =
            await apiRequest<CartApiResponse>(
              `/cart/items/${encodeURIComponent(
                cartId,
              )}`,
              {
                method: "DELETE",
              },
            );

          if (
            !response.success ||
            !response.data
          ) {
            throw new Error(
              response.message ||
                "Unable to remove item.",
            );
          }

          setCartItems(
            normalizeCart(
              response.data,
            ),
          );
        } catch (requestError) {
          console.error(
            "Failed to remove cart item:",
            requestError,
          );

          const message =
            requestError instanceof Error
              ? requestError.message
              : "Unable to remove item.";

          setError(message);

          throw new Error(
            message,
          );
        } finally {
          setSyncing(false);
        }
      },
      [
        apiRequest,
        normalizeCart,
      ],
    );

  /* =======================================================
     CLEAR CART
  ======================================================= */

  const clearCart =
    useCallback(async () => {
      try {
        setSyncing(true);
        setError(null);

        const response =
          await apiRequest<CartApiResponse>(
            "/cart",
            {
              method: "DELETE",
            },
          );

        if (
          !response.success ||
          !response.data
        ) {
          throw new Error(
            response.message ||
              "Unable to clear cart.",
          );
        }

        setCartItems(
          normalizeCart(
            response.data,
          ),
        );
      } catch (requestError) {
        console.error(
          "Failed to clear cart:",
          requestError,
        );

        const message =
          requestError instanceof Error
            ? requestError.message
            : "Unable to clear cart.";

        setError(message);

        throw new Error(
          message,
        );
      } finally {
        setSyncing(false);
      }
    }, [
      apiRequest,
      normalizeCart,
    ]);

  /* =======================================================
     VALIDATE CART
  ======================================================= */

  const validateCart =
    useCallback(async () => {
      try {
        setSyncing(true);
        setError(null);

        const response =
          await apiRequest<CartValidationResponse>(
            "/cart/validate",
            {
              method: "POST",
            },
          );

        if (
          !response.success ||
          !response.data
        ) {
          throw new Error(
            response.message ||
              "Unable to validate cart.",
          );
        }

        setCartItems(
          normalizeCart(
            response.data.cart,
          ),
        );

        if (
          !response.data.valid
        ) {
          const firstIssue =
            response.data
              .issues[0];

          setError(
            firstIssue?.message ||
              "Please review your cart before checkout.",
          );

          return false;
        }

        return true;
      } catch (requestError) {
        console.error(
          "Failed to validate cart:",
          requestError,
        );

        const message =
          requestError instanceof Error
            ? requestError.message
            : "Unable to validate cart.";

        setError(message);

        return false;
      } finally {
        setSyncing(false);
      }
    }, [
      apiRequest,
      normalizeCart,
    ]);

  /* =======================================================
     CHECK IF VARIANT IS IN CART
  ======================================================= */

  const isInCart =
    useCallback(
      (
        productId: string,
        storage: string,
        color: string,
      ) => {
        return cartItems.some(
          (item) =>
            item.id ===
              productId &&
            item.storage ===
              storage &&
            item.color ===
              color,
        );
      },
      [cartItems],
    );

  /* =======================================================
     CART COUNT
  ======================================================= */

  const cartCount =
    useMemo(
      () =>
        cartItems.reduce(
          (total, item) =>
            total +
            item.quantity,
          0,
        ),
      [cartItems],
    );

  /* =======================================================
     SUBTOTAL
  ======================================================= */

  const subtotal =
    useMemo(
      () =>
        cartItems.reduce(
          (total, item) =>
            total +
            item.price *
              item.quantity,
          0,
        ),
      [cartItems],
    );

  /* =======================================================
     ORIGINAL TOTAL
  ======================================================= */

  const originalTotal =
    useMemo(
      () =>
        cartItems.reduce(
          (total, item) =>
            total +
            item.originalPrice *
              item.quantity,
          0,
        ),
      [cartItems],
    );

  /* =======================================================
     SAVINGS
  ======================================================= */

  const savings =
    useMemo(
      () =>
        Math.max(
          0,
          originalTotal -
            subtotal,
        ),
      [
        originalTotal,
        subtotal,
      ],
    );

  /* =======================================================
     TOTAL
  ======================================================= */

  const total = subtotal;

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value =
    useMemo(
      () => ({
        cartItems,

        cartCount,
        subtotal,
        originalTotal,
        savings,
        total,

        loading,
        syncing,
        error,

        refreshCart,

        addToCart,

        updateQuantity,

        increaseQuantity,

        decreaseQuantity,

        removeFromCart,

        clearCart,

        validateCart,

        isInCart,
      }),
      [
        cartItems,

        cartCount,
        subtotal,
        originalTotal,
        savings,
        total,

        loading,
        syncing,
        error,

        refreshCart,

        addToCart,

        updateQuantity,

        increaseQuantity,

        decreaseQuantity,

        removeFromCart,

        clearCart,

        validateCart,

        isInCart,
      ],
    );

  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function useCart() {
  const context =
    useContext(
      CartContext,
    );

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider",
    );
  }

  return context;
}