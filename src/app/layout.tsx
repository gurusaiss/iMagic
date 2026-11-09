import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/lib/user-context";
import { CartProvider } from "@/lib/cart-context";
import { ToastProvider } from "@/lib/toast-context";
import { WishlistProvider } from "@/lib/wishlist-context";
import { CompareProvider } from "@/lib/compare-context";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CompareTray from "@/components/CompareTray";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "iMagic — Premium Phones, Delivered",
  description: "Shop the latest smartphones from Nexora, Veltrix and Orova at iMagic.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <UserProvider>
          <CartProvider>
            <ToastProvider>
              <WishlistProvider>
                <CompareProvider>
                  <Navbar />
                  <main className="flex-1">{children}</main>
                  <Footer />
                  <CompareTray />
                </CompareProvider>
              </WishlistProvider>
            </ToastProvider>
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
