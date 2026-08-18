import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/header";
import Footer from "./components/footer";
import { WishlistProvider } from "./context/WishlistContext";
export const metadata: Metadata = {
  title: {
    default: "PhoneBuy | Buy, Sell & Repair Devices",
    template: "%s | PhoneBuy",
  },

  description:
    "Buy quality-checked devices, sell your old phone or laptop, and get reliable device repair with PhoneBuy.",

  keywords: [
    "buy used phones",
    "sell old phone",
    "refurbished phones",
    "used laptops",
    "phone repair",
    "PhoneBuy",
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
        <WishlistProvider>
        <Header/>

        {children}

        <Footer />
        </WishlistProvider>
      </body>
    </html>
  );
}