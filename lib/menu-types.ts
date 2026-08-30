export interface MenuCategory {
  id: string;
  name: string;
  published: boolean;
  order: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  /** Price in Uruguayan pesos. */
  price: number;
  categoryId: string;
  /** Surfaced in the "Destacados" section on the landing page. */
  featured: boolean;
  published: boolean;
  order: number;
}

export interface OpeningHours {
  /** e.g. "Martes a viernes" */
  days: string;
  /** e.g. "11:30 – 23:30" or "Cerrado" */
  time: string;
}

export interface SpecialClosing {
  id: string;
  /** ISO date, e.g. "2026-05-01" */
  date: string;
  /** e.g. "1º de Mayo — cerrado todo el día" */
  label: string;
}

export interface SiteSettings {
  phone: string;
  /** Digits only, international format (no +), e.g. "59898253909" — used for wa.me links. */
  whatsapp: string;
  email: string;
  hours: OpeningHours[];
  specialClosings: SpecialClosing[];
}

export interface MenuData {
  settings: SiteSettings;
  categories: MenuCategory[];
  items: MenuItem[];
}

/** A category with its items attached — the shape the public views consume. */
export interface MenuCategoryWithItems extends MenuCategory {
  items: MenuItem[];
}

/** A featured item paired with the name of its category. */
export interface FeaturedItem extends MenuItem {
  categoryName: string;
}
