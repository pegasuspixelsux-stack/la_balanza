"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  adminPassword,
  adminUser,
} from "@/lib/auth-constants";
import { createSessionToken, isAuthenticated } from "@/lib/auth";
import * as store from "@/lib/menu-store";

export type ActionResult = { ok: true } | { ok: false; error: string };

const OK: ActionResult = { ok: true };

function fail(error: string): ActionResult {
  return { ok: false, error };
}

/** Friendly message when a write fails (e.g. read-only FS with no Redis). */
function storageError(error: unknown): string {
  const msg = error instanceof Error ? error.message : String(error);
  if (/EROFS|read-only|ENOENT|EACCES|permission denied/i.test(msg)) {
    return "El almacenamiento es de solo lectura en este entorno. Conectá Upstash Redis (Vercel → Storage) para poder guardar cambios.";
  }
  return msg || "No se pudo guardar.";
}

/** Purge every surface that renders menu or settings data. */
function revalidateEverything(): void {
  revalidatePath("/panel");
  revalidatePath("/menu");
  revalidatePath("/", "layout");
}

async function guard(): Promise<ActionResult | null> {
  return (await isAuthenticated()) ? null : fail("Sesión expirada. Volvé a entrar.");
}

/* -------------------------------------------------------------------- auth */

export async function login(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult | null> {
  const user = String(formData.get("user") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (user.toLowerCase() !== adminUser().toLowerCase() || password !== adminPassword()) {
    return fail("Usuario o contraseña incorrectos.");
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  redirect("/panel");
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/panel/login");
}

/* ---------------------------------------------------------------- settings */

const settingsSchema = z.object({
  phone: z.string().trim().min(1, "Ingresá un teléfono."),
  whatsapp: z
    .string()
    .trim()
    .regex(/^\d{8,15}$/, "El WhatsApp debe ser solo números, formato internacional (ej. 59898253909)."),
  email: z.union([z.literal(""), z.string().trim().email("Email inválido.")]),
});

const hoursSchema = z
  .array(z.object({ days: z.string().trim().min(1), time: z.string().trim().min(1) }))
  .min(1, "Dejá al menos una fila de horario.");

export async function saveSettings(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return denied;

  const parsed = settingsSchema.safeParse({
    phone: formData.get("phone"),
    whatsapp: formData.get("whatsapp"),
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Datos inválidos.");
  }

  const dayValues = formData.getAll("hoursDays").map(String);
  const timeValues = formData.getAll("hoursTime").map(String);
  const rows = dayValues
    .map((days, i) => ({ days: days.trim(), time: (timeValues[i] ?? "").trim() }))
    .filter((row) => row.days || row.time);

  const hours = hoursSchema.safeParse(rows);
  if (!hours.success) {
    return fail(hours.error.issues[0]?.message ?? "Horarios inválidos.");
  }

  await store.updateSettings({ ...parsed.data, hours: hours.data });
  revalidateEverything();
  return OK;
}

const closingSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Elegí una fecha."),
  label: z.string().trim().min(1, "Describí el cierre (ej. «Feriado — cerrado»)."),
});

export async function addClosing(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return denied;

  const parsed = closingSchema.safeParse({
    date: formData.get("date"),
    label: formData.get("label"),
  });
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Datos inválidos.");
  }

  await store.addSpecialClosing(parsed.data.date, parsed.data.label);
  revalidateEverything();
  return OK;
}

export async function removeClosing(formData: FormData): Promise<void> {
  if (await guard()) return;
  await store.deleteSpecialClosing(String(formData.get("id") ?? ""));
  revalidateEverything();
}

/* -------------------------------------------------------------- categories */

const categorySchema = z.object({
  name: z.string().trim().min(1, "Ingresá un nombre.").max(60),
});

export async function createCategory(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return denied;

  const parsed = categorySchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Datos inválidos.");
  }

  await store.createCategory(parsed.data.name);
  revalidateEverything();
  return OK;
}

