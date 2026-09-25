import type { Metadata } from "next";
import type { ReactNode } from "react";

const SITE_URL = "https://phonebhai.com";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.phonebhai.com/api/v1";

type ProductImage = {
  url?: string | null;
  type?: "IMAGE" | "VIDEO";
  altText?: string | null;
};

type ProductVariant = {
  price?: number | string | null;
  originalPrice?: number | string | null;
  stock?: number | null;
};

type Product = {
  id: number;
  slug?: string | null;
  brand?: string | null;
  name?: string | null;
  category?: string | null;
  condition?: string | null;
  price?: number | string | null;
  originalPrice?: number | string | null;
  warranty?: string | null;
  description?: string | null;
  rating?: number | string | null;
  reviewCount?: number | null;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;

  images?: ProductImage[];
  variants?: ProductVariant[];
};

type ProductResponse = {
  success?: boolean;
  data?: Product;
};

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

function formatCondition(condition?: string | null) {
  switch (condition) {
    case "LIKE_NEW":
      return "Like New";

    case "EXCELLENT":
      return "Excellent";

    case "GOOD":
      return "Good";

    case "FAIR":
      return "Fair";

    default:
      return condition || "Used";
  }
}

async function getProduct(
  identifier: string,
): Promise<Product | null> {
  try {
    const response = await fetch(
      `${API_URL}/products/${encodeURIComponent(identifier)}`,
      {
        headers: {
          Accept: "application/json",
        },

        next: {
          revalidate: 3600,
        },
      },
    );

    if (!response.ok) {
      return null;
    }

    const data =
      (await response.json()) as ProductResponse;

    if (!data.success || !data.data) {
      return null;
    }

    return data.data;
  } catch (error) {
    console.error("Product SEO fetch failed:", error);

    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const product = await getProduct(id);

  if (!product) {
    return {
      title: "Product Not Found",
      description:
        "The requested product is not available on PhoneBhai.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const name = product.name?.trim() || "Phone";
  const brand = product.brand?.trim() || "";
  const condition = formatCondition(product.condition);

  const title = `${brand ? `${brand} ` : ""}${name} ${condition} – Buy Online`;

  const description =
    product.description?.trim() ||
    `Buy ${brand ? `${brand} ` : ""}${name} in ${condition} condition at PhoneBhai. Quality-checked devices with warranty and secure checkout.`;

  const canonical = `${SITE_URL}/buy/${product.id}`;

  const image = product.images?.find(
    (item) =>
      item.type !== "VIDEO" &&
      typeof item.url === "string" &&
      item.url.length > 0,
  )?.url;

  return {
    title,

    description,

    alternates: {
      canonical,
    },

    openGraph: {
      type: "website",
      url: canonical,
      siteName: "PhoneBhai",
      title,
      description,

      ...(image
        ? {
            images: [
              {
                url: image,
                alt:
                  product.images?.find(
                    (item) => item.url === image,
                  )?.altText ||
                  name,
              },
            ],
          }
        : {}),
    },

    robots: {
      index: product.active !== false,
      follow: product.active !== false,
      googleBot: {
        index: product.active !== false,
        follow: product.active !== false,
      },
    },
  };
}

export default async function ProductLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}