import "server-only";
import { randomUUID } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { Redis } from "@upstash/redis";
import type {
  FeaturedItem,
  MenuCategory,
  MenuCategoryWithItems,
  MenuData,
  MenuItem,
  SiteSettings,
} from "./menu-types";
import { seedMenu } from "./menu-seed";

/**
 * Two storage backends:
 *  - Upstash Redis when `UPSTASH_REDIS_REST_URL` / `KV_REST_API_URL` are set
 *    (production on Vercel, where the filesystem is read-only)
 *  - a local JSON file otherwise (`data/menu.json`, for local dev)
 */
const REDIS_KEY = "lb:menu:v1";
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "menu.json");

const redis: Redis | null = (() => {
  const url =
    process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL ?? "";
  const token =
    process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN ?? "";
  return url && token ? new Redis({ url, token }) : null;
})();

// Serialise read-modify-write cycles so concurrent Server Actions in the same
// instance can't clobber each other.
let writeQueue: Promise<unknown> = Promise.resolve();

function byOrder<T extends { order: number }>(a: T, b: T): number {
  return a.order - b.order;
}

function normalizeData(parsed: MenuData): MenuData {
  // Tolerate data written before `settings` existed.
  parsed.settings = { ...seedMenu.settings, ...parsed.settings };
  return parsed;
}

async function load(): Promise<MenuData> {
  if (redis) {
    const stored = await redis.get<MenuData>(REDIS_KEY);
    if (stored?.categories && stored?.items) return normalizeData(stored);
    await redis.set(REDIS_KEY, seedMenu);
    return structuredClone(seedMenu);
  }

  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as MenuData;
    if (!parsed.categories || !parsed.items) throw new Error("malformed");
    return normalizeData(parsed);
  } catch {
    // No file yet (or corrupt). Try to write the seed; on a read-only
    // filesystem this fails — still serve the seed so reads work.
    try {
      await persist(seedMenu);
    } catch {
      /* read-only filesystem — writes unavailable in this environment */
    }
    return structuredClone(seedMenu);
  }
}

