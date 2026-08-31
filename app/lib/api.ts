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

export interface ProductPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ProductListResponse {
  products: Product[];
  pagination: ProductPagination;
}

export async function getProducts(params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
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

  if (params?.category) {
    searchParams.set("category", params.category);
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

  const response = await apiRequest<Product[]>(
    `/products${query ? `?${query}` : ""}`,
    {
      method: "GET",
    },
  );

  const raw = response as ApiResponse<Product[]> & {
    products?: Product[];
    pagination?: ProductPagination;
  };

  return {
    ...response,
    data: raw.data ?? raw.products ?? [],
    pagination: raw.pagination,
  };
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
/* =========================================================
   PAYMENTS
========================================================= */

export interface CreatePaymentOrderResponse {
  orderId: string;
  orderNumber: string;
  razorpayOrderId: string;
  amount: number;
  amountInPaise: number;
  currency: string;
  keyId: string;
}

export interface VerifyPaymentPayload {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  alreadyProcessed: boolean;
  orderId: string;
  paymentId: string;
  razorpayPaymentId?: string | null;
  status?: string;
}

export async function createPaymentOrder(orderId: string) {
  return apiRequest<CreatePaymentOrderResponse>(
    `/payments/orders/${encodeURIComponent(orderId)}`,
    {
      method: "POST",
    },
  );
}

export async function verifyPayment(
  orderId: string,
  payload: VerifyPaymentPayload,
) {
  return apiRequest<VerifyPaymentResponse>(
    `/payments/orders/${encodeURIComponent(orderId)}/verify`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
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

export async function addCartItem(payload: AddCartItemPayload) {
  return apiRequest<CartResponse>("/cart/items", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateCartItem(itemId: string, quantity: number) {
  return apiRequest<CartResponse>(`/cart/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({
      quantity,
    }),
  });
}

export async function deleteCartItem(itemId: string) {
  return apiRequest<CartResponse>(`/cart/items/${itemId}`, {
    method: "DELETE",
  });
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
  return apiRequest<{ wishlisted: boolean }>(`/wishlist/${productId}/check`, {
    method: "GET",
  });
}

/* =========================================================
   SELL
========================================================= */

export interface SellRequestMediaPayload {
  url: string;
  key: string;
  mimeType: string;
  size: number;
  position: number;
}

export interface CreateSellRequestPayload {
  productId: number;

  workingStatus: string;
  screenCondition: string;
  deviceCondition: string;
  batteryCondition: string;

  pickupAddress: string;
  pickupDate: string;
  pickupSlot: string;

  media?: SellRequestMediaPayload[];
}

export interface SellRequestProduct {
  id: number;
  name: string;
  brand: string;
  price: number;
  images?: Array<{
    id: number;
    url: string;
    altText?: string | null;
    position: number;
  }>;
}

export interface SellRequestResponse {
  id: string;
  userId: string;
  productId: number;

  workingStatus: string;
  screenCondition: string;
  deviceCondition: string;
  batteryCondition: string;

  estimatedValue: number;
  finalValue?: number | null;

  pickupAddress: string;
  pickupDate: string;
  pickupSlot: string;

  status: string;

  product: SellRequestProduct;

  media: SellRequestMediaPayload[];

  createdAt: string;
  updatedAt: string;
}

export interface SellRequestDetailsResponse {
  id: string;

  product: {
    id: number;
    name: string;
    brand: string;

    images: Array<{
      id: number;
      url: string;
      altText?: string | null;
      position: number;
    }>;
  };

  conditions: {
    workingStatus: string;
    screenCondition: string;
    deviceCondition: string;
    batteryCondition: string;
  };

  valuation: {
    estimatedValue: number;
    finalValue: number | null;
  };

  pickup: {
    address: string;
    date: string;
    slot: string;
  };

  status: string;

  media: Array<{
    id: string;
    url: string;
    key: string;
    mimeType: string;
    size: number;
    position: number;
    createdAt: string;
  }>;

  payment: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    method: string;
    razorpayPaymentId: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;

  createdAt: string;
  updatedAt: string;
}
export async function createSellRequest(payload: CreateSellRequestPayload) {
  return apiRequest<SellRequestResponse>("/sell/requests", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
export async function getSellRequest(sellRequestId: string) {
  return apiRequest<SellRequestDetailsResponse>(
    `/sell/requests/${encodeURIComponent(sellRequestId)}`,
    {
      method: "GET",
    },
  );
}
export interface SellCatalogModel {
  id: number;
  name: string;
}

export interface SellCatalogBrand {
  name: string;
  models: SellCatalogModel[];
}

export interface SellCatalog {
  category: string;
  brands: SellCatalogBrand[];
}

export async function getSellCatalog() {
  return apiRequest<SellCatalog>("/sell/catalog", {
    method: "GET",
  });
}
export interface VerifyPhonePayload {
  phone: string;
  code: string;
}

export async function sendPhoneOtp(phone: string) {
  return apiRequest("/auth/phone/send-otp", {
    method: "POST",
    body: JSON.stringify({
      phone,
    }),
  });
}

export async function verifyPhoneOtp(payload: VerifyPhonePayload) {
  return apiRequest<LoginResponse>("/auth/phone/verify", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function forgotPassword(phone: string) {
  return apiRequest("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({
      phone,
    }),
  });
}

export async function resetPassword(payload: {
  phone: string;
  code: string;
  newPassword: string;
}) {
  return apiRequest("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
/* =========================================================
   SELL PAYMENTS
========================================================= */

export type SellPaymentMethod = "UPI" | "CARD";

export interface CreateSellPaymentOrderResponse {
  sellRequestId: string;
  sellPaymentId: string;
  razorpayOrderId: string;
  amount: number;
  amountInPaise: number;
  currency: string;
  keyId: string;
  method: SellPaymentMethod;
}

export interface VerifySellPaymentPayload {
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature: string;
}

export interface VerifySellPaymentResponse {
  success: boolean;
  alreadyProcessed: boolean;
  sellRequestId: string;
  sellPaymentId: string;
  razorpayPaymentId?: string | null;
  status: string;
}

export interface SellPaymentStatusResponse {
  sellRequestId: string;
  sellRequestStatus: string;

  estimatedValue: number;
  finalValue: number | null;

  pickupAddress: string;
  pickupDate: string;
  pickupSlot: string;

  product: {
    id: number;
    name: string;
    brand: string;
    image: string | null;
  };

  payment: {
    id: string;
    amount: number;
    currency: string;
    status: string;
    method: string;
    razorpayPaymentId: string | null;
    createdAt: string;
  } | null;
}

/**
 * Create/reuse Razorpay order for a sell pickup fee.
 */
export async function createSellPaymentOrder(
  sellRequestId: string,
  method: SellPaymentMethod,
) {
  return apiRequest<CreateSellPaymentOrderResponse>(
    `/sell/payments/${encodeURIComponent(sellRequestId)}`,
    {
      method: "POST",
      body: JSON.stringify({
        method,
      }),
    },
  );
}

/**
 * Verify Razorpay payment for a sell request.
 *
 * The backend performs the actual signature/payment verification.
 */
export async function verifySellPayment(
  sellRequestId: string,
  payload: VerifySellPaymentPayload,
) {
  return apiRequest<VerifySellPaymentResponse>(
    `/sell/payments/${encodeURIComponent(sellRequestId)}/verify`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

/**
 * Get the current payment/request state.
 *
 * Used by sell payment success/failure pages.
 */
export async function getSellPaymentStatus(sellRequestId: string) {
  return apiRequest<SellPaymentStatusResponse>(
    `/sell/payments/${encodeURIComponent(sellRequestId)}/status`,
    {
      method: "GET",
    },
  );
}
