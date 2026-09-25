import type { MetadataRoute } from "next";

const SITE_URL = "https://phonebhai.com";
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.phonebhai.com/api/v1";

type Product = {
  id: number;
  slug?: string | null;
  updatedAt?: string;
  createdAt?: string;
  images?: {
    url?: string | null;
    type?: "IMAGE" | "VIDEO";
  }[];
};

type ProductResponse = {
  success?: boolean;
  products?: Product[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
  };
};

async function getAllProducts(): Promise<Product[]> {
  const products: Product[] = [];

  const limit = 100;
  let page = 1;
  let totalPages = 1;

  try {
    do {
      const response = await fetch(
        `${API_URL}/products?page=${page}&limit=${limit}&sort=newest`,
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
        console.error(
          `Sitemap product request failed: ${response.status}`,
        );

        break;
      }

      const data =
        (await response.json()) as ProductResponse;

      if (!data.success) {
        break;
      }

      const pageProducts = Array.isArray(data.products)
        ? data.products
        : [];

      products.push(...pageProducts);

      totalPages = data.pagination?.totalPages ?? page;

      page += 1;
    } while (page <= totalPages);
  } catch (error) {
    console.error("Sitemap product fetch failed:", error);
  }

  return products;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },

    {
      url: `${SITE_URL}/buy`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },

    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },

    {
      url: `${SITE_URL}/warranty`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },

    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const productPages: MetadataRoute.Sitemap = products.map(
    (product) => {
      const image = product.images?.find(
        (item) =>
          item.type !== "VIDEO" &&
          typeof item.url === "string" &&
          item.url.length > 0,
      );

      return {
        url: `${SITE_URL}/buy/${product.id}`,

        lastModified: product.updatedAt
          ? new Date(product.updatedAt)
          : product.createdAt
            ? new Date(product.createdAt)
            : new Date(),

        changeFrequency: "weekly",

        priority: 0.8,

        ...(image?.url
          ? {
              images: [image.url],
            }
          : {}),
      };
    },
  );

  return [...staticPages, ...productPages];
}