async function persist(data: MenuData): Promise<void> {
  if (redis) {
    await redis.set(REDIS_KEY, data);
    return;
  }
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

/** Run a mutation against the store with serialised access. */
async function mutate(fn: (data: MenuData) => void | Promise<void>): Promise<void> {
  const run = writeQueue.then(async () => {
    const data = await load();
    await fn(data);
    await persist(data);
  });
  // Keep the queue alive even if this mutation throws.
  writeQueue = run.catch(() => undefined);
  return run;
}

function nextOrder(rows: { order: number }[]): number {
  return rows.reduce((max, row) => Math.max(max, row.order), 0) + 1;
}

/* ------------------------------------------------------------------ reads */

/** Full data, including unpublished rows — for the admin panel. */
export async function getMenu(): Promise<MenuData> {
  const data = await load();
  data.categories.sort(byOrder);
  data.items.sort(byOrder);
  return data;
}

/** Contact + hours settings, editable from the panel. */
export async function getSettings(): Promise<SiteSettings> {
  const { settings } = await load();
  return settings;
}

/** Published categories with their published items — for the public menu. */
export async function getPublicMenu(): Promise<MenuCategoryWithItems[]> {
  const { categories, items } = await load();
  return categories
    .filter((c) => c.published)
    .sort(byOrder)
    .map((category) => ({
      ...category,
      items: items
        .filter((i) => i.published && i.categoryId === category.id)
        .sort(byOrder),
    }))
    .filter((category) => category.items.length > 0);
}

/** Published + featured items, each tagged with its category name. */
export async function getFeaturedItems(): Promise<FeaturedItem[]> {
  const { categories, items } = await load();
  const publishedCategoryIds = new Set(
    categories.filter((c) => c.published).map((c) => c.id),
  );
  const nameById = new Map(categories.map((c) => [c.id, c.name]));

  return items
    .filter(
      (i) => i.published && i.featured && publishedCategoryIds.has(i.categoryId),
    )
    .sort(byOrder)
    .map((item) => ({
      ...item,
      categoryName: nameById.get(item.categoryId) ?? "",
    }));
}

/* -------------------------------------------------------------- mutations */

export async function updateSettings(
  patch: Partial<Pick<SiteSettings, "phone" | "whatsapp" | "email">> & {
    hours?: SiteSettings["hours"];
  },
): Promise<void> {
  await mutate((data) => {
    Object.assign(data.settings, patch);
  });
}

export async function addSpecialClosing(
  date: string,
  label: string,
): Promise<void> {
  await mutate((data) => {
    data.settings.specialClosings.push({ id: randomUUID(), date, label });
    data.settings.specialClosings.sort((a, b) => a.date.localeCompare(b.date));
  });
}

export async function deleteSpecialClosing(id: string): Promise<void> {
  await mutate((data) => {
    data.settings.specialClosings = data.settings.specialClosings.filter(
      (c) => c.id !== id,
    );
  });
}

export async function createCategory(name: string): Promise<void> {
  await mutate((data) => {
    data.categories.push({
      id: randomUUID(),
      name,
      published: true,
      order: nextOrder(data.categories),
    });
  });
}

export async function updateCategory(
  id: string,
  patch: Partial<Pick<MenuCategory, "name" | "published">>,
): Promise<void> {
  await mutate((data) => {
    const category = data.categories.find((c) => c.id === id);
    if (!category) throw new Error("Categoría no encontrada");
    Object.assign(category, patch);
  });
}

export async function deleteCategory(id: string): Promise<void> {
  await mutate((data) => {
    data.categories = data.categories.filter((c) => c.id !== id);
    data.items = data.items.filter((i) => i.categoryId !== id);
  });
}

export async function createItem(
  input: Pick<MenuItem, "name" | "description" | "price" | "categoryId"> &
    Partial<Pick<MenuItem, "featured" | "published">>,
): Promise<void> {
  await mutate((data) => {
    if (!data.categories.some((c) => c.id === input.categoryId)) {
      throw new Error("La categoría seleccionada no existe");
    }
    data.items.push({
      id: randomUUID(),
      name: input.name,
      description: input.description,
      price: input.price,
      categoryId: input.categoryId,
      featured: input.featured ?? false,
      published: input.published ?? true,
      order: nextOrder(data.items),
    });
  });
}

export async function updateItem(
  id: string,
  patch: Partial<
    Pick<
      MenuItem,
      "name" | "description" | "price" | "categoryId" | "featured" | "published"
    >
  >,
): Promise<void> {
  await mutate((data) => {
    const item = data.items.find((i) => i.id === id);
    if (!item) throw new Error("Plato no encontrado");
    if (
      patch.categoryId &&
      !data.categories.some((c) => c.id === patch.categoryId)
    ) {
      throw new Error("La categoría seleccionada no existe");
    }
    Object.assign(item, patch);
  });
}

export async function deleteItem(id: string): Promise<void> {
  await mutate((data) => {
    data.items = data.items.filter((i) => i.id !== id);
  });
}

export interface ImportRow {
  name: string;
  description: string;
  price: number;
  categoryName: string;
  featured?: boolean;
  published?: boolean;
}

/**
 * Bulk-create items from a parsed spreadsheet. Categories are matched by name
 * (case/accent-insensitive) and created on the fly when missing.
 */
export async function importMenuItems(
  rows: ImportRow[],
  { replace = false }: { replace?: boolean } = {},
): Promise<{ itemsCreated: number; categoriesCreated: number }> {
  let itemsCreated = 0;
  let categoriesCreated = 0;

  const normalize = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .replace(/[áàäâ]/g, "a")
      .replace(/[éèëê]/g, "e")
      .replace(/[íìïî]/g, "i")
      .replace(/[óòöô]/g, "o")
      .replace(/[úùüû]/g, "u")
      .replace(/ñ/g, "n");

  await mutate((data) => {
    if (replace) {
      data.categories = [];
      data.items = [];
    }

    const catByName = new Map(
      data.categories.map((c) => [normalize(c.name), c] as const),
    );

    for (const row of rows) {
      const key = normalize(row.categoryName);
      let category = catByName.get(key);
      if (!category) {
        category = {
          id: randomUUID(),
          name: row.categoryName.trim(),
          published: true,
          order: nextOrder(data.categories),
        };
        data.categories.push(category);
        catByName.set(key, category);
        categoriesCreated += 1;
      }

      data.items.push({
        id: randomUUID(),
        name: row.name.trim(),
        description: row.description.trim(),
        price: row.price,
        categoryId: category.id,
        featured: row.featured ?? false,
        published: row.published ?? true,
        order: nextOrder(data.items),
      });
      itemsCreated += 1;
    }
  });

  return { itemsCreated, categoriesCreated };
}
