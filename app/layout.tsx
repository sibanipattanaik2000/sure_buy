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
    default: "PhoneBhai – Buy Refurbished & Used Phones Online",
    template: "%s | PhoneBhai",
  },

  description:
    "Buy quality-checked refurbished, used and new smartphones from Apple, Samsung, OnePlus, Vivo, Oppo, Realme, Motorola and Google at PhoneBhai.",

  keywords: [
    "PhoneBhai",
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
    title: "PhoneBhai – Buy Refurbished & Used Phones Online",
    description:
      "Shop quality-checked refurbished, used and new smartphones at PhoneBhai.",
  },

  twitter: {
    card: "summary_large_image",
    title: "PhoneBhai – Buy Refurbished & Used Phones Online",
    description:
      "Shop quality-checked refurbished, used and new smartphones at PhoneBhai.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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