"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { useOrder } from "@/components/menu/order-context";

interface OrderBarProps {
  /** Digits only, international format. */
  whatsapp: string;
}

export function OrderBar({ whatsapp }: OrderBarProps) {
  const { lines, count, total, setQuantity, clear } = useOrder();
  const [open, setOpen] = useState(false);

  if (count === 0) return null;

  const message = [
    "Hola! Quiero hacer un pedido en La Balanza:",
    "",
    ...lines.map(
      (line) => `• ${line.quantity} × ${line.name} — ${formatPrice(line.quantity * line.price)}`,
    ),
    "",
    `Total: ${formatPrice(total)}`,
  ].join("\n");

  const waHref = `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-800 bg-stone-950/95 backdrop-blur">
      <div className="mx-auto max-w-xl px-4 py-3 sm:px-6">
        {open ? (
          <div className="mb-3 max-h-[40vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2">
              <span className="font-display text-sm text-bone">Tu pedido</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Cerrar detalle del pedido"
                className="text-stone-400 hover:text-bone"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="space-y-2">
              {lines.map((line) => (
                <li
                  key={line.id}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="min-w-0 flex-1 truncate text-stone-300">
                    {line.quantity} × {line.name}
                  </span>
                  <span className="font-mono text-stone-200">
                    {formatPrice(line.quantity * line.price)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(line, 0)}
                    aria-label={`Quitar ${line.name} del pedido`}
                    className="text-stone-500 hover:text-terracotta"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={clear}
              className="mt-3 text-xs text-stone-500 underline hover:text-stone-300"
            >
              Vaciar pedido
            </button>
          </div>
        ) : null}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex flex-1 items-baseline justify-between text-left"
          >
            <span className="text-sm text-stone-300">
              {count} {count === 1 ? "ítem" : "ítems"}
            </span>
            <span className="font-mono text-sm text-bone">{formatPrice(total)}</span>
          </button>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-2.5 text-sm font-medium text-stone-950 transition-colors hover:bg-terracotta-deep"
          >
            <MessageCircle className="h-4 w-4" />
            Enviar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
