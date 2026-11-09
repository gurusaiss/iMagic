import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import os from "os";
import bcrypt from "bcryptjs";
import { phonePlaceholder } from "./placeholder";
import { ADMIN_EMAILS } from "./auth-constants";

// The DB file lives outside the project tree to prevent Next.js HMR refresh loops
const dataDir = path.join(os.tmpdir(), "imagic-data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "app.db");

declare global {
  var __imagicDb: Database.Database | undefined;
}

const db = global.__imagicDb ?? new Database(dbPath);
if (process.env.NODE_ENV !== "production") global.__imagicDb = db;

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
CREATE TABLE IF NOT EXISTS phones (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  price INTEGER NOT NULL,
  mrp INTEGER NOT NULL,
  ram_gb INTEGER NOT NULL,
  storage_gb INTEGER NOT NULL,
  display TEXT NOT NULL,
  battery_mah INTEGER NOT NULL,
  camera TEXT NOT NULL,
  processor TEXT NOT NULL,
  color TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  rating REAL NOT NULL DEFAULT 4.3,
  stock INTEGER NOT NULL DEFAULT 10,
  UNIQUE(brand, model)
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS staff_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  area TEXT NOT NULL DEFAULT '',
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id),
  customer_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  address_line TEXT NOT NULL,
  city TEXT NOT NULL,
  pincode TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'CONFIRMED',
  payment_status TEXT NOT NULL DEFAULT 'PAID',
  payment_method TEXT NOT NULL DEFAULT 'upi',
  total INTEGER NOT NULL,
  assigned_staff_id INTEGER REFERENCES staff_members(id),
  idempotency_key TEXT UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  phone_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  price INTEGER NOT NULL,
  qty INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS wishlist_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  phone_id INTEGER NOT NULL REFERENCES phones(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, phone_id)
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_phones_brand ON phones(brand);
`);

const seedPhones = [
  {
    brand: "Nexora", model: "Nexora X1", price: 14999, mrp: 17999, ram_gb: 6, storage_gb: 128,
    display: "6.5\" FHD+ Super AMOLED, 90Hz", battery_mah: 5000, camera: "50MP Dual Camera", processor: "Snapdragon 4 Gen 2",
    color: "Midnight Black", rating: 4.3, stock: 25,
    description: "Aerospace-grade durability with an all-day battery and vibrant 90Hz AMOLED display.",
  },
  {
    brand: "Nexora", model: "Nexora X1 Pro", price: 21999, mrp: 24999, ram_gb: 8, storage_gb: 256,
    display: "6.7\" ProMotion AMOLED, 120Hz", battery_mah: 5000, camera: "64MP OIS + 8MP Ultrawide", processor: "Snapdragon 7s Gen 2",
    color: "Ocean Blue", rating: 4.6, stock: 18,
    description: "Pro-grade triple camera system with optical image stabilization and titanium-finished edges.",
  },
  {
    brand: "Nexora", model: "Nexora Zip", price: 9999, mrp: 11999, ram_gb: 4, storage_gb: 64,
    display: "6.3\" Liquid Retina LCD, 60Hz", battery_mah: 4500, camera: "13MP HDR Camera", processor: "Helio G36",
    color: "Coral Red", rating: 4.0, stock: 40,
    description: "Compact, featherlight and dependable smartphone for effortless daily communication.",
  },
  {
    brand: "Veltrix", model: "Veltrix S Lite", price: 12999, mrp: 15499, ram_gb: 6, storage_gb: 128,
    display: "6.4\" IPS Display, 90Hz", battery_mah: 5000, camera: "48MP Dual Studio Lens", processor: "Dimensity 6100+",
    color: "Pearl White", rating: 4.2, stock: 30,
    description: "Minimalist ceramic-touch casing with high-fidelity camera optics and rapid charge.",
  },
  {
    brand: "Veltrix", model: "Veltrix S", price: 18999, mrp: 21999, ram_gb: 8, storage_gb: 128,
    display: "6.6\" Curved AMOLED, 120Hz", battery_mah: 4800, camera: "50MP OIS + 8MP Ultrawide", processor: "Dimensity 7050",
    color: "Graphite Grey", rating: 4.5, stock: 22,
    description: "Precision engineered with dual stereo speakers and cinematic high dynamic range.",
  },
  {
    brand: "Veltrix", model: "Veltrix S Max", price: 27999, mrp: 32999, ram_gb: 12, storage_gb: 256,
    display: "6.8\" Ultra Retina, 144Hz", battery_mah: 5200, camera: "108MP Studio + 12MP Ultra + 5MP Tele", processor: "Snapdragon 7+ Gen 3",
    color: "Titanium Silver", rating: 4.8, stock: 12,
    description: "Flagship powerhouse equipped with periscope telephoto zoom and titanium enclosure.",
  },
  {
    brand: "Orova", model: "Orova Air", price: 16999, mrp: 19499, ram_gb: 8, storage_gb: 128,
    display: "6.5\" Edge-to-Edge OLED, 90Hz", battery_mah: 4500, camera: "50MP Photonic Engine", processor: "Snapdragon 6 Gen 1",
    color: "Sunset Orange", rating: 4.4, stock: 20,
    description: "Ultra-thin 6.9mm profile with radiant color shift glass and wireless charging.",
  },
  {
    brand: "Orova", model: "Orova Edge", price: 23999, mrp: 27999, ram_gb: 8, storage_gb: 256,
    display: "6.7\" Curved Flow AMOLED, 120Hz", battery_mah: 4700, camera: "50MP OIS + 12MP Ultrawide", processor: "Dimensity 7200",
    color: "Emerald Green", rating: 4.5, stock: 16,
    description: "Breathtaking dual-curve display with night mode portrait mastery and water resistance.",
  },
  {
    brand: "Orova", model: "Orova Max 5G", price: 31999, mrp: 36999, ram_gb: 12, storage_gb: 256,
    display: "6.78\" Ultra Bright AMOLED, 144Hz", battery_mah: 5500, camera: "64MP OIS + 12MP Ultra + 5MP Tele", processor: "Snapdragon 8s Gen 3",
    color: "Jet Black", rating: 4.7, stock: 10,
    description: "Ultimate speed, 120W HyperCharge, and studio-grade cinematic video capture.",
  },
  {
    brand: "Nexora", model: "Nexora Fold Mini", price: 42999, mrp: 48999, ram_gb: 12, storage_gb: 256,
    display: "6.9\" Foldable Ultra Thin Glass, 120Hz", battery_mah: 4600, camera: "50MP Dual OIS", processor: "Snapdragon 8 Gen 2",
    color: "Lavender Purple", rating: 4.8, stock: 6,
    description: "Revolutionary zero-gap hinge foldable smartphone with aerospace titanium frame.",
  },
];

const count = (db.prepare("SELECT COUNT(*) as c FROM phones").get() as { c: number }).c;

if (count === 0) {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO phones (brand, model, price, mrp, ram_gb, storage_gb, display, battery_mah, camera, processor, color, description, image, rating, stock)
    VALUES (@brand, @model, @price, @mrp, @ram_gb, @storage_gb, @display, @battery_mah, @camera, @processor, @color, @description, @image, @rating, @stock)
  `);

  const rows = seedPhones.map((p) => ({
    ...p,
    image: phonePlaceholder(p.model, p.color),
  }));

  const insertMany = db.transaction((items: typeof rows) => {
    for (const r of items) insert.run(r);
  });
  insertMany(rows);
} else {
  // Update all existing phones to the photorealistic vector renders
  const allPhones = db.prepare("SELECT id, model, color FROM phones").all() as { id: number; model: string; color: string }[];
  const updateImage = db.prepare("UPDATE phones SET image = ? WHERE id = ?");
  for (const p of allPhones) {
    updateImage.run(phonePlaceholder(p.model, p.color), p.id);
  }
}

// Seed admin & demo customer
const insertUser = db.prepare(`
  INSERT OR IGNORE INTO users (name, email, password_hash, role) VALUES (@name, @email, @password_hash, @role)
`);
insertUser.run({
  name: "iMagic Admin",
  email: ADMIN_EMAILS[0],
  password_hash: bcrypt.hashSync("admin123", 10),
  role: "admin",
});
insertUser.run({
  name: "Demo Customer",
  email: "customer@example.com",
  password_hash: bcrypt.hashSync("customer123", 10),
  role: "customer",
});

// Seed demo delivery staff
const staffCount = (db.prepare("SELECT COUNT(*) as c FROM staff_members").get() as { c: number }).c;
if (staffCount === 0) {
  const insertStaff = db.prepare(
    "INSERT OR IGNORE INTO staff_members (name, phone, area) VALUES (@name, @phone, @area)"
  );
  [
    { name: "Ravi Kumar", phone: "9876543210", area: "North Delhi Hub" },
    { name: "Priya Sharma", phone: "9876543211", area: "South Delhi & Noida" },
    { name: "Arjun Singh", phone: "9876543212", area: "Cyber City & Gurgaon" },
  ].forEach((s) => insertStaff.run(s));
}

export default db;
