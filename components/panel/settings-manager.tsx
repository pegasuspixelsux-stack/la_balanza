"use client";

import { useActionState, useEffect, useState } from "react";
import { Check, Plus, Trash2, X } from "lucide-react";
import type { SiteSettings } from "@/lib/menu-types";
import {
  type ActionResult,
  addClosing,
  removeClosing,
  saveSettings,
} from "@/app/panel/actions";
import { SubmitButton } from "@/components/panel/submit-button";

const inputClass =
  "w-full rounded-lg border border-stone-700 bg-stone-900 px-3 py-2 text-sm text-bone placeholder:text-stone-500 focus:border-terracotta focus:outline-none";
const labelClass =
  "mb-1 block font-mono text-[0.7rem] uppercase tracking-[0.15em] text-stone-400";

function Feedback({ state }: { state: ActionResult | null }) {
  if (!state) return null;
  return state.ok ? (
    <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-emerald-400">
      <Check className="h-3.5 w-3.5" /> Guardado
    </p>
  ) : (
    <p className="mt-2 text-xs text-red-300">{state.error}</p>
  );
}

export function SettingsManager({ settings }: { settings: SiteSettings }) {
  const [contactState, contactAction] = useActionState<ActionResult | null, FormData>(
    saveSettings,
    null,
  );
  const [closingState, closingAction] = useActionState<ActionResult | null, FormData>(
    addClosing,
    null,
  );

  const [hours, setHours] = useState(settings.hours);

  // Re-sync local hours if the server data changes under us (after a save).
  useEffect(() => {
    setHours(settings.hours);
  }, [settings.hours]);

  return (
    <div className="space-y-12">
      <section>
        <h2 className="mb-1 font-display text-lg text-bone">Contacto y horarios</h2>
        <p className="mb-4 text-sm text-stone-400">
          Se muestran en la página principal, el pie de página y el botón de pedidos.
        </p>

        <form action={contactAction} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="phone" className={labelClass}>
                Teléfono
              </label>
              <input
                id="phone"
                name="phone"
                defaultValue={settings.phone}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="whatsapp" className={labelClass}>
                WhatsApp (solo números, formato internacional)
              </label>
              <input
                id="whatsapp"
                name="whatsapp"
                defaultValue={settings.whatsapp}
                inputMode="numeric"
                placeholder="59898253909"
                required
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={settings.email}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <span className={labelClass}>Horarios de atención</span>
            <div className="space-y-2">
              {hours.map((row, index) => (
                <div key={index} className="flex flex-wrap items-center gap-2">
                  <input
                    name="hoursDays"
                    defaultValue={row.days}
                    placeholder="Martes a viernes"
                    className={`${inputClass} flex-1`}
                  />
                  <input
                    name="hoursTime"
                    defaultValue={row.time}
                    placeholder="11:30 – 23:30"
                    className={`${inputClass} flex-1`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setHours((rows) => rows.filter((_, i) => i !== index))
                    }
                    className="rounded-md p-2 text-stone-400 hover:bg-stone-800 hover:text-red-300"
                    aria-label="Quitar fila de horario"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setHours((rows) => [...rows, { days: "", time: "" }])
              }
              className="mt-2 inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-bone"
            >
              <Plus className="h-3.5 w-3.5" />
              Agregar fila
            </button>
          </div>

          <div>
            <SubmitButton className="bg-terracotta text-stone-950 hover:bg-terracotta-deep">
              Guardar cambios
            </SubmitButton>
            <Feedback state={contactState} />
          </div>
        </form>
      </section>

      <section>
        <h2 className="mb-1 font-display text-lg text-bone">Cierres especiales</h2>
        <p className="mb-4 text-sm text-stone-400">
          Feriados o días puntuales en que el local no abre. Se muestran como aviso
          en la página.
        </p>

        {settings.specialClosings.length > 0 ? (
          <ul className="mb-4 space-y-2">
            {settings.specialClosings.map((closing) => (
              <li
                key={closing.id}
                className="flex items-center gap-3 rounded-lg border border-stone-800 bg-stone-900/40 px-3 py-2"
              >
                <span className="font-mono text-xs text-stone-400">
                  {closing.date}
                </span>
                <span className="flex-1 text-sm text-bone">{closing.label}</span>
                <form action={removeClosing}>
                  <input type="hidden" name="id" value={closing.id} />
                  <button
                    type="submit"
                    className="rounded-md p-1.5 text-stone-400 hover:bg-stone-800 hover:text-red-300"
                    aria-label="Eliminar cierre"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </form>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-4 text-sm text-stone-600">No hay cierres cargados.</p>
        )}

        <form action={closingAction} className="flex flex-wrap items-end gap-2">
          <div>
            <label htmlFor="closing-date" className={labelClass}>
              Fecha
            </label>
            <input
              id="closing-date"
              name="date"
              type="date"
              required
              className={inputClass}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="closing-label" className={labelClass}>
              Detalle
            </label>
            <input
              id="closing-label"
              name="label"
              required
              placeholder="1º de Mayo — cerrado"
              className={inputClass}
            />
          </div>
          <SubmitButton className="bg-stone-100 text-stone-900 hover:bg-white">
            <Plus className="h-4 w-4" />
            Agregar
          </SubmitButton>
          <div className="w-full">
            <Feedback state={closingState} />
          </div>
        </form>
      </section>
    </div>
  );
}
