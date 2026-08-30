"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Pencil, Plus, Star, X } from "lucide-react";
import type { MenuCategory, MenuItem } from "@/lib/menu-types";
import { formatPrice } from "@/lib/format";
import {
  type ActionResult,
  createCategory,
  createItem,
  deleteCategory,
  deleteItem,
  renameCategory,
  toggleCategory,
  toggleFeatured,
  toggleItem,
  updateItem,
} from "@/app/panel/actions";
import { SubmitButton } from "@/components/panel/submit-button";
import { ConfirmButton } from "@/components/panel/confirm-button";

interface MenuManagerProps {
  categories: MenuCategory[];
  items: MenuItem[];
}

const inputClass =
  "w-full rounded-lg border border-stone-700 bg-stone-900 px-3 py-2 text-sm text-bone placeholder:text-stone-500 focus:border-terracotta focus:outline-none";
const labelClass =
  "mb-1 block font-mono text-[0.7rem] uppercase tracking-[0.15em] text-stone-400";

function pill(active: boolean): string {
  return `rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
    active
      ? "bg-terracotta/20 text-terracotta hover:bg-terracotta/30"
      : "bg-stone-800 text-stone-400 hover:bg-stone-700"
  }`;
}

function Feedback({ state }: { state: ActionResult | null }) {
  if (!state || state.ok) return null;
  return <p className="mt-2 text-xs text-red-300">{state.error}</p>;
}

/* --------------------------------------------------------------- categories */

function AddCategoryForm() {
  const [state, action] = useActionState<ActionResult | null, FormData>(
    createCategory,
    null,
  );
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <form ref={ref} action={action} className="flex flex-wrap items-end gap-2">
      <div className="flex-1">
        <label htmlFor="new-category" className={labelClass}>
          Nueva categoría
        </label>
        <input
          id="new-category"
          name="name"
          required
          maxLength={60}
          className={inputClass}
          placeholder="Ej. Entradas"
        />
      </div>
      <SubmitButton className="bg-stone-100 text-stone-900 hover:bg-white">
        <Plus className="h-4 w-4" />
        Agregar
      </SubmitButton>
      <div className="w-full">
        <Feedback state={state} />
      </div>
    </form>
  );
}

