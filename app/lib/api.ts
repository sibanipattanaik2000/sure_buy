const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
};

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
    cache: "no-store",
  });

  let result: ApiResponse<T> | null = null;

  try {
    result = (await response.json()) as ApiResponse<T>;
  } catch {
    result = null;
  }

  if (!response.ok) {
    throw new ApiError(
      result?.message || "Something went wrong",
      response.status,
      result,
    );
  }

  return (
    result || {
      success: true,
    }
  );
}

/* =========================================================
   AUTH
========================================================= */

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role?: string;
  avatar?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginResponse {
  user: User;
}

export async function registerUser(payload: RegisterPayload) {
  return apiRequest<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: LoginPayload) {
  return apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getCurrentUser() {
  return apiRequest<User>("/auth/me", {
    method: "GET",
  });
}

export async function logoutUser() {
  return apiRequest("/auth/logout", {
    method: "POST",
  });
}

/* =========================================================
   PROFILE
========================================================= */

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export async function updateProfile(payload: UpdateProfilePayload) {
  return apiRequest<User>("/auth/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

/* =========================================================
   ADDRESS
========================================================= */

export interface Address {
  id: string;
  fullName: string;
  phone: string;

  addressLine1: string;
  addressLine2?: string;

  city: string;
  state: string;

  postalCode: string;

  landmark?: string;
  isDefault?: boolean;
}

export interface CreateAddressPayload {
  fullName: string;
  phone: string;

  addressLine1: string;
  addressLine2?: string;

  city: string;
  state: string;

  postalCode: string;

  landmark?: string;
  isDefault?: boolean;
}

export interface UpdateAddressPayload {
  fullName?: string;
  phone?: string;

  addressLine1?: string;
  addressLine2?: string;

  city?: string;
  state?: string;

  postalCode?: string;

  landmark?: string;
  isDefault?: boolean;
}

export async function getAddresses() {
  return apiRequest<Address[]>("/addresses", {
    method: "GET",
  });
}

export async function createAddress(payload: CreateAddressPayload) {
  return apiRequest<Address>("/addresses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAddress(id: string, payload: UpdateAddressPayload) {
  return apiRequest<Address>(`/addresses/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteAddress(id: string) {
  return apiRequest(`/addresses/${id}`, {
    method: "DELETE",
  });
}
/* =========================================================
   PRODUCTS
========================================================= */
export interface Product {
  id: number;
  name: string;

  brand?: string;
  model?: string;
  category?: string;

  price: number;
  originalPrice?: number;

  image?: string;
  images?: string[];

  condition?: string;
  storage?: string;
  color?: string;

  warranty?: string;

  rating?: number;
  reviewCount?: number;

  stock?: number;
}

export async function getProducts(params?: {
  page?: number;
  limit?: number;
  search?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
}) {
  const searchParams = new URLSearchParams();

  if (params?.page) {
    searchParams.set("page", String(params.page));
  }

  if (params?.limit) {
    searchParams.set("limit", String(params.limit));
  }

  if (params?.search) {
    searchParams.set("search", params.search);
  }

  if (params?.brand) {
    searchParams.set("brand", params.brand);
  }

  if (params?.minPrice !== undefined) {
    searchParams.set("minPrice", String(params.minPrice));
  }

  if (params?.maxPrice !== undefined) {
    searchParams.set("maxPrice", String(params.maxPrice));
  }

  const query = searchParams.toString();

  return apiRequest<Product[]>(`/products${query ? `?${query}` : ""}`, {
    method: "GET",
  });
}

export async function getProduct<T = Product>(id: string) {
  return apiRequest<T>(`/products/${id}`, {
    method: "GET",
  });
}

/* =========================================================
   ORDERS
========================================================= */

export interface OrderItem {
  id: string;
  productId: number;
  variantId?: number | null;

  productName: string;
  brand?: string;
  category?: string;
  condition?: string;

  storage?: string | null;
  color?: string | null;

  imageUrl?: string | null;

  unitPrice: number;
  originalPrice: number;
  quantity: number;
  subtotal: number;

  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;

  status: string;
  paymentStatus: string;
  paymentMethod: "COD" | "UPI" | "CARD" | "EMI";

  subtotal: number;
  deliveryAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;

  items: OrderItem[];

  shippingAddress?: Address;

  createdAt: string;
  updatedAt?: string;
}

export async function getOrders() {
  return apiRequest<Order[]>("/orders", {
    method: "GET",
  });
}

export async function getOrder(id: string) {
  return apiRequest<Order>(`/orders/${id}`, {
    method: "GET",
  });
}

export async function createOrder(payload: {
  addressId: string;
  paymentMethod: "COD" | "UPI" | "CARD" | "EMI";
}) {
  return apiRequest<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function cancelOrder(id: string) {
  return apiRequest<Order>(`/orders/${id}/cancel`, {
    method: "PATCH",
  });
}


/* =========================================================
   CART
========================================================= */

export interface CartItemResponse {
  id: string;
  productId: string;
  variantId?: number | null;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  product: Product;
  variant?: {
    id: number;
    storage?: string | null;
    color?: string | null;
    price: number;
    originalPrice: number;
    stock: number;
    image?: unknown;
  } | null;
}

export interface CartResponse {
  id: string;
  userId: string;
  items: CartItemResponse[];
  summary: {
    itemCount: number;
    totalQuantity: number;
    subtotal: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AddCartItemPayload {
  productId: string;
  variantId?: number;
  quantity: number;
}

export async function getCart() {
  return apiRequest<CartResponse>("/cart", {
    method: "GET",
  });
}

export async function addCartItem(
  payload: AddCartItemPayload,
) {
  return apiRequest<CartResponse>("/cart/items", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateCartItem(
  itemId: string,
  quantity: number,
) {
  return apiRequest<CartResponse>(
    `/cart/items/${itemId}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        quantity,
      }),
    },
  );
}

export async function deleteCartItem(
  itemId: string,
) {
  return apiRequest<CartResponse>(
    `/cart/items/${itemId}`,
    {
      method: "DELETE",
    },
  );
}

export async function clearCartApi() {
  return apiRequest<CartResponse>("/cart", {
    method: "DELETE",
  });
}

export async function validateCart() {
  return apiRequest<{
    valid: boolean;
    issues: Array<{
      itemId: string;
      code: string;
      message: string;
    }>;
    cart: CartResponse;
  }>("/cart/validate", {
    method: "POST",
  });
}


/* =========================================================
   WISHLIST
========================================================= */

export interface WishlistItem {
  id: string;
  productId: number;
  slug: string;
  name: string;
  brand: string;
  category: string;
  condition: string;
  price: number;
  originalPrice: number;
  warranty: string;
  rating: number;
  reviewCount: number;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function getWishlist() {
  return apiRequest<WishlistItem[]>("/wishlist", {
    method: "GET",
  });
}

export async function addWishlistItem(productId: number) {
  return apiRequest<WishlistItem>("/wishlist", {
    method: "POST",
    body: JSON.stringify({
      productId,
    }),
  });
}

export async function removeWishlistItem(productId: number) {
  return apiRequest(`/wishlist/${productId}`, {
    method: "DELETE",
  });
}

export async function clearWishlistApi() {
  return apiRequest("/wishlist", {
    method: "DELETE",
  });
}

export async function checkWishlist(productId: number) {
  return apiRequest<{ wishlisted: boolean }>(
    `/wishlist/${productId}/check`,
    {
      method: "GET",
    },
  );
}