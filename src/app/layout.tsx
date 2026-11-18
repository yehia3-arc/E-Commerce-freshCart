import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./_components/Navbar/Navbar";
import Footer from "./_components/Footer/Footer";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/toast";
import FeaturesStrip from "./_components/FeaturesStrip/FeaturesStrip";
import MyProvider from "./_components/MyProvider/MyProvider";

import CartContextProvider from "../context/CartContext";
import WishlistContextProvider from "@/context/WishlistContext";

const exoFont = localFont({
  src: [
    {
      path: "./fonts/Exo-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Exo-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-exo",
  adjustFontFallback: false,
  display: "swap",
});

export const metadata: Metadata = {
  title: "E-Commerce  ( fresh cart )",
  description:
    "Shop the latest collection at Brand Name. Enjoy seamless browsing, secure checkout, and fast delivery on top-rated products. with many products to see",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${exoFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" suppressContentEditableWarning>
        <MyProvider>
          <WishlistContextProvider>
            <CartContextProvider>
              <Navbar />

              <main className="flex-1">{children}</main>
              <FeaturesStrip />
              <Toaster />
            </CartContextProvider>
          </WishlistContextProvider>

          <Footer />
        </MyProvider>
      </body>
    </html>
  );
}
