export interface NavItem {
  label: string;
  href: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

/**
 * Static brand facts. Contact details and hours live in the editable store
 * (`lib/menu-store` → settings), not here.
 */
export const site = {
  name: "Parrillada La Balanza",
  shortName: "La Balanza",
  established: 1996,
  tagline: "El precio justo desde 1996",
  description:
    "Parrilla tradicional uruguaya, carnes al fuego y más de 30 años de historia en el corazón de Maldonado.",
  address: {
    line: "Av. Santa Teresa esq. 25 de Mayo",
    city: "Maldonado",
    region: "Departamento de Maldonado",
    country: "Uruguay",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=Parrillada%20La%20Balanza%20Maldonado",
  },
  delivery: {
    label: "PedidosYa",
    href: "https://www.pedidosya.com.uy/",
  },
  // Placeholder handles — reemplazá por los perfiles reales del local.
  social: [
    { label: "Instagram", href: "https://www.instagram.com/parrilladalabalanza" },
    { label: "Facebook", href: "https://www.facebook.com/parrilladalabalanza" },
  ],
  legal: [
    { label: "Privacidad", href: "/legal/privacidad" },
    { label: "Términos de uso", href: "/legal/terminos" },
    { label: "Cookies", href: "/legal/cookies" },
  ],
  nav: [
    { label: "Carta", href: "/menu" },
    { label: "Nosotros", href: "/#nosotros" },
    { label: "La parrilla", href: "/#parrilla" },
    { label: "Galería", href: "/#galeria" },
    { label: "Contacto", href: "/#contacto" },
  ] satisfies NavItem[],
} as const;

export const galleryImages: GalleryImage[] = [
  { src: "/images/balanza-1.webp", alt: "Fachada de La Balanza al atardecer, en la esquina de Maldonado", width: 680, height: 384 },
  { src: "/images/balanza-7.webp", alt: "Parrillada completa: asado, chorizo y pollo a las brasas", width: 384, height: 510 },
  { src: "/images/balanza-3.webp", alt: "Salón interior con paredes verdes y techo de madera", width: 382, height: 510 },
  { src: "/images/balanza-4.webp", alt: "Comedor con la bandera uruguaya y la barra de vinos", width: 680, height: 510 },
  { src: "/images/balanza-2.webp", alt: "Ensalada de la casa emplatada", width: 382, height: 510 },
  { src: "/images/balanza-8.webp", alt: "Bodega con el mural «la Balanza, el precio justo»", width: 680, height: 510 },
  { src: "/images/balanza-10.webp", alt: "Comedor al aire libre bajo techo de quincho", width: 382, height: 510 },
  { src: "/images/balanza-13.webp", alt: "Mesas entre plantas en el salón con quincho", width: 382, height: 510 },
  { src: "/images/balanza-15.webp", alt: "Copa y botella de Tannat-Merlot De Lucca de la casa", width: 382, height: 510 },
  { src: "/images/balanza-9.webp", alt: "Chopp tirado y botella de cerveza Patricia", width: 382, height: 510 },
  { src: "/images/balanza-12.webp", alt: "Fachada verde de La Balanza iluminada de noche", width: 680, height: 510 },
  { src: "/images/balanza-17.webp", alt: "Estatua de bronce que recibe a los comensales", width: 382, height: 510 },
  { src: "/images/balanza-11.webp", alt: "La parrilla a leña cargada de cortes sobre el fuego", width: 680, height: 458 },
  { src: "/images/balanza-5.webp", alt: "La parrilla encendida con la leña apilada debajo", width: 382, height: 510 },
  { src: "/images/balanza-18.webp", alt: "Rincón del salón con fotos enmarcadas y el certificado en la pared", width: 680, height: 510 },
  { src: "/images/balanza-6.webp", alt: "Bodega con la selección de vinos de la casa", width: 287, height: 510 },
];
