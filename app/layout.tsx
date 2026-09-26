import type { Metadata } from "next";
import "./globals.css";

import Header from "./components/header";
import Footer from "./components/footer";

import { WishlistProvider } from "./context/WishlistContext";
import { CheckoutProvider } from "./context/CheckoutContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

const SITE_URL = "https://www.phonebhai.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "PhoneBhai | Buy Refurbished & Used Phones Online",
    template: "%s | PhoneBhai",
  },

  description:
    "PhoneBhai is a smart tech marketplace for quality-checked refurbished, used and new smartphones. Shop devices from Apple, Samsung, OnePlus, Vivo, Oppo, Realme, Motorola and Google.",

  keywords: [
    "PhoneBhai",
    "Phone Bhai",
    "refurbished phones",
    "used phones",
    "buy refurbished phones",
    "used smartphones",
    "refurbished smartphones",
    "second hand phones",
    "quality checked phones",
    "Apple refurbished phones",
    "Samsung refurbished phones",
    "OnePlus refurbished phones",
  ],

  alternates: {
    canonical: SITE_URL,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "PhoneBhai",
    title: "PhoneBhai | Buy Refurbished & Used Phones Online",
    description:
      "Shop quality-checked refurbished, used and new smartphones at PhoneBhai.",
  },

  twitter: {
    card: "summary_large_image",
    title: "PhoneBhai | Buy Refurbished & Used Phones Online",
    description:
      "Shop quality-checked refurbished, used and new smartphones at PhoneBhai.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "PhoneBhai",
      alternateName: "Phone Bhai",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo-img.png`,
      },
      sameAs: [
        "https://www.instagram.com/surebuystore_/",
        "https://www.facebook.com/share/1BmWF5KqYP/",
        "https://youtube.com/@surebuystore",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "PhoneBhai",
      alternateName: "Phone Bhai",
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
      inLanguage: "en-IN",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>

      <body>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <Header />

              <CheckoutProvider>
                {children}
              </CheckoutProvider>

              <Footer />
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}