function CategoryRow({ category }: { category: MenuCategory }) {
  const [editing, setEditing] = useState(false);
  const [state, action] = useActionState<ActionResult | null, FormData>(
    renameCategory,
    null,
  );

  useEffect(() => {
    if (state?.ok) setEditing(false);
  }, [state]);

  return (
    <li className="flex flex-wrap items-center gap-2 rounded-lg border border-stone-800 bg-stone-900/40 px-3 py-2">
      {editing ? (
        <form action={action} className="flex flex-1 items-center gap-2">
          <input type="hidden" name="id" value={category.id} />
          <input
            name="name"
            defaultValue={category.name}
            required
            maxLength={60}
            className={inputClass}
            autoFocus
          />
          <SubmitButton className="bg-stone-100 text-stone-900 hover:bg-white">
            Guardar
          </SubmitButton>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="text-stone-400 hover:text-bone"
            aria-label="Cancelar"
          >
            <X className="h-4 w-4" />
          </button>
        </form>
      ) : (
        <>
          <span className="flex-1 font-medium text-bone">{category.name}</span>

          <form action={toggleCategory}>
            <input type="hidden" name="id" value={category.id} />
            <input type="hidden" name="published" value={String(!category.published)} />
            <button type="submit" className={pill(category.published)}>
              {category.published ? "Publicada" : "Oculta"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-md p-1.5 text-stone-400 hover:bg-stone-800 hover:text-bone"
            aria-label={`Renombrar ${category.name}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>

          <form action={deleteCategory}>
            <input type="hidden" name="id" value={category.id} />
            <ConfirmButton confirmLabel="Borrar categoría y sus platos">
              Eliminar
            </ConfirmButton>
          </form>
        </>
      )}
      {!editing ? null : (
        <div className="w-full">
          <Feedback state={state} />
        </div>
      )}
    </li>
  );
}

/* -------------------------------------------------------------------- items */

function ItemFields({
  categories,
  item,
}: {
  categories: MenuCategory[];
  item?: MenuItem;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label className={labelClass}>Nombre</label>
        <input
          name="name"
          required
          maxLength={120}
          defaultValue={item?.name}
          className={inputClass}
        />
      </div>
      <div className="sm:col-span-2">
        <label className={labelClass}>Descripción</label>
        <textarea
          name="description"
          rows={2}
          maxLength={400}
          defaultValue={item?.description}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Precio ($)</label>
        <input
          name="price"
          type="number"
          min={0}
          step={10}
          required
          defaultValue={item?.price}
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Categoría</label>
        <select
          name="categoryId"
          required
          defaultValue={item?.categoryId ?? ""}
          className={inputClass}
        >
          <option value="" disabled>
            Elegí una…
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm text-stone-300 sm:col-span-2">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={item?.featured}
          className="h-4 w-4 accent-terracotta"
        />
        Mostrar en “Destacados” de la página principal
      </label>
    </div>
  );
}

function AddItemForm({ categories }: { categories: MenuCategory[] }) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState<ActionResult | null, FormData>(
    createItem,
    null,
  );
  const ref = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) {
      ref.current?.reset();
      setOpen(false);
    }
  }, [state]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={categories.length === 0}
        className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-900 hover:bg-white disabled:opacity-50"
      >
        <Plus className="h-4 w-4" />
        Agregar plato
      </button>
    );
  }

  return (
    <form
      ref={ref}
      action={action}
      className="rounded-xl border border-stone-800 bg-stone-900/60 p-4"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="font-display text-sm text-bone">Nuevo plato</span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-stone-400 hover:text-bone"
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <ItemFields categories={categories} />
      <Feedback state={state} />
      <div className="mt-4">
        <SubmitButton className="bg-terracotta text-stone-950 hover:bg-terracotta-deep">
          Crear plato
        </SubmitButton>
      </div>
    </form>
  );
}

function ItemRow({
  item,
  categories,
}: {
  item: MenuItem;
  categories: MenuCategory[];
}) {
  const [editing, setEditing] = useState(false);
  const [state, action] = useActionState<ActionResult | null, FormData>(
    updateItem,
    null,
  );

  useEffect(() => {
    if (state?.ok) setEditing(false);
  }, [state]);

  if (editing) {
    return (
      <li className="rounded-xl border border-stone-700 bg-stone-900/60 p-4">
        <form action={action}>
          <input type="hidden" name="id" value={item.id} />
          <ItemFields categories={categories} item={item} />
          <Feedback state={state} />
          <div className="mt-4 flex gap-2">
            <SubmitButton className="bg-terracotta text-stone-950 hover:bg-terracotta-deep">
              Guardar
            </SubmitButton>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-full px-4 py-2.5 text-sm text-stone-400 hover:text-bone"
            >
              Cancelar
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-stone-800 bg-stone-900/40 px-3 py-2.5">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-bone">
          {item.name}
          {!item.published ? (
            <span className="ml-2 text-xs text-stone-500">(oculto)</span>
          ) : null}
        </p>
        <p className="font-mono text-xs text-stone-400">{formatPrice(item.price)}</p>
      </div>

      <form action={toggleFeatured}>
        <input type="hidden" name="id" value={item.id} />
        <input type="hidden" name="featured" value={String(!item.featured)} />
        <button
          type="submit"
          aria-label={item.featured ? "Quitar de destacados" : "Marcar como destacado"}
          className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
            item.featured
              ? "text-amber-400 hover:bg-stone-800"
              : "text-stone-600 hover:bg-stone-800 hover:text-stone-300"
          }`}
        >
          <Star className="h-4 w-4" fill={item.featured ? "currentColor" : "none"} />
        </button>
      </form>

      <form action={toggleItem}>
        <input type="hidden" name="id" value={item.id} />
        <input type="hidden" name="published" value={String(!item.published)} />
        <button type="submit" className={pill(item.published)}>
          {item.published ? "Publicado" : "Oculto"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => setEditing(true)}
        className="rounded-md p-1.5 text-stone-400 hover:bg-stone-800 hover:text-bone"
        aria-label={`Editar ${item.name}`}
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>

      <form action={deleteItem}>
        <input type="hidden" name="id" value={item.id} />
        <ConfirmButton confirmLabel="Borrar plato">Eliminar</ConfirmButton>
      </form>
    </li>
  );
}

/* ------------------------------------------------------------------- export */

export function MenuManager({ categories, items }: MenuManagerProps) {
  const grouped = categories.map((category) => ({
    category,
    items: items.filter((i) => i.categoryId === category.id),
  }));
  const orphans = items.filter(
    (i) => !categories.some((c) => c.id === i.categoryId),
  );

  return (
    <div className="space-y-12">
      <section>
        <h2 className="mb-3 font-display text-lg text-bone">Categorías</h2>
        <div className="mb-4">
          <AddCategoryForm />
        </div>
        <ul className="space-y-2">
          {categories.map((category) => (
            <CategoryRow key={category.id} category={category} />
          ))}
        </ul>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg text-bone">Platos</h2>
          <AddItemForm categories={categories} />
        </div>

        {categories.length === 0 ? (
          <p className="text-sm text-stone-500">
            Creá una categoría antes de agregar platos.
          </p>
        ) : (
          <div className="space-y-8">
            {grouped.map(({ category, items: catItems }) => (
              <div key={category.id}>
                <h3 className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-stone-500">
                  {category.name}
                </h3>
                {catItems.length === 0 ? (
                  <p className="text-sm text-stone-600">Sin platos todavía.</p>
                ) : (
                  <ul className="space-y-2">
                    {catItems.map((item) => (
                      <ItemRow key={item.id} item={item} categories={categories} />
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {orphans.length > 0 ? (
              <div>
                <h3 className="mb-2 font-mono text-xs uppercase tracking-[0.18em] text-red-400">
                  Sin categoría
                </h3>
                <ul className="space-y-2">
                  {orphans.map((item) => (
                    <ItemRow key={item.id} item={item} categories={categories} />
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )}
      </section>
    </div>
  );
}
