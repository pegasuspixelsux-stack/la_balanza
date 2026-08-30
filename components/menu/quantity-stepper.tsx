"use client";

import { Minus, Plus } from "lucide-react";
import { useOrder } from "@/components/menu/order-context";

interface QuantityStepperProps {
  item: { id: string; name: string; price: number };
}

export function QuantityStepper({ item }: QuantityStepperProps) {
  const { quantityOf, increment, decrement } = useOrder();
  const quantity = quantityOf(item.id);

  return (
    <div className="flex items-center gap-1 rounded-full border border-stone-700 bg-stone-900/60 p-1">
      <button
        type="button"
        onClick={() => decrement(item)}
        disabled={quantity === 0}
        aria-label={`Quitar una unidad de ${item.name}`}
        className="flex h-8 w-8 items-center justify-center rounded-full text-stone-300 transition-colors hover:bg-stone-800 hover:text-bone disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span
        aria-live="polite"
        className={`w-6 text-center font-mono text-sm tabular-nums ${
          quantity > 0 ? "text-terracotta" : "text-stone-500"
        }`}
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => increment(item)}
        aria-label={`Agregar una unidad de ${item.name}`}
        className="flex h-8 w-8 items-center justify-center rounded-full text-stone-300 transition-colors hover:bg-stone-800 hover:text-bone"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
