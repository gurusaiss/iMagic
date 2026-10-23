import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { ToastProvider } from "@/lib/toast-context";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "iMagic — Demo Store",
  description: "MVP demo for a single-retailer mobile phone shopping platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <CartProvider>
        <ToastProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <footer className="bg-gray-900 text-gray-300">
            <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-10 text-sm sm:grid-cols-4">
              <div>
                <h3 className="mb-3 font-semibold text-white">Get to Know Us</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>About iMagic</li>
                  <li>Careers</li>
                  <li>Press Releases</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 font-semibold text-white">Connect with Us</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Facebook</li>
                  <li>Instagram</li>
                  <li>X (Twitter)</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 font-semibold text-white">Let Us Help You</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Your Orders</li>
                  <li>Returns &amp; Refunds</li>
                  <li>Help Center</li>
                </ul>
              </div>
              <div>
                <h3 className="mb-3 font-semibold text-white">Policies</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Terms of Use</li>
                  <li>Privacy Policy</li>
                  <li>Shipping Policy</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 px-4 py-4 text-center text-xs text-gray-500">
              iMagic demo build — all payments, SMS/email and delivery are simulated. Not a
              real store.
            </div>
          </footer>
        </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
