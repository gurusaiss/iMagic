"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { apiFetch } from "./api-fetch";
import { useCurrentUser } from "./user-context";
import type { Phone } from "./types";

type WishlistContextType = {
  ids: Set<number>;
  phones: Phone[];
  loaded: boolean;
  toggle: (phoneId: number) => Promise<void>;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useCurrentUser();
  const [phones, setPhones] = useState<Phone[]>([]);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/wishlist");
    if (!res.ok) {
      setPhones([]);
      return;
    }
    const data = await res.json();
    setPhones(data.phones ?? []);
  }, []);

  useEffect(() => {
    if (!user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clear wishlist when user logs out
      setPhones([]);
      setLoaded(true);
      return;
    }
    load().finally(() => setLoaded(true));
  }, [user, load]);

  const toggle = useCallback(
    async (phoneId: number) => {
      const res = await apiFetch(`/api/wishlist/${phoneId}`, { method: "POST" });
      if (res.ok) await load();
    },
    [load]
  );

  const ids = new Set(phones.map((p) => p.id));

  return (
    <WishlistContext.Provider value={{ ids, phones, loaded, toggle }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
