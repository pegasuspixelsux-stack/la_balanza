import { getMenu } from "@/lib/menu-store";
import { Dashboard } from "@/components/panel/dashboard";

export const dynamic = "force-dynamic";

export default async function PanelPage() {
  const data = await getMenu();

  const publishedItems = data.items.filter((i) => i.published).length;
  const publishedCategories = data.categories.filter((c) => c.published).length;
  const featured = data.items.filter((i) => i.featured && i.published).length;

  const stats = [
    { label: "Platos", value: data.items.length, note: `${publishedItems} publicados` },
    {
      label: "Categorías",
      value: data.categories.length,
      note: `${publishedCategories} publicadas`,
    },
    { label: "Destacados", value: featured, note: "en la portada" },
  ];

  return (
    <>
      <h1 className="font-display text-2xl text-bone">Gestión</h1>
      <p className="mt-1 text-sm text-stone-400">
        Los cambios se publican al instante en la carta y en la página principal.
      </p>

      <dl className="mt-6 grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-stone-800 bg-stone-900/40 px-4 py-3"
          >
            <dt className="font-mono text-[0.7rem] uppercase tracking-[0.15em] text-stone-500">
              {stat.label}
            </dt>
            <dd className="mt-1 font-display text-2xl text-bone">{stat.value}</dd>
            <dd className="text-xs text-stone-500">{stat.note}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8">
        <Dashboard data={data} />
      </div>
    </>
  );
}
