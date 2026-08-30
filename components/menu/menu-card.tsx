import { formatPrice } from "@/lib/format";
import { QuantityStepper } from "@/components/menu/quantity-stepper";

interface MenuCardProps {
  item: { id: string; name: string; description: string; price: number };
  /** Small label above the name, e.g. the category. */
  eyebrow?: string;
}

export function MenuCard({ item, eyebrow }: MenuCardProps) {
  return (
    <article className="flex items-start justify-between gap-4 rounded-xl border border-stone-800 bg-stone-900/40 p-5 transition-colors hover:border-stone-700">
      <div className="min-w-0 flex-1">
        {eyebrow ? (
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-terracotta">
            {eyebrow}
          </span>
        ) : null}
        <h3 className="mt-1 font-display text-lg text-bone">{item.name}</h3>
        {item.description ? (
          <p className="mt-1 text-sm leading-relaxed text-stone-400">
            {item.description}
          </p>
        ) : null}
        <p className="mt-2 font-mono text-sm text-stone-200">
          {formatPrice(item.price)}
        </p>
      </div>

      <div className="shrink-0 pt-1">
        <QuantityStepper item={item} />
      </div>
    </article>
  );
}
