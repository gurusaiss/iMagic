type PhoneInput = {
  brand: string;
  model: string;
  price: number;
  mrp: number;
  ram_gb: number;
  storage_gb: number;
  display: string;
  battery_mah: number;
  camera: string;
  processor: string;
  color: string;
  description: string;
  stock: number;
};

const NUMERIC_FIELDS: (keyof PhoneInput)[] = [
  "price",
  "mrp",
  "ram_gb",
  "storage_gb",
  "battery_mah",
  "stock",
];

export function validatePhoneInput(body: PhoneInput): string | null {
  for (const field of NUMERIC_FIELDS) {
    const value = body[field];
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
      return `${field} must be a non-negative number`;
    }
  }
  if (!body.brand?.trim() || !body.model?.trim()) {
    return "Brand and model are required";
  }
  return null;
}
