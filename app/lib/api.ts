const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1";

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
};

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(
    message: string,
    status: number,
    data?: unknown,
  ) {
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

  if (
    options.body &&
    !headers.has("Content-Type")
  ) {
    headers.set(
      "Content-Type",
      "application/json",
    );
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
      credentials: "include",
      cache: "no-store",
    },
  );

  let result: ApiResponse<T> | null = null;

  try {
    result =
      (await response.json()) as ApiResponse<T>;
  } catch {
    result = null;
  }

  if (!response.ok) {
    throw new ApiError(
      result?.message ||
        "Something went wrong",
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

export async function registerUser(
  payload: RegisterPayload,
) {
  return apiRequest<User>(
    "/auth/register",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export async function loginUser(
  payload: LoginPayload,
) {
  return apiRequest<LoginResponse>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export async function getCurrentUser() {
  return apiRequest<User>(
    "/auth/me",
    {
      method: "GET",
    },
  );
}

export async function logoutUser() {
  return apiRequest(
    "/auth/logout",
    {
      method: "POST",
    },
  );
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

export async function updateProfile(
  payload: UpdateProfilePayload,
) {
  return apiRequest<User>(
    "/auth/me",
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
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
  pincode: string;
  landmark?: string;
  isDefault?: boolean;
}

export async function getAddresses() {
  return apiRequest<Address[]>(
    "/addresses",
    {
      method: "GET",
    },
  );
}

export async function createAddress(
  payload: Omit<Address, "id">,
) {
  return apiRequest<Address>(
    "/addresses",
    {
      method: "POST",
      body: JSON.stringify({
        ...payload,
        postalCode: payload.pincode,
      }),
    },
  );
}

export async function updateAddress(
  id: string,
  payload: Partial<Address>,
) {
  return apiRequest<Address>(
    `/addresses/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify({
        ...payload,
        ...(payload.pincode !== undefined
          ? {
              postalCode: payload.pincode,
            }
          : {}),
      }),
    },
  );
}

export async function deleteAddress(
  id: string,
) {
  return apiRequest(
    `/addresses/${id}`,
    {
      method: "DELETE",
    },
  );
}

/* =========================================================
   PRODUCTS
========================================================= */

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

export async function getProducts(
  params?: {
    page?: number;
    limit?: number;
    search?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
  },
) {
  const searchParams =
    new URLSearchParams();

  if (params?.page) {
    searchParams.set(
      "page",
      String(params.page),
    );
  }

  if (params?.limit) {
    searchParams.set(
      "limit",
      String(params.limit),
    );
  }

  if (params?.search) {
    searchParams.set(
      "search",
      params.search,
    );
  }

  if (params?.brand) {
    searchParams.set(
      "brand",
      params.brand,
    );
  }

  if (params?.minPrice !== undefined) {
    searchParams.set(
      "minPrice",
      String(params.minPrice),
    );
  }

  if (params?.maxPrice !== undefined) {
    searchParams.set(
      "maxPrice",
      String(params.maxPrice),
    );
  }

  const query =
    searchParams.toString();

  return apiRequest<Product[]>(
    `/products${
      query ? `?${query}` : ""
    }`,
    {
      method: "GET",
    },
  );
}

export async function getProduct<T = Product>(
  id: string,
) {
  return apiRequest<T>(
    `/products/${id}`,
    {
      method: "GET",
    },
  );
}

/* =========================================================
   ORDERS
========================================================= */

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
  return apiRequest<Order[]>(
    "/orders",
    {
      method: "GET",
    },
  );
}

export async function getOrder(
  id: string,
) {
  return apiRequest<Order>(
    `/orders/${id}`,
    {
      method: "GET",
    },
  );
}

export async function createOrder(
  payload: {
    addressId: string;
    paymentMethod:
      | "COD"
      | "UPI"
      | "CARD";
  },
) {
  return apiRequest<Order>(
    "/orders",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}

export async function cancelOrder(
  id: string,
) {
  return apiRequest<Order>(
    `/orders/${id}/cancel`,
    {
      method: "PATCH",
    },
  );
}