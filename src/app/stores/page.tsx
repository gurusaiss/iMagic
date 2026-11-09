export const metadata = { title: "Find a Store — iMagic" };

const STORES = [
  { city: "Mumbai", area: "Bandra West", address: "Linking Road, Bandra West, Mumbai 400050", phone: "022-4000-1234" },
  { city: "Delhi", area: "Connaught Place", address: "Block A, Connaught Place, New Delhi 110001", phone: "011-4000-5678" },
  { city: "Bengaluru", area: "Indiranagar", address: "100 Feet Road, Indiranagar, Bengaluru 560038", phone: "080-4000-9012" },
  { city: "Chennai", area: "T. Nagar", address: "Usman Road, T. Nagar, Chennai 600017", phone: "044-4000-3456" },
  { city: "Pune", area: "FC Road", address: "Fergusson College Road, Pune 411004", phone: "020-4000-7890" },
  { city: "Hyderabad", area: "Banjara Hills", address: "Road No. 1, Banjara Hills, Hyderabad 500034", phone: "040-4000-2345" },
];

export default function StoresPage() {
  return (
    <div className="section">
      <div className="container-narrow">
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">Find a store</h1>
        <p className="mb-10 text-muted">Visit an iMagic experience store to try before you buy.</p>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STORES.map((s) => (
            <div key={s.city} className="card p-6">
              <h3 className="text-lg font-semibold">{s.city} — {s.area}</h3>
              <p className="mt-2 text-sm text-muted">{s.address}</p>
              <p className="mt-2 text-sm">{s.phone}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
