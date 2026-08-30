import { getSettings } from "@/lib/menu-store";
import { Hero } from "@/components/hero";
import { Nosotros } from "@/components/nosotros";
import { Parrilla } from "@/components/parrilla";
import { Destacados } from "@/components/destacados";
import { Galeria } from "@/components/galeria";
import { Reviews } from "@/components/reviews";
import { Contacto } from "@/components/contacto";

export default async function Home() {
  const settings = await getSettings();

  return (
    <>
      <Hero />
      <Nosotros />
      <Parrilla />
      <Destacados />
      <Galeria />
      <Reviews />
      <Contacto settings={settings} />
    </>
  );
}
