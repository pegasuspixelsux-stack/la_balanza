"use client";

import { useMemo, useState } from "react";
import type { MenuCategoryWithItems } from "@/lib/menu-types";
import { CategoryFilter } from "@/components/menu/category-filter";
import { MenuCard } from "@/components/menu/menu-card";
import { OrderBar } from "@/components/menu/order-bar";

interface MenuBrowserProps {
  menu: MenuCategoryWithItems[];
  whatsapp: string;
}

const ALL = "Todo";

export function MenuBrowser({ menu, whatsapp }: MenuBrowserProps) {
  const [active, setActive] = useState(ALL);
  const categoryNames = useMemo(() => menu.map((c) => c.name), [menu]);

  const visible =
    active === ALL ? menu : menu.filter((category) => category.name === active);

  return (
    <>
      <div className="mb-10">
        <CategoryFilter
          categories={categoryNames}
          active={active}
          onChange={setActive}
          allLabel={ALL}
        />
      </div>

      {visible.length === 0 ? (
        <p className="py-16 text-center text-sm text-stone-500">
          No hay platos disponibles en esta categoría.
        </p>
      ) : (
        <div className="space-y-12 pb-28">
          {visible.map((category) => (
            <section key={category.id}>
              <h2 className="mb-4 font-display text-xl text-bone">
                {category.name}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {category.items.map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <OrderBar whatsapp={whatsapp} />
    </>
  );
}
