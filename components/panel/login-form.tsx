"use client";

import { useActionState } from "react";
import { login } from "@/app/panel/actions";
import { SubmitButton } from "@/components/panel/submit-button";

export function LoginForm() {
  const [state, formAction] = useActionState(login, null);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="password"
          className="mb-1.5 block font-mono text-xs uppercase tracking-[0.2em] text-stone-300"
        >
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-bone placeholder:text-stone-400 focus:border-terracotta focus:outline-none"
          placeholder="••••••••"
        />
      </div>

      {state && !state.ok ? (
        <p className="text-sm text-red-300">{state.error}</p>
      ) : null}

      <SubmitButton className="w-full justify-center bg-terracotta text-stone-950 hover:bg-terracotta-deep">
        Entrar
      </SubmitButton>
    </form>
  );
}
