import { getFeaturedItems } from "@/lib/menu-store";
import { SectionHeading } from "@/components/section-heading";
import { FeaturedMenu } from "@/components/menu/featured-menu";

export async function Destacados() {
  const items = await getFeaturedItems();
  if (items.length === 0) return null;

  return (
    <section id="destacados" className="mx-auto max-w-page px-5 py-24 sm:px-8 sm:py-32">
      <SectionHeading
        eyebrow="La carta"
        title="Destacados de la parrilla"
        intro="Una selección de la casa. Armá tu pedido y envialo por WhatsApp, o pasá a verlo entero."
        align="center"
      />
      <div className="mx-auto mt-14 max-w-[1000px]">
        <FeaturedMenu items={items} />
      </div>
    </section>
  );
}
