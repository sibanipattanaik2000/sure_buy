// app/lib/api.ts

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
};

class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("surebuy_token")
      : null;

  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
    cache: "no-store",
  });

  let result: ApiResponse<T> | null = null;

  try {
    result = await response.json();
  } catch {
    result = null;
  }

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("surebuy_token");
      localStorage.removeItem("surebuy_user");
    }

    throw new ApiError(
      result?.message || "Something went wrong",
      response.status,
      result
    );
  }

  return result || { success: true };
}

/* =========================
   AUTH TYPES
========================= */

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

/* =========================
   AUTH API
========================= */

export async function registerUser(payload: RegisterPayload) {
  return request<User>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function loginUser(payload: LoginPayload) {
  return request<User>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getCurrentUser() {
  return request<User>("/auth/me", {
    method: "GET",
  });
}

export async function logoutUser() {
  try {
    return await request("/auth/logout", {
      method: "POST",
    });
  } finally {
    if (typeof window !== "undefined") {
      localStorage.removeItem("surebuy_token");
      localStorage.removeItem("surebuy_user");
    }
  }
}

/* =========================
   USER / PROFILE
========================= */

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export async function updateProfile(payload: UpdateProfilePayload) {
  return request<User>("/users/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

/* =========================
   ADDRESS
========================= */

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault?: boolean;
}

export async function getAddresses() {
  return request<Address[]>("/addresses", {
    method: "GET",
  });
}

export async function createAddress(
  payload: Omit<Address, "id">
) {
  return request<Address>("/addresses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAddress(
  id: string,
  payload: Partial<Address>
) {
  return request<Address>(`/addresses/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteAddress(id: string) {
  return request(`/addresses/${id}`, {
    method: "DELETE",
  });
}

/* =========================
   PRODUCTS
========================= */

export interface Product {
  id: string;
  name: string;
  brand?: string;
  model?: string;
  price: number;
  originalPrice?: number;
  image?: string;
  images?: string[];
  condition?: string;
  storage?: string;
  color?: string;
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

  return request<Product[]>(
    `/products${query ? `?${query}` : ""}`,
    {
      method: "GET",
    }
  );
}

export async function getProduct(id: string) {
  return request<Product>(`/products/${id}`, {
    method: "GET",
  });
}

/* =========================
   ORDERS
========================= */

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  image?: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber?: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
  createdAt: string;
  shippingAddress?: Address;
}

export async function getOrders() {
  return request<Order[]>("/orders", {
    method: "GET",
  });
}

export async function getOrder(id: string) {
  return request<Order>(`/orders/${id}`, {
    method: "GET",
  });
}

export async function createOrder(payload: {
  items: {
    productId: string;
    quantity: number;
  }[];
  addressId: string;
  paymentMethod: string;
}) {
  return request<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function cancelOrder(id: string) {
  return request<Order>(`/orders/${id}/cancel`, {
    method: "PATCH",
  });
}

/* =========================
   WISHLIST
========================= */

export async function getWishlist() {
  return request<Product[]>("/wishlist", {
    method: "GET",
  });
}

export async function addToWishlist(productId: string) {
  return request(`/wishlist`, {
    method: "POST",
    body: JSON.stringify({ productId }),
  });
}

export async function removeFromWishlist(productId: string) {
  return request(`/wishlist/${productId}`, {
    method: "DELETE",
  });
}

/* =========================
   SELL
========================= */

export interface SellRequest {
  productId?: string;
  brand: string;
  model: string;
  storage?: string;
  condition?: string;
  imei?: string;
  expectedPrice?: number;
  images?: string[];
}

export async function createSellRequest(payload: SellRequest) {
  return request("/sell", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getSellRequests() {
  return request("/sell", {
    method: "GET",
  });
}

/* =========================
   TOKEN HELPERS
========================= */

export function saveAuthData(
  token: string,
  user?: User
) {
  if (typeof window === "undefined") return;

  localStorage.setItem("surebuy_token", token);

  if (user) {
    localStorage.setItem(
      "surebuy_user",
      JSON.stringify(user)
    );
  }
}

export function getStoredUser(): User | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = localStorage.getItem("surebuy_user");

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as User;
  } catch {
    localStorage.removeItem("surebuy_user");
    return null;
  }
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("surebuy_token");
}

export function clearAuthData() {
  if (typeof window === "undefined") return;

  localStorage.removeItem("surebuy_token");
  localStorage.removeItem("surebuy_user");
}

export { ApiError };