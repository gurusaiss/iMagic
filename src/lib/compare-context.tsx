"use client";

import { createContext, useContext, useState, ReactNode } from "react";

const MAX_COMPARE = 3;

type CompareContextType = {
  ids: number[];
  add: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  has: (id: number) => boolean;
  isFull: boolean;
  count: number;
};

const CompareContext = createContext<CompareContextType | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<number[]>([]);

  function add(id: number) {
    setIds((prev) => (prev.includes(id) || prev.length >= MAX_COMPARE ? prev : [...prev, id]));
  }

  function remove(id: number) {
    setIds((prev) => prev.filter((x) => x !== id));
  }

  function clear() {
    setIds([]);
  }

  function has(id: number) {
    return ids.includes(id);
  }

  return (
    <CompareContext.Provider
      value={{ ids, add, remove, clear, has, isFull: ids.length >= MAX_COMPARE, count: ids.length }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
