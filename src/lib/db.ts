import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import bcrypt from "bcryptjs";
import { phonePlaceholder } from "./placeholder";
import { ADMIN_EMAILS } from "./auth-constants";

// On Vercel the project directory is read-only; only /tmp is writable, and it
// does not persist across cold starts or deployments. This keeps the demo
// functional there, but data (orders, phone edits) can reset unexpectedly.
// Fine for a click-through demo; swap for a hosted DB before real production use.
const dataDir = process.env.VERCEL
  ? path.join("/tmp", "imagic-data")
  : path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "app.db");

declare global {
  // eslint-disable-next-line no-var
  var __imagicDb: Database.Database | undefined;
}

const db = global.__imagicDb ?? new Database(dbPath);
if (process.env.NODE_ENV !== "production") global.__imagicDb = db;

db.pragma("journal_mode = WAL");

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
  user_id INTEGER NOT NULL REFERENCES users(id),
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
  total INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  phone_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  price INTEGER NOT NULL,
  qty INTEGER NOT NULL
);
`);

const count = (db.prepare("SELECT COUNT(*) as c FROM phones").get() as { c: number }).c;

if (count === 0) {
  // INSERT OR IGNORE (keyed on the UNIQUE(brand, model) constraint) because
  // Next.js's build-time page-data collection runs several worker processes
  // that each import this module and could otherwise race to double-seed.
  const insert = db.prepare(`
    INSERT OR IGNORE INTO phones (brand, model, price, mrp, ram_gb, storage_gb, display, battery_mah, camera, processor, color, description, image, rating, stock)
    VALUES (@brand, @model, @price, @mrp, @ram_gb, @storage_gb, @display, @battery_mah, @camera, @processor, @color, @description, @image, @rating, @stock)
  `);

  const seedPhones = [
    {
      brand: "Nexora", model: "Nexora X1", price: 14999, mrp: 17999, ram_gb: 6, storage_gb: 128,
      display: "6.5\" FHD+ LCD, 90Hz", battery_mah: 5000, camera: "50MP + 2MP Dual", processor: "Snapdragon 4 Gen 2",
      color: "Midnight Black", rating: 4.2, stock: 25,
      description: "A reliable everyday phone with a big battery and smooth 90Hz display, built for all-day use.",
      image: phonePlaceholder("Nexora X1", "#1f2937", "#111827"),
    },
    {
      brand: "Nexora", model: "Nexora X1 Pro", price: 21999, mrp: 24999, ram_gb: 8, storage_gb: 256,
      display: "6.7\" AMOLED, 120Hz", battery_mah: 5000, camera: "64MP OIS + 8MP Ultrawide", processor: "Snapdragon 7s Gen 2",
      color: "Ocean Blue", rating: 4.4, stock: 18,
      description: "Flagship-grade AMOLED display and OIS camera for sharper low-light shots, in a sleek glass body.",
      image: phonePlaceholder("Nexora X1 Pro", "#1e3a8a", "#1d4ed8"),
    },
    {
      brand: "Nexora", model: "Nexora Zip", price: 9999, mrp: 11999, ram_gb: 4, storage_gb: 64,
      display: "6.3\" HD+ LCD, 60Hz", battery_mah: 4500, camera: "13MP Single", processor: "Helio G36",
      color: "Coral Red", rating: 3.9, stock: 40,
      description: "A budget-friendly starter phone for calls, messaging and light browsing.",
      image: phonePlaceholder("Nexora Zip", "#7f1d1d", "#b91c1c"),
    },
    {
      brand: "Veltrix", model: "Veltrix S Lite", price: 12999, mrp: 15499, ram_gb: 6, storage_gb: 128,
      display: "6.4\" IPS LCD, 90Hz", battery_mah: 5000, camera: "48MP + 2MP Macro", processor: "Dimensity 6100+",
      color: "Pearl White", rating: 4.1, stock: 30,
      description: "Clean design with a dependable battery and a capable 48MP main camera.",
      image: phonePlaceholder("Veltrix S Lite", "#f3f4f6", "#d1d5db"),
    },
    {
      brand: "Veltrix", model: "Veltrix S", price: 18999, mrp: 21999, ram_gb: 8, storage_gb: 128,
      display: "6.6\" AMOLED, 120Hz", battery_mah: 4800, camera: "50MP OIS + 8MP Ultrawide + 2MP Depth", processor: "Dimensity 7050",
      color: "Graphite Grey", rating: 4.5, stock: 22,
      description: "A balanced all-rounder with a vivid AMOLED panel and a versatile triple camera setup.",
      image: phonePlaceholder("Veltrix S", "#374151", "#4b5563"),
    },
    {
      brand: "Veltrix", model: "Veltrix S Max", price: 27999, mrp: 32999, ram_gb: 12, storage_gb: 256,
      display: "6.8\" AMOLED, 144Hz", battery_mah: 5200, camera: "108MP OIS + 12MP Ultrawide + 5MP Tele", processor: "Snapdragon 7+ Gen 3",
      color: "Titanium Silver", rating: 4.7, stock: 12,
      description: "The top-tier Veltrix with a 108MP camera system and ultra-smooth 144Hz display for power users.",
      image: phonePlaceholder("Veltrix S Max", "#64748b", "#94a3b8"),
    },
    {
      brand: "Orova", model: "Orova Air", price: 16999, mrp: 19499, ram_gb: 8, storage_gb: 128,
      display: "6.5\" AMOLED, 90Hz", battery_mah: 4500, camera: "50MP + 5MP Ultrawide", processor: "Snapdragon 6 Gen 1",
      color: "Sunset Orange", rating: 4.3, stock: 20,
      description: "Slim and light with an AMOLED screen that makes everyday scrolling and streaming a pleasure.",
      image: phonePlaceholder("Orova Air", "#9a3412", "#ea580c"),
    },
    {
      brand: "Orova", model: "Orova Edge", price: 23999, mrp: 27999, ram_gb: 8, storage_gb: 256,
      display: "6.7\" Curved AMOLED, 120Hz", battery_mah: 4700, camera: "50MP OIS + 12MP Ultrawide + 2MP Macro", processor: "Dimensity 7200",
      color: "Emerald Green", rating: 4.4, stock: 16,
      description: "Curved-edge AMOLED display with stabilized camera for crisp photos and videos on the move.",
      image: phonePlaceholder("Orova Edge", "#065f46", "#059669"),
    },
    {
      brand: "Orova", model: "Orova Max 5G", price: 31999, mrp: 36999, ram_gb: 12, storage_gb: 256,
      display: "6.78\" AMOLED, 144Hz", battery_mah: 5500, camera: "64MP OIS + 12MP Ultrawide + 5MP Tele", processor: "Snapdragon 8s Gen 3",
      color: "Jet Black", rating: 4.6, stock: 10,
      description: "Orova's flagship 5G phone with top-end performance, huge battery, and a pro-grade camera trio.",
      image: phonePlaceholder("Orova Max 5G", "#0f172a", "#1e293b"),
    },
    {
      brand: "Nexora", model: "Nexora Fold Mini", price: 42999, mrp: 48999, ram_gb: 12, storage_gb: 256,
      display: "6.9\" Foldable AMOLED, 120Hz", battery_mah: 4600, camera: "50MP OIS + 12MP Ultrawide", processor: "Snapdragon 8 Gen 2",
      color: "Lavender Purple", rating: 4.5, stock: 6,
      description: "A compact foldable with flagship performance — a showcase device for the Nexora lineup.",
      image: phonePlaceholder("Nexora Fold Mini", "#4c1d95", "#6d28d9"),
    },
  ];

  const insertMany = db.transaction((rows: typeof seedPhones) => {
    for (const r of rows) insert.run(r);
  });
  insertMany(seedPhones);
}

// Next.js collects page data across several worker processes during build,
// each importing this module and racing to seed the same SQLite file.
// INSERT OR IGNORE (keyed on the unique email) makes that race harmless.
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

export default db;
