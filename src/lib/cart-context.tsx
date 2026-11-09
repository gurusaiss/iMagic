"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { Phone } from "./types";

export type CartItem = {
  id: number;
  brand: string;
  model: string;
  price: number;
  mrp: number;
  image: string;
  qty: number;
  stock: number;
};

type CartContextType = {
  items: CartItem[];
  loaded: boolean;
  add: (phone: Phone, qty?: number) => void;
  remove: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  clear: () => void;
  totalItems: number;
  totalPrice: number;
  totalSavings: number;
};

const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = "imagic_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage on mount
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore corrupted storage
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, loaded]);

  const add = useCallback((phone: Phone, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === phone.id);
      if (existing) {
        return prev.map((i) =>
          i.id === phone.id ? { ...i, qty: Math.min(i.qty + qty, phone.stock) } : i
        );
      }
      return [
        ...prev,
        {
          id: phone.id,
          brand: phone.brand,
          model: phone.model,
          price: phone.price,
          mrp: phone.mrp,
          image: phone.image,
          qty: Math.min(qty, phone.stock),
          stock: phone.stock,
        },
      ];
    });
  }, []);

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const setQty = useCallback((id: number, qty: number) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(qty, i.stock)) } : i))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.qty * i.price, 0);
  const totalSavings = items.reduce((sum, i) => sum + i.qty * Math.max(0, (i.mrp ?? i.price) - i.price), 0);

  return (
    <CartContext.Provider
      value={{ items, loaded, add, remove, setQty, clear, totalItems, totalPrice, totalSavings }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
