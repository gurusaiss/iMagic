import Link from "next/link";

export const metadata = { title: "About — iMagic" };

const VALUES = [
  { title: "Genuine products", desc: "Every phone we sell is sourced directly from the brand with full manufacturer warranty." },
  { title: "Fast, reliable delivery", desc: "Most orders reach you within 2-4 business days, tracked end to end." },
  { title: "Easy returns", desc: "Changed your mind? Return eligible orders within 7 days of delivery, no questions asked." },
  { title: "Real human support", desc: "Our support team is available every day to help with orders, setup and more." },
];

export default function AboutPage() {
  return (
    <div>
      <section className="section text-center">
        <div className="container-narrow">
          <p className="pill mb-4 bg-[#f5f5f7] text-muted">Our Story</p>
          <h1 className="mx-auto max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">
            Making great phones easy to find, and easy to own.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-muted">
            iMagic is an authorised retailer for Nexora, Veltrix and Orova — three of the fastest growing phone
            makers. We started with one simple idea: shopping for a phone should feel as good as using one.
          </p>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-narrow grid grid-cols-1 gap-6 sm:grid-cols-2">
          {VALUES.map((v) => (
            <div key={v.title} className="card p-6">
              <h3 className="mb-2 text-lg font-semibold">{v.title}</h3>
              <p className="text-sm text-muted">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section pt-0 text-center">
        <div className="container-narrow">
          <h2 className="mb-4 text-2xl font-semibold tracking-tight">Have a question before you buy?</h2>
          <Link href="/contact" className="btn-primary inline-flex">
            Talk to our team
          </Link>
        </div>
      </section>
    </div>
  );
}
