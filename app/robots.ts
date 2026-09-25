import type { MetadataRoute } from "next";

const SITE_URL = "https://phonebhai.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/account/",
          "/cart/",
          "/checkout/",
          "/login/",
          "/register/",
          "/orders/",
          "/wishlist/",
          "/order-success/",
        ],
      },
    ],

    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}