import Link from "next/link";

export default function NotFound() {
  return (
    <div className="section text-center">
      <h1 className="mb-4 text-4xl font-semibold tracking-tight">Page not found</h1>
      <p className="mb-8 text-muted">We&apos;re sorry, this page doesn&apos;t exist.</p>
      <Link href="/" className="btn-primary inline-flex">
        Back to home
      </Link>
    </div>
  );
}
