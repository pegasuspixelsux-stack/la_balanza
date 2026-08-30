"use client";

import { useState } from "react";
import type { MenuData } from "@/lib/menu-types";
import { MenuManager } from "@/components/panel/menu-manager";
import { SettingsManager } from "@/components/panel/settings-manager";
import { ImportManager } from "@/components/panel/import-manager";

type Tab = "carta" | "importar" | "configuracion";

const tabs: { id: Tab; label: string }[] = [
  { id: "carta", label: "Carta" },
  { id: "importar", label: "Importar" },
  { id: "configuracion", label: "Configuración" },
];

export function Dashboard({ data }: { data: MenuData }) {
  const [tab, setTab] = useState<Tab>("carta");

  return (
    <div>
      <div
        role="tablist"
        aria-label="Secciones del panel"
        className="flex gap-1 border-b border-stone-800"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === t.id
                ? "border-terracotta text-bone"
                : "border-transparent text-stone-400 hover:text-stone-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="pt-8">
        {tab === "carta" ? (
          <MenuManager categories={data.categories} items={data.items} />
        ) : tab === "importar" ? (
          <ImportManager />
        ) : (
          <SettingsManager settings={data.settings} />
        )}
      </div>
    </div>
  );
}