export async function renameCategory(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return denied;

  const id = String(formData.get("id") ?? "");
  const parsed = categorySchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Datos inválidos.");
  }

  try {
    await store.updateCategory(id, { name: parsed.data.name });
  } catch (error) {
    return fail(error instanceof Error ? error.message : "No se pudo guardar.");
  }
  revalidateEverything();
  return OK;
}

export async function toggleCategory(formData: FormData): Promise<void> {
  if (await guard()) return;
  await store.updateCategory(String(formData.get("id") ?? ""), {
    published: formData.get("published") === "true",
  });
  revalidateEverything();
}

export async function deleteCategory(formData: FormData): Promise<void> {
  if (await guard()) return;
  await store.deleteCategory(String(formData.get("id") ?? ""));
  revalidateEverything();
}

/* ------------------------------------------------------------------- items */

const itemSchema = z.object({
  name: z.string().trim().min(1, "Ingresá un nombre.").max(120),
  description: z.string().trim().max(400).optional().default(""),
  price: z.coerce.number({ message: "Precio inválido." }).min(0, "El precio no puede ser negativo."),
  categoryId: z.string().trim().min(1, "Elegí una categoría."),
  featured: z.boolean().optional().default(false),
});

function readItemForm(formData: FormData) {
  return itemSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") ?? "",
    price: formData.get("price"),
    categoryId: formData.get("categoryId"),
    featured: formData.get("featured") === "on" || formData.get("featured") === "true",
  });
}

export async function createItem(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return denied;

  const parsed = readItemForm(formData);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Datos inválidos.");
  }

  try {
    await store.createItem(parsed.data);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "No se pudo crear.");
  }
  revalidateEverything();
  return OK;
}

export async function updateItem(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const denied = await guard();
  if (denied) return denied;

  const id = String(formData.get("id") ?? "");
  const parsed = readItemForm(formData);
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Datos inválidos.");
  }

  try {
    await store.updateItem(id, parsed.data);
  } catch (error) {
    return fail(error instanceof Error ? error.message : "No se pudo guardar.");
  }
  revalidateEverything();
  return OK;
}

export async function toggleItem(formData: FormData): Promise<void> {
  if (await guard()) return;
  await store.updateItem(String(formData.get("id") ?? ""), {
    published: formData.get("published") === "true",
  });
  revalidateEverything();
}

export async function toggleFeatured(formData: FormData): Promise<void> {
  if (await guard()) return;
  await store.updateItem(String(formData.get("id") ?? ""), {
    featured: formData.get("featured") === "true",
  });
  revalidateEverything();
}

export async function deleteItem(formData: FormData): Promise<void> {
  if (await guard()) return;
  await store.deleteItem(String(formData.get("id") ?? ""));
  revalidateEverything();
}

/* ------------------------------------------------------------------ import */

const importRowSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(400).default(""),
  price: z.coerce.number().min(0),
  categoryName: z.string().trim().min(1).max(60),
  featured: z.boolean().optional(),
  published: z.boolean().optional(),
});

export type ImportResult =
  | { ok: true; itemsCreated: number; categoriesCreated: number }
  | { ok: false; error: string };

export async function importMenuItems(
  rows: unknown,
  options?: { replace?: boolean },
): Promise<ImportResult> {
  if (!(await isAuthenticated())) {
    return { ok: false, error: "Sesión expirada. Volvé a entrar." };
  }

  const parsed = z.array(importRowSchema).min(1, "No hay filas para importar.").safeParse(rows);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "El archivo tiene filas inválidas.",
    };
  }
  if (parsed.data.length > 500) {
    return { ok: false, error: "Máximo 500 platos por importación." };
  }

  try {
    const { itemsCreated, categoriesCreated } = await store.importMenuItems(
      parsed.data,
      { replace: options?.replace === true },
    );
    revalidateEverything();
    return { ok: true, itemsCreated, categoriesCreated };
  } catch (error) {
    return { ok: false, error: storageError(error) };
  }
}
