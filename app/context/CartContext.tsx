// "use client";

// import {
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import {
//   addCartItem,
//   clearCartApi,
//   deleteCartItem,
//   getCart,
//   updateCartItem,
//   validateCart as validateCartApi,
//   type CartResponse,
// } from "@/app/lib/api";

// /* =========================================================
//    TYPES
// ========================================================= */

// export type CartItem = {
//   cartId: string;

//   id: string;
//   variantId: number | null;

//   name: string;
//   brand: string;
//   category: string;

//   storage: string;
//   color: string;
//   condition: string;

//   price: number;
//   originalPrice: number;

//   warranty: string;
//   image: string;

//   quantity: number;
//   stock: number;
// };

// type AddToCartProduct = {
//   id: string | number;
//   variantId?: number | null;

//   name: string;
//   brand?: string;
//   category?: string;

//   storage?: string;
//   color?: string;
//   condition?: string;

//   price?: number;
//   originalPrice?: number;

//   warranty?: string;
//   image?: string;
// };

// type CartContextType = {
//   cartItems: CartItem[];

//   cartCount: number;
//   subtotal: number;
//   originalTotal: number;
//   savings: number;
//   total: number;

//   loading: boolean;
//   syncing: boolean;
//   error: string | null;

//   refreshCart: () => Promise<void>;

//   addToCart: (
//     product: AddToCartProduct,
//     quantity?: number,
//   ) => Promise<void>;

//   updateQuantity: (
//     cartId: string,
//     quantity: number,
//   ) => Promise<void>;

//   increaseQuantity: (
//     cartId: string,
//   ) => Promise<void>;

//   decreaseQuantity: (
//     cartId: string,
//   ) => Promise<void>;

//   removeFromCart: (
//     cartId: string,
//   ) => Promise<void>;

//   clearCart: () => Promise<void>;

//   validateCart: () => Promise<boolean>;

//   isInCart: (
//     productId: string,
//     storage: string,
//     color: string,
//   ) => boolean;
// };

// /* =========================================================
//    HELPERS
// ========================================================= */

// function toNumber(
//   value: number | string | null | undefined,
// ): number {
//   if (typeof value === "number") {
//     return Number.isFinite(value) ? value : 0;
//   }

//   if (typeof value === "string") {
//     const parsed = Number(value);

//     return Number.isFinite(parsed)
//       ? parsed
//       : 0;
//   }

//   return 0;
// }

// function getErrorMessage(
//   error: unknown,
//   fallback: string,
// ): string {
//   if (error instanceof Error) {
//     return error.message;
//   }

//   return fallback;
// }

// /* =========================================================
//    CONTEXT
// ========================================================= */

// const CartContext =
//   createContext<CartContextType | undefined>(
//     undefined,
//   );

// /* =========================================================
//    PROVIDER
// ========================================================= */

// export function CartProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [cartItems, setCartItems] =
//     useState<CartItem[]>([]);

//   const [loading, setLoading] =
//     useState(true);

//   const [syncing, setSyncing] =
//     useState(false);

//   const [error, setError] =
//     useState<string | null>(null);

//   /* =======================================================
//      NORMALIZE API CART
//   ======================================================= */

//   const normalizeCart = useCallback(
//     (cart: CartResponse): CartItem[] => {
//       if (!cart?.items) {
//         return [];
//       }

//       return cart.items.map((item) => {
//         const product = item.product;
//         const variant = item.variant;

//         /*
//          * api.ts currently types variant.image as unknown.
//          *
//          * The backend may return:
//          * { id, url, altText }
//          */
//         const variantImage =
//           variant?.image &&
//           typeof variant.image === "object" &&
//           "url" in variant.image &&
//           typeof (
//             variant.image as {
//               url?: unknown;
//             }
//           ).url === "string"
//             ? (
//                 variant.image as {
//                   url: string;
//                 }
//               ).url
//             : "";

//         const productImage =
//           typeof product.image === "string"
//             ? product.image
//             : "";

//         return {
//           cartId: item.id,

//           id: String(item.productId),

//           variantId:
//             item.variantId ?? null,

//           name:
//             product.name || "Unknown product",

//           brand:
//             product.brand || "",

//           category:
//             product.category || "",

//           storage:
//             variant?.storage || "",

//           color:
//             variant?.color || "",

//           condition:
//             product.condition || "",

//           price:
//             toNumber(item.unitPrice),

//           originalPrice:
//             toNumber(
//               variant?.originalPrice ??
//                 product.originalPrice,
//             ),

//           warranty:
//             product.warranty || "",

//           image:
//             variantImage ||
//             productImage,

//           quantity:
//             Math.max(
//               1,
//               Number(item.quantity) || 1,
//             ),

//           stock:
//             typeof variant?.stock === "number"
//               ? variant.stock
//               : 0,
//         };
//       });
//     },
//     [],
//   );

//   /* =======================================================
//      REFRESH CART
//   ======================================================= */

//   const refreshCart =
//     useCallback(async () => {
//       try {
//         setError(null);

//         const response =
//           await getCart();

//         /*
//          * A logged-out user may receive 401.
//          *
//          * The cart should simply appear empty.
//          * We do NOT throw another error here.
//          */
//         if (
//           !response.success ||
//           !response.data
//         ) {
//           setCartItems([]);

//           if (response.message) {
//             /*
//              * Don't display authentication errors
//              * during initial guest browsing.
//              */
//             if (
//               !response.message
//                 .toLowerCase()
//                 .includes("sign in") &&
//               !response.message
//                 .toLowerCase()
//                 .includes("unauthorized")
//             ) {
//               setError(response.message);
//             }
//           }

//           return;
//         }

//         setCartItems(
//           normalizeCart(response.data),
//         );
//       } catch (requestError) {
//         console.error(
//           "Failed to load cart:",
//           requestError,
//         );

//         /*
//          * A logged-out user should still be able
//          * to browse the website.
//          */
//         setCartItems([]);

//         const message =
//           getErrorMessage(
//             requestError,
//             "",
//           );

//         if (
//           message &&
//           !message
//             .toLowerCase()
//             .includes("sign in") &&
//           !message
//             .toLowerCase()
//             .includes("unauthorized")
//         ) {
//           setError(message);
//         }
//       } finally {
//         setLoading(false);
//       }
//     }, [normalizeCart]);

//   /* =======================================================
//      INITIAL CART LOAD
//   ======================================================= */

//   useEffect(() => {
//     void refreshCart();
//   }, [refreshCart]);

//   /* =======================================================
//      ADD TO CART
//   ======================================================= */

//   const addToCart =
//     useCallback(
//       async (
//         product: AddToCartProduct,
//         quantity = 1,
//       ) => {
//         const safeQuantity =
//           Math.min(
//             99,
//             Math.max(
//               1,
//               Math.floor(quantity),
//             ),
//           );

//         try {
//           setSyncing(true);
//           setError(null);

//           const response =
//             await addCartItem({
//               productId:
//                 String(product.id),

//               variantId:
//                 product.variantId ??
//                 undefined,

//               quantity:
//                 safeQuantity,
//             });

//           if (
//             !response.success ||
//             !response.data
//           ) {
//             throw new Error(
//               response.message ||
//                 "Unable to add item to cart.",
//             );
//           }

//           setCartItems(
//             normalizeCart(
//               response.data,
//             ),
//           );
//         } catch (requestError) {
//           console.error(
//             "Failed to add item to cart:",
//             requestError,
//           );

//           const message =
//             getErrorMessage(
//               requestError,
//               "Unable to add item to cart.",
//             );

//           setError(message);

//           /*
//            * IMPORTANT:
//            *
//            * Do NOT throw the error again.
//            *
//            * The old implementation did:
//            *
//            * setError(message);
//            * throw new Error(message);
//            *
//            * That caused:
//            * "unhandledRejection"
//            *
//            * The UI already receives the error through
//            * the context's `error` state.
//            */
//         } finally {
//           setSyncing(false);
//         }
//       },
//       [normalizeCart],
//     );

//   /* =======================================================
//      UPDATE QUANTITY
//   ======================================================= */

//   const updateQuantity =
//     useCallback(
//       async (
//         cartId: string,
//         quantity: number,
//       ) => {
//         const safeQuantity =
//           Math.min(
//             99,
//             Math.max(
//               1,
//               Math.floor(quantity),
//             ),
//           );

//         try {
//           setSyncing(true);
//           setError(null);

//           const response =
//             await updateCartItem(
//               cartId,
//               safeQuantity,
//             );

//           if (
//             !response.success ||
//             !response.data
//           ) {
//             throw new Error(
//               response.message ||
//                 "Unable to update quantity.",
//             );
//           }

//           setCartItems(
//             normalizeCart(
//               response.data,
//             ),
//           );
//         } catch (requestError) {
//           console.error(
//             "Failed to update cart quantity:",
//             requestError,
//           );

//           const message =
//             getErrorMessage(
//               requestError,
//               "Unable to update quantity.",
//             );

//           setError(message);

//           /*
//            * Re-sync with backend.
//            */
//           await refreshCart();
//         } finally {
//           setSyncing(false);
//         }
//       },
//       [
//         normalizeCart,
//         refreshCart,
//       ],
//     );

//   /* =======================================================
//      INCREASE QUANTITY
//   ======================================================= */

//   const increaseQuantity =
//     useCallback(
//       async (cartId: string) => {
//         const item =
//           cartItems.find(
//             (cartItem) =>
//               cartItem.cartId ===
//               cartId,
//           );

//         if (!item) {
//           return;
//         }

//         if (
//           item.stock > 0 &&
//           item.quantity >= item.stock
//         ) {
//           setError(
//             `Only ${item.stock} item(s) are currently available.`,
//           );

//           return;
//         }

//         await updateQuantity(
//           cartId,
//           item.quantity + 1,
//         );
//       },
//       [
//         cartItems,
//         updateQuantity,
//       ],
//     );

//   /* =======================================================
//      DECREASE QUANTITY
//   ======================================================= */

//   const decreaseQuantity =
//     useCallback(
//       async (cartId: string) => {
//         const item =
//           cartItems.find(
//             (cartItem) =>
//               cartItem.cartId ===
//               cartId,
//           );

//         if (!item) {
//           return;
//         }

//         if (item.quantity <= 1) {
//           await removeFromCart(
//             cartId,
//           );

//           return;
//         }

//         await updateQuantity(
//           cartId,
//           item.quantity - 1,
//         );
//       },
//       [
//         cartItems,
//         updateQuantity,
//       ],
//     );

//   /* =======================================================
//      REMOVE FROM CART
//   ======================================================= */

//   const removeFromCart =
//     useCallback(
//       async (cartId: string) => {
//         try {
//           setSyncing(true);
//           setError(null);

//           const response =
//             await deleteCartItem(
//               cartId,
//             );

//           if (
//             !response.success ||
//             !response.data
//           ) {
//             throw new Error(
//               response.message ||
//                 "Unable to remove item.",
//             );
//           }

//           setCartItems(
//             normalizeCart(
//               response.data,
//             ),
//           );
//         } catch (requestError) {
//           console.error(
//             "Failed to remove cart item:",
//             requestError,
//           );

//           setError(
//             getErrorMessage(
//               requestError,
//               "Unable to remove item.",
//             ),
//           );

//           await refreshCart();
//         } finally {
//           setSyncing(false);
//         }
//       },
//       [
//         normalizeCart,
//         refreshCart,
//       ],
//     );

//   /* =======================================================
//      CLEAR CART
//   ======================================================= */

//   const clearCart =
//     useCallback(async () => {
//       try {
//         setSyncing(true);
//         setError(null);

//         const response =
//           await clearCartApi();

//         if (
//           !response.success ||
//           !response.data
//         ) {
//           throw new Error(
//             response.message ||
//               "Unable to clear cart.",
//           );
//         }

//         setCartItems(
//           normalizeCart(
//             response.data,
//           ),
//         );
//       } catch (requestError) {
//         console.error(
//           "Failed to clear cart:",
//           requestError,
//         );

//         setError(
//           getErrorMessage(
//             requestError,
//             "Unable to clear cart.",
//           ),
//         );

//         await refreshCart();
//       } finally {
//         setSyncing(false);
//       }
//     }, [
//       normalizeCart,
//       refreshCart,
//     ]);

//   /* =======================================================
//      VALIDATE CART
//   ======================================================= */

//   const validateCart =
//     useCallback(async () => {
//       try {
//         setSyncing(true);
//         setError(null);

//         const response =
//           await validateCartApi();

//         if (
//           !response.success ||
//           !response.data
//         ) {
//           throw new Error(
//             response.message ||
//               "Unable to validate cart.",
//           );
//         }

//         setCartItems(
//           normalizeCart(
//             response.data.cart,
//           ),
//         );

//         if (
//           !response.data.valid
//         ) {
//           const firstIssue =
//             response.data
//               .issues?.[0];

//           setError(
//             firstIssue?.message ||
//               "Please review your cart before checkout.",
//           );

//           return false;
//         }

//         return true;
//       } catch (requestError) {
//         console.error(
//           "Failed to validate cart:",
//           requestError,
//         );

//         setError(
//           getErrorMessage(
//             requestError,
//             "Unable to validate cart.",
//           ),
//         );

//         return false;
//       } finally {
//         setSyncing(false);
//       }
//     }, [normalizeCart]);

//   /* =======================================================
//      CHECK IF PRODUCT / VARIANT IS IN CART
//   ======================================================= */

//   const isInCart =
//     useCallback(
//       (
//         productId: string,
//         storage: string,
//         color: string,
//       ) => {
//         return cartItems.some(
//           (item) =>
//             item.id ===
//               String(productId) &&
//             item.storage ===
//               storage &&
//             item.color ===
//               color,
//         );
//       },
//       [cartItems],
//     );

//   /* =======================================================
//      CART COUNT
//   ======================================================= */

//   const cartCount =
//     useMemo(
//       () =>
//         cartItems.reduce(
//           (total, item) =>
//             total + item.quantity,
//           0,
//         ),
//       [cartItems],
//     );

//   /* =======================================================
//      SUBTOTAL
//   ======================================================= */

//   const subtotal =
//     useMemo(
//       () =>
//         cartItems.reduce(
//           (total, item) =>
//             total +
//             item.price *
//               item.quantity,
//           0,
//         ),
//       [cartItems],
//     );

//   /* =======================================================
//      ORIGINAL TOTAL
//   ======================================================= */

//   const originalTotal =
//     useMemo(
//       () =>
//         cartItems.reduce(
//           (total, item) =>
//             total +
//             item.originalPrice *
//               item.quantity,
//           0,
//         ),
//       [cartItems],
//     );

//   /* =======================================================
//      SAVINGS
//   ======================================================= */

//   const savings =
//     useMemo(
//       () =>
//         Math.max(
//           0,
//           originalTotal -
//             subtotal,
//         ),
//       [
//         originalTotal,
//         subtotal,
//       ],
//     );

//   /* =======================================================
//      TOTAL
//   ======================================================= */

//   const total = subtotal;

//   /* =======================================================
//      CONTEXT VALUE
//   ======================================================= */

//   const value =
//     useMemo<CartContextType>(
//       () => ({
//         cartItems,

//         cartCount,
//         subtotal,
//         originalTotal,
//         savings,
//         total,

//         loading,
//         syncing,
//         error,

//         refreshCart,

//         addToCart,

//         updateQuantity,

//         increaseQuantity,

//         decreaseQuantity,

//         removeFromCart,

//         clearCart,

//         validateCart,

//         isInCart,
//       }),
//       [
//         cartItems,

//         cartCount,
//         subtotal,
//         originalTotal,
//         savings,
//         total,

//         loading,
//         syncing,
//         error,

//         refreshCart,

//         addToCart,

//         updateQuantity,

//         increaseQuantity,

//         decreaseQuantity,

//         removeFromCart,

//         clearCart,

//         validateCart,

//         isInCart,
//       ],
//     );

//   return (
//     <CartContext.Provider
//       value={value}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }

// /* =========================================================
//    HOOK
// ========================================================= */

// export function useCart(): CartContextType {
//   const context =
//     useContext(CartContext);

//   if (!context) {
//     throw new Error(
//       "useCart must be used inside CartProvider",
//     );
//   }

//   return context;
// }



"use client";

import {
createContext,
useCallback,
useContext,
useEffect,
useMemo,
useState,
} from "react";

import {
addCartItem,
clearCartApi,
deleteCartItem,
getCart,
updateCartItem,
validateCart as validateCartApi,
type CartResponse,
} from "@/app/lib/api";

import { useAuth } from "@/app/context/AuthContext";

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

type AddToCartProduct = {
id: string | number;
variantId?: number | null;

name: string;
brand?: string;
category?: string;

storage?: string;
color?: string;
condition?: string;

price?: number;
originalPrice?: number;

warranty?: string;
image?: string;
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

function getErrorMessage(
error: unknown,
fallback: string,
): string {
if (error instanceof Error) {
return error.message;
}

return fallback;
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
const {
user,
loading: authLoading,
isAuthenticated,
} = useAuth();

const [cartItems, setCartItems] =
useState<CartItem[]>([]);

const [loading, setLoading] =
useState(true);

const [syncing, setSyncing] =
useState(false);

const [error, setError] =
useState<string | null>(null);

/* =======================================================
NORMALIZE API CART
======================================================= */

const normalizeCart = useCallback(
(cart: CartResponse): CartItem[] => {
if (!cart?.items) {
return [];
}
  return cart.items.map((item) => {
    const product = item.product;
    const variant = item.variant;

    const variantImage =
      variant?.image &&
      typeof variant.image === "object" &&
      "url" in variant.image &&
      typeof (
        variant.image as {
          url?: unknown;
        }
      ).url === "string"
        ? (
            variant.image as {
              url: string;
            }
          ).url
        : "";

    const productImage =
      typeof product.image === "string"
        ? product.image
        : "";

    return {
      cartId: item.id,

      id: String(item.productId),

      variantId:
        item.variantId ?? null,

      name:
        product.name || "Unknown product",

      brand:
        product.brand || "",

      category:
        product.category || "",

      storage:
        variant?.storage || "",

      color:
        variant?.color || "",

      condition:
        product.condition || "",

      price:
        toNumber(item.unitPrice),

      originalPrice:
        toNumber(
          variant?.originalPrice ??
            product.originalPrice,
        ),

      warranty:
        product.warranty || "",

      image:
        variantImage ||
        productImage,

      quantity:
        Math.max(
          1,
          Number(item.quantity) || 1,
        ),

      stock:
        typeof variant?.stock === "number"
          ? variant.stock
          : 0,
    };
  });
},
[],

);

/* =======================================================
REFRESH CART
======================================================= */

const refreshCart =
useCallback(async () => {
/*
* Wait until AuthProvider finishes checking
* whether the user has an active session.
*/
if (authLoading) {
return;
}
  /*
   * Guest users do not have a server-side cart.
   *
   * IMPORTANT:
   * Do NOT call GET /cart for guests.
   *
   * This prevents:
   * ApiError: Authentication required
   */
  if (!isAuthenticated || !user) {
    setCartItems([]);
    setError(null);
    setLoading(false);
    return;
  }

  try {
    setLoading(true);
    setError(null);

    const response =
      await getCart();

    if (
      !response.success ||
      !response.data
    ) {
      setCartItems([]);

      if (response.message) {
        setError(response.message);
      }

      return;
    }

    setCartItems(
      normalizeCart(response.data),
    );
  } catch (requestError) {
    console.error(
      "Failed to load cart:",
      requestError,
    );

    setCartItems([]);

    setError(
      getErrorMessage(
        requestError,
        "Unable to load cart.",
      ),
    );
  } finally {
    setLoading(false);
  }
}, [
  authLoading,
  isAuthenticated,
  user,
  normalizeCart,
]);

/* =======================================================
AUTH-DEPENDENT CART LOAD
======================================================= */

useEffect(() => {
if (authLoading) {
return;
}
void refreshCart();

}, [
authLoading,
isAuthenticated,
user?.id,
refreshCart,
]);

/* =======================================================
CLEAR LOCAL CART WHEN USER LOGS OUT
======================================================= */

useEffect(() => {
if (
!authLoading &&
!isAuthenticated
) {
setCartItems([]);
setError(null);
setLoading(false);
}
}, [
authLoading,
isAuthenticated,
]);

/* =======================================================
ADD TO CART
======================================================= */

const addToCart =
useCallback(
async (
product: AddToCartProduct,
quantity = 1,
) => {
if (!isAuthenticated) {
setError(
"Please sign in to add items to your cart.",
);
      return;
    }

    const safeQuantity =
      Math.min(
        99,
        Math.max(
          1,
          Math.floor(quantity),
        ),
      );

    try {
      setSyncing(true);
      setError(null);

      const response =
        await addCartItem({
          productId:
            String(product.id),

          variantId:
            product.variantId ??
            undefined,

          quantity:
            safeQuantity,
        });

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

      setError(
        getErrorMessage(
          requestError,
          "Unable to add item to cart.",
        ),
      );
    } finally {
      setSyncing(false);
    }
  },
  [
    isAuthenticated,
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
if (!isAuthenticated) {
setError(
"Please sign in to manage your cart.",
);
      return;
    }

    const safeQuantity =
      Math.min(
        99,
        Math.max(
          1,
          Math.floor(quantity),
        ),
      );

    try {
      setSyncing(true);
      setError(null);

      const response =
        await updateCartItem(
          cartId,
          safeQuantity,
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

      setError(
        getErrorMessage(
          requestError,
          "Unable to update quantity.",
        ),
      );

      /*
       * Re-sync with backend after failure.
       */
      await refreshCart();
    } finally {
      setSyncing(false);
    }
  },
  [
    isAuthenticated,
    normalizeCart,
    refreshCart,
  ],
);
/* =======================================================
INCREASE QUANTITY
======================================================= */

const increaseQuantity =
useCallback(
async (cartId: string) => {
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
async (cartId: string) => {
const item =
cartItems.find(
(cartItem) =>
cartItem.cartId ===
cartId,
);
    if (!item) {
      return;
    }

    if (item.quantity <= 1) {
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
REMOVE FROM CART
======================================================= */

const removeFromCart =
useCallback(
async (cartId: string) => {
if (!isAuthenticated) {
setError(
"Please sign in to manage your cart.",
);
      return;
    }

    try {
      setSyncing(true);
      setError(null);

      const response =
        await deleteCartItem(
          cartId,
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

      setError(
        getErrorMessage(
          requestError,
          "Unable to remove item.",
        ),
      );

      await refreshCart();
    } finally {
      setSyncing(false);
    }
  },
  [
    isAuthenticated,
    normalizeCart,
    refreshCart,
  ],
);
/* =======================================================
CLEAR CART
======================================================= */

const clearCart =
useCallback(async () => {
if (!isAuthenticated) {
setCartItems([]);
return;
}
  try {
    setSyncing(true);
    setError(null);

    const response =
      await clearCartApi();

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

    setError(
      getErrorMessage(
        requestError,
        "Unable to clear cart.",
      ),
    );

    await refreshCart();
  } finally {
    setSyncing(false);
  }
}, [
  isAuthenticated,
  normalizeCart,
  refreshCart,
]);
/* =======================================================
VALIDATE CART
======================================================= */

const validateCart =
useCallback(async () => {
if (!isAuthenticated) {
setError(
"Please sign in before checkout.",
);
    return false;
  }

  try {
    setSyncing(true);
    setError(null);

    const response =
      await validateCartApi();

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
          .issues?.[0];

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

    setError(
      getErrorMessage(
        requestError,
        "Unable to validate cart.",
      ),
    );

    return false;
  } finally {
    setSyncing(false);
  }
}, [
  isAuthenticated,
  normalizeCart,
]);
/* =======================================================
CHECK IF PRODUCT / VARIANT IS IN CART
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
String(productId) &&
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
total + item.quantity,
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
useMemo<CartContextType>(
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

export function useCart(): CartContextType {
const context =
useContext(CartContext);

if (!context) {
throw new Error(
"useCart must be used inside CartProvider",
);
}

return context;
}
