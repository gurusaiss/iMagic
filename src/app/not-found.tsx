import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Page Not Found" };

export default function NotFound() {
  return (
    <div className="animate-fade-in-up mx-auto max-w-md px-4 py-32 text-center">
      <p className="text-7xl">📱</p>
      <h1 className="mt-6 text-3xl font-extrabold">404</h1>
      <p className="mt-2 text-xl font-semibold text-gray-700">Page not found</p>
      <p className="mt-2 text-sm text-gray-500">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link href="/" className="btn-primary">Go Home</Link>
        <Link href="/phones" className="btn-secondary">Browse Phones</Link>
      </div>
    </div>
  );
}
