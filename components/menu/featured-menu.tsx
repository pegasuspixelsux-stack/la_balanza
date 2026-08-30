"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { FeaturedItem } from "@/lib/menu-types";
import { CategoryFilter } from "@/components/menu/category-filter";
import { MenuCard } from "@/components/menu/menu-card";

const ALL = "Todo";

export function FeaturedMenu({ items }: { items: FeaturedItem[] }) {
  const [active, setActive] = useState(ALL);

  const categoryNames = useMemo(
    () => [...new Set(items.map((i) => i.categoryName).filter(Boolean))],
    [items],
  );

  const visible =
    active === ALL ? items : items.filter((i) => i.categoryName === active);

  return (
    <div>
      {categoryNames.length > 1 ? (
        <div className="mb-8">
          <CategoryFilter
            categories={categoryNames}
            active={active}
            onChange={setActive}
            allLabel={ALL}
          />
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {visible.map((item) => (
          <MenuCard key={item.id} item={item} eyebrow={item.categoryName} />
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 rounded-full border border-stone-700 px-6 py-3 text-sm font-medium text-bone transition-colors hover:border-terracotta hover:text-terracotta"
        >
          Ver la carta completa
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
