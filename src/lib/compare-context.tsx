"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { Phone } from "./types";

type CompareContextType = {
  phones: Phone[];
  ids: Set<number>;
  toggle: (phone: Phone) => void;
  remove: (id: number) => void;
  clear: () => void;
};

const CompareContext = createContext<CompareContextType | null>(null);
const MAX_COMPARE = 3;

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [phones, setPhones] = useState<Phone[]>([]);

  const toggle = useCallback((phone: Phone) => {
    setPhones((prev) => {
      if (prev.some((p) => p.id === phone.id)) {
        return prev.filter((p) => p.id !== phone.id);
      }
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, phone];
    });
  }, []);

  const remove = useCallback((id: number) => {
    setPhones((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clear = useCallback(() => setPhones([]), []);

  const ids = new Set(phones.map((p) => p.id));

  return (
    <CompareContext.Provider value={{ phones, ids, toggle, remove, clear }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
