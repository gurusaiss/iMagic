export const metadata = { title: "FAQs — iMagic" };

const FAQS = [
  {
    q: "What is No Cost EMI?",
    a: "No Cost EMI lets you split your purchase into monthly instalments with zero additional interest, available on select cards at checkout.",
  },
  {
    q: "How long does delivery take?",
    a: "Most orders are delivered within 2-4 business days. You can track your order status anytime from the Orders page.",
  },
  {
    q: "What is your return policy?",
    a: "You can request a return within 7 days of delivery for any eligible, unused product in its original packaging. Once approved, refunds are processed to your original payment method.",
  },
  {
    q: "Do phones come with a warranty?",
    a: "Yes, every phone sold on iMagic comes with the full manufacturer warranty, typically 1 year, honoured at authorised service centres.",
  },
  {
    q: "Can I cancel my order?",
    a: "Orders can be cancelled any time before they are packed for delivery. Visit your order detail page and select Cancel order.",
  },
  {
    q: "Is my payment information secure?",
    a: "We never store your full card details — only the last 4 digits are retained for your reference, and all checkout traffic is encrypted.",
  },
];

export default function FaqPage() {
  return (
    <div className="section">
      <div className="container-narrow max-w-2xl">
        <h1 className="mb-10 text-3xl font-semibold tracking-tight">Frequently asked questions</h1>
        <div className="flex flex-col divide-y divide-[var(--border)]">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                {f.q}
                <span className="text-muted transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
