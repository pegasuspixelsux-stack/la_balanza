import { getMenu } from "@/lib/menu-store";
import { Dashboard } from "@/components/panel/dashboard";

export const dynamic = "force-dynamic";

export default async function PanelPage() {
  const data = await getMenu();

  return (
    <>
      <h1 className="font-display text-2xl text-bone">Gestión</h1>
      <p className="mt-1 text-sm text-stone-400">
        Los cambios se publican al instante en la carta y en la página principal.
      </p>
      <div className="mt-8">
        <Dashboard data={data} />
      </div>
    </>
  );
}
