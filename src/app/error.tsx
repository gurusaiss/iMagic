"use client";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="section text-center">
      <h1 className="mb-4 text-4xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="mb-8 text-muted">Please try again.</p>
      <button onClick={reset} className="btn-primary">
        Try again
      </button>
    </div>
  );
}
