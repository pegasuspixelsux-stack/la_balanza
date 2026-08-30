"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { FeaturedItem, MenuCategoryWithItems } from "@/lib/menu-types";
import { CategoryFilter } from "@/components/menu/category-filter";
import { MenuCard } from "@/components/menu/menu-card";

const ALL = "Destacados";

interface FeaturedMenuProps {
  featured: FeaturedItem[];
  menu: MenuCategoryWithItems[];
}

export function FeaturedMenu({ featured, menu }: FeaturedMenuProps) {
  const [active, setActive] = useState(ALL);

  const categoryNames = useMemo(() => menu.map((c) => c.name), [menu]);

  const visible = useMemo(() => {
    if (active === ALL) {
      return featured.map((item) => ({ item, eyebrow: item.categoryName }));
    }
    const category = menu.find((c) => c.name === active);
    return (category?.items ?? []).map((item) => ({ item, eyebrow: active }));
  }, [active, featured, menu]);

  return (
    <div>
      <div className="mb-8">
        <CategoryFilter
          categories={categoryNames}
          active={active}
          onChange={setActive}
          allLabel={ALL}
        />
      </div>

      {visible.length === 0 ? (
        <p className="py-10 text-center text-sm text-stone-500">
          No hay platos publicados en esta categoría.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {visible.map(({ item, eyebrow }) => (
            <MenuCard key={item.id} item={item} eyebrow={eyebrow} />
          ))}
        </div>
      )}

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
