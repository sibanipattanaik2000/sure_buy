import type { Metadata } from "next";
import "./globals.css";

import Header from "./components/header";
import Footer from "./components/footer";

import { WishlistProvider } from "./context/WishlistContext";
import { CheckoutProvider } from "./context/CheckoutContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

export const metadata: Metadata = {
  title: {
    default: "PhoneBhai | Buy, Sell & Repair Devices",
    template: "%s | PhoneBhai",
  },

  description:
    "Buy quality-checked devices, sell your old phone or laptop, and get reliable device repair with PhoneBhai.",

  keywords: [
    "buy used phones",
    "sell old phone",
    "refurbished phones",
    "used laptops",
    "phone repair",
    "PhoneBhai",
  ],
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