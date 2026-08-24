export type ProductCondition = "EXCELLENT" | "LIKE_NEW" | "GOOD";

export type ProductImage = {
  id: number;
  url: string;
  altText?: string | null;
  position: number;
};

export type ProductVariant = {
  id: number;
  storage: string;
  color: string;
  price: number;
  originalPrice: number;
  stock: number;
  images: ProductImage[];
};

export type ProductHighlight = {
  id: number;
  text: string;
  position: number;
};

export type Product = {
  id: number;
  slug: string;
  brand: string;
  name: string;
  category: string;
  condition: ProductCondition;
  price: number;
  originalPrice: number;
  warranty: string;
  description: string;
  rating: number;
  reviewCount: number;
  emiFrom: number | null;
  active: boolean;
  images: ProductImage[];
  highlights: ProductHighlight[];
  variants: ProductVariant[];
};

export type Review = {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  verifiedPurchase: boolean;
};

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1"
).replace(/\/$/, "");

async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.success) {
    throw new Error(
      data?.message || "Something went wrong while fetching data.",
    );
  }

  return data;
}

/* =========================================================
   GET PRODUCTS
========================================================= */

export async function getProducts(params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}) {
  const query = new URLSearchParams();

  query.set("page", String(params?.page ?? 1));
  query.set("limit", String(params?.limit ?? 24));

  if (params?.search?.trim()) {
    query.set("search", params.search.trim());
  }

  if (params?.category && params.category !== "All") {
    query.set("category", params.category);
  }

  /*
   * Current backend accepts brand as a single query value.
   * We send the first selected brand here.
   */
  if (params?.brand?.length) {
    query.set("brand", params.brand[0]);
  }

  if (params?.minPrice !== undefined) {
    query.set("minPrice", String(params.minPrice));
  }

  if (params?.maxPrice !== undefined) {
    query.set("maxPrice", String(params.maxPrice));
  }

  /*
   * Frontend:
   * featured -> newest
   * low      -> price_asc
   * high     -> price_desc
   * rating   -> rating
   */
  const sortMap: Record<string, string> = {
    featured: "newest",
    low: "price_asc",
    high: "price_desc",
    rating: "rating",
  };

  query.set("sort", sortMap[params?.sort || "featured"] || "newest");

  return apiRequest<{
    success: true;
    products: Product[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }>(`/products?${query.toString()}`);
}

/* =========================================================
   GET SINGLE PRODUCT
========================================================= */

export async function getProduct(id: string | number) {
  return apiRequest<{
    success: true;
    data: Product;
  }>(`/products/${encodeURIComponent(String(id))}`);
}

/* =========================================================
   GET REVIEWS
========================================================= */

export async function getProductReviews(productId: string | number) {
  return apiRequest<{
    success: true;
    reviews: Review[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }>(`/products/${productId}/reviews?limit=20`);
}

/* =========================================================
   HELPERS
========================================================= */

export function conditionLabel(condition: ProductCondition) {
  switch (condition) {
    case "LIKE_NEW":
      return "Like New";

    case "EXCELLENT":
      return "Excellent";

    case "GOOD":
      return "Good";

    default:
      return condition;
  }
}

export function getProductImage(product: Product) {
  return (
    product.images?.[0]?.url ||
    product.variants?.[0]?.images?.[0]?.url ||
    "/images/iphone-15.png"
  );
}

export function getVariantImage(variant: ProductVariant) {
  return (
    variant.images?.[0]?.url ||
    "/images/iphone-15.png"
  );
}