import { apiRequest } from "@/app/lib/api";

export type AdminProductMediaType = "IMAGE" | "VIDEO";

export type AdminProductImage = {
  id: number;
  url: string;
  key?: string | null;
  altText?: string | null;
  position: number;
  type: AdminProductMediaType;
  mimeType?: string | null;
  size?: number | null;
  variantId?: number | null;
};

export type AdminProductVariant = {
  id: number;
  storage: string;
  color: string;
  colorHex?: string | null;
  price: number | string;
  originalPrice: number | string;
  stock: number;

  highlights?: Array<{
    id: number;
    text: string;
    position: number;
  }>;

  images?: AdminProductImage[];
};

export type AdminProduct = {
  id: number;
  slug: string;
  brand: string;
  name: string;
  category: string;

  condition: "EXCELLENT" | "LIKE_NEW" | "GOOD";

  price: number | string;
  originalPrice: number | string;

  warranty: string;
  description: string;

  rating?: number | string;
  reviewCount?: number;

  emiFrom?: number | string | null;

  active: boolean;

  createdAt: string;
  updatedAt: string;

  highlights?: Array<{
    id: number;
    text: string;
    position: number;
  }>;

  images?: AdminProductImage[];

  variants: AdminProductVariant[];
};

export type AdminProductPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type AdminProductMediaPayload = {
  variantIndex?: number | null;

  url: string;
  key?: string | null;
  altText?: string | null;

  type: AdminProductMediaType;

  mimeType?: string | null;
  size?: number | null;

  position?: number;
};

export type AdminProductVariantPayload = {
  id?: number;

  storage: string;
  color: string;
  colorHex?: string | null;

  price: number;
  originalPrice: number;

  stock: number;

  highlights: string[];
};

export type UpdateAdminProductPayload = {
  slug: string;
  brand: string;
  name: string;
  category: string;

  condition: AdminProduct["condition"];

  price: number;
  originalPrice: number;

  warranty: string;
  description: string;

  emiFrom?: number | null;

  active: boolean;

  highlights: string[];

  variants: AdminProductVariantPayload[];

  media: AdminProductMediaPayload[];
};

export async function getAdminProducts(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const searchParams = new URLSearchParams();

  if (params?.page !== undefined) {
    searchParams.set(
      "page",
      String(params.page),
    );
  }

  if (params?.limit !== undefined) {
    searchParams.set(
      "limit",
      String(params.limit),
    );
  }

  if (params?.search?.trim()) {
    searchParams.set(
      "search",
      params.search.trim(),
    );
  }

  const query =
    searchParams.toString();

  type AdminProductsResponse = {
    products: AdminProduct[];
    pagination: AdminProductPagination;
  };

  const response =
    await apiRequest<
      AdminProductsResponse
    >(
      `/admin/products${
        query
          ? `?${query}`
          : ""
      }`,
      {
        method: "GET",
      },
    );

  return response;
}

export async function getAdminProduct(
  id: string,
) {
  return apiRequest<AdminProduct>(
    `/admin/products/${encodeURIComponent(id)}`,
    {
      method: "GET",
    },
  );
}

export async function updateAdminProduct(
  id: string,
  payload: UpdateAdminProductPayload,
) {
  return apiRequest<AdminProduct>(
    `/admin/products/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
}

export async function updateAdminProductStatus(
  id: string,
  active: boolean,
) {
  return apiRequest<{
    id: number;
    slug: string;
    name: string;
    active: boolean;
    updatedAt: string;
  }>(
    `/admin/products/${encodeURIComponent(id)}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({
        active,
      }),
    },
  );
}

export async function deleteAdminProduct(
  id: string,
) {
  return apiRequest<{
    id: number;
    name: string;
    slug: string;
  }>(
    `/admin/products/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
    },
  );
}

export async function createAdminProductMediaUploadUrl(
  payload: {
    slug: string;
    fileName: string;
    contentType: string;
    size: number;
  },
) {
  return apiRequest<{
    uploadUrl: string;
    url: string;
    key: string;
    type: AdminProductMediaType;
    mimeType: string;
    size: number;
  }>(
    "/admin/product-media/upload-url",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}