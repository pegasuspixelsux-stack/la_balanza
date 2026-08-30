"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface OrderLine {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderContextValue {
  lines: OrderLine[];
  quantityOf: (id: string) => number;
  setQuantity: (item: { id: string; name: string; price: number }, quantity: number) => void;
  increment: (item: { id: string; name: string; price: number }) => void;
  decrement: (item: { id: string; name: string; price: number }) => void;
  clear: () => void;
  count: number;
  total: number;
}

const OrderContext = createContext<OrderContextValue | null>(null);
const STORAGE_KEY = "lb_order_v1";

export function OrderProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<OrderLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as OrderLine[]);
    } catch {
      /* ignore unreadable storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore unwritable storage */
    }
  }, [lines, hydrated]);

  const setQuantity = useCallback<OrderContextValue["setQuantity"]>((item, quantity) => {
    setLines((prev) => {
      const next = prev.filter((line) => line.id !== item.id);
      if (quantity > 0) {
        next.push({ id: item.id, name: item.name, price: item.price, quantity });
      }
      return next;
    });
  }, []);

  const value = useMemo<OrderContextValue>(() => {
    const quantityOf = (id: string) =>
      lines.find((line) => line.id === id)?.quantity ?? 0;
    return {
      lines,
      quantityOf,
      setQuantity,
      increment: (item) => setQuantity(item, quantityOf(item.id) + 1),
      decrement: (item) => setQuantity(item, quantityOf(item.id) - 1),
      clear: () => setLines([]),
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      total: lines.reduce((sum, line) => sum + line.quantity * line.price, 0),
    };
  }, [lines, setQuantity]);

  return <OrderContext value={value}>{children}</OrderContext>;
}

export function useOrder(): OrderContextValue {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used within <OrderProvider>");
  return ctx;
}
