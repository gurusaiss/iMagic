"use client";

import { useState } from "react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="section">
      <div className="container-narrow max-w-xl">
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">Contact us</h1>
        <p className="mb-10 text-muted">We usually reply within one business day.</p>

        {submitted ? (
          <div className="card p-8 text-center">
            <h2 className="mb-2 text-xl font-semibold">Thanks for reaching out!</h2>
            <p className="text-muted">Our support team will get back to you shortly.</p>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="card flex flex-col gap-4 p-6"
          >
            <input required placeholder="Full name" className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm" />
            <input required type="email" placeholder="Email" className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm" />
            <input placeholder="Order number (optional)" className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm" />
            <textarea required rows={5} placeholder="How can we help?" className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm" />
            <button type="submit" className="btn-primary self-start">
              Send message
            </button>
          </form>
        )}

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3 text-sm">
          <div>
            <h3 className="mb-1 font-semibold">Call us</h3>
            <p className="text-muted">1800-123-4567</p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold">Email</h3>
            <p className="text-muted">support@imagic.example.com</p>
          </div>
          <div>
            <h3 className="mb-1 font-semibold">Hours</h3>
            <p className="text-muted">Mon–Sun, 9am–9pm IST</p>
          </div>
        </div>
      </div>
    </div>
  );
}
