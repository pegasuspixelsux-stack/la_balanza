import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPublicMenu, getSettings } from "@/lib/menu-store";
import { MenuBrowser } from "@/components/menu/menu-browser";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Menú",
  description:
    "La carta de Parrillada La Balanza: parrilla a leña, minutas, pastas caseras y postres.",
};

export default async function MenuPage() {
  const [menu, settings] = await Promise.all([getPublicMenu(), getSettings()]);

  return (
    <div className="mx-auto max-w-[1000px] px-5 pb-16 pt-32 sm:px-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-stone-400 transition-colors hover:text-neon"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al sitio
      </Link>

      <header className="mb-12 mt-6 text-center">
        <span className="font-mono text-xs uppercase tracking-[0.28em] text-terracotta">
          Parrillada La Balanza
        </span>
        <h1 className="mt-3 font-display text-4xl text-bone">La carta</h1>
        <p className="mt-3 text-sm text-stone-400">
          Precios en pesos uruguayos. Consultá por opciones vegetarianas y sin TACC.
        </p>
      </header>

      {menu.length === 0 ? (
        <p className="py-16 text-center text-sm text-stone-500">
          Estamos actualizando la carta. Volvé en un rato.
        </p>
      ) : (
        <MenuBrowser menu={menu} whatsapp={settings.whatsapp} />
      )}
    </div>
  );
}
