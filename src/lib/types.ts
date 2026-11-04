export type Phone = {
  id: number;
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
  image: string;
  rating: number;
  stock: number;
};

export const ORDER_STATUS_FLOW = [
  "CONFIRMED",
  "PACKED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
] as const;

export type OrderStatus =
  | (typeof ORDER_STATUS_FLOW)[number]
  | "RETURN_REQUESTED"
  | "REFUNDED";

export type Order = {
  id: number;
  user_id: number;
  customer_name: string;
  phone_number: string;
  address_line: string;
  city: string;
  pincode: string;
  status: OrderStatus;
  payment_status: "PAID";
  payment_method?: string;
  total: number;
  created_at: string;
  assigned_staff_id?: number | null;
  staff_name?: string | null;
};

export type OrderItem = {
  id: number;
  order_id: number;
  phone_id: number;
  name: string;
  image: string;
  price: number;
  qty: number;
};

export type StaffMember = {
  id: number;
  name: string;
  phone: string;
  area: string;
  active: number;
  created_at: string;
};

export const STATUS_LABELS: Record<string, string> = {
  CONFIRMED: "Confirmed",
  PACKED: "Packed",
  OUT_FOR_DELIVERY: "Out for Delivery",
  DELIVERED: "Delivered",
  RETURN_REQUESTED: "Return Requested",
  REFUNDED: "Refunded",
};
