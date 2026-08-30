import "server-only";
import { randomUUID } from "node:crypto";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
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
 * Local JSON file storage — no external services.
 *
 *  - `data/menu.json` (committed to the repo) is the source of truth and is
 *    always readable, including on Vercel.
 *  - Writes go to `data/menu.json` locally. On Vercel the bundle is read-only,
 *    so writes land in a temp file that the same warm instance reads back —
 *    edits are live but not durable across cold starts. Use Exportar in the
 *    panel to download the updated file and commit it for a permanent change.
 */
const IS_SERVERLESS = Boolean(process.env.VERCEL || process.env.AWS_REGION);
const REPO_FILE = path.join(process.cwd(), "data", "menu.json");
const RUNTIME_FILE = IS_SERVERLESS
  ? path.join(os.tmpdir(), "la-balanza-menu.json")
  : REPO_FILE;

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

async function readFrom(file: string): Promise<MenuData | null> {
  try {
    const parsed = JSON.parse(await readFile(file, "utf8")) as MenuData;
    if (!parsed.categories || !parsed.items) return null;
    return normalizeData(parsed);
  } catch {
    return null;
  }
}

async function load(): Promise<MenuData> {
  // Prefer runtime writes, then the committed file, then the built-in seed.
  const runtime = await readFrom(RUNTIME_FILE);
  if (runtime) return runtime;

  if (RUNTIME_FILE !== REPO_FILE) {
    const repo = await readFrom(REPO_FILE);
    if (repo) return repo;
  }

  try {
    await persist(seedMenu);
  } catch {
    /* read-only environment — reads still work from the seed */
  }
  return structuredClone(seedMenu);
}

async function persist(data: MenuData): Promise<void> {
  await mkdir(path.dirname(RUNTIME_FILE), { recursive: true });
  await writeFile(
    RUNTIME_FILE,
    `${JSON.stringify(data, null, 2)}\n`,
    "utf8",
  );
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

/** True when this environment can persist writes durably (local dev). */
export const storageIsDurable = !IS_SERVERLESS;

/* ------------------------------------------------------------------ reads */

/** Full data, including unpublished rows — for the admin panel. */
export async function getMenu(): Promise<MenuData> {
  const data = await load();
  data.categories.sort(byOrder);
  data.items.sort(byOrder);
  return data;
}

/** Pretty JSON of the whole store — for the Exportar button. */
export async function exportMenu(): Promise<string> {
  return `${JSON.stringify(await getMenu(), null, 2)}\n`;
}

/** Replace the entire store (JSON import). */
export async function replaceMenu(next: {
  settings?: Partial<SiteSettings>;
  categories: MenuCategory[];
  items: MenuItem[];
}): Promise<void> {
  await mutate((data) => {
    data.settings = { ...seedMenu.settings, ...next.settings };
    data.categories = next.categories.map((c, i) => ({
      ...c,
      order: c.order ?? i + 1,
    }));
    data.items = next.items.map((it, i) => ({ ...it, order: it.order ?? i + 1 }));
  });
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
