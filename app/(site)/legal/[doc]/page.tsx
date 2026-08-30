import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSettings } from "@/lib/menu-store";

const docs = {
  privacidad: {
    title: "Política de privacidad",
    intro:
      "Cómo tratamos los datos que nos compartís al reservar, pedir o contactarnos.",
  },
  terminos: {
    title: "Términos de uso",
    intro: "Condiciones para el uso de este sitio y de la carta digital.",
  },
  cookies: {
    title: "Política de cookies",
    intro: "Qué cookies usa este sitio y para qué.",
  },
} as const;

type DocKey = keyof typeof docs;

export function generateStaticParams() {
  return Object.keys(docs).map((doc) => ({ doc }));
}

export async function generateMetadata({
  params,
}: PageProps<"/legal/[doc]">): Promise<Metadata> {
  const { doc } = await params;
  const entry = docs[doc as DocKey];
  return { title: entry?.title ?? "Legal", robots: { index: false } };
}

export default async function LegalPage({ params }: PageProps<"/legal/[doc]">) {
  const { doc } = await params;
  const entry = docs[doc as DocKey];
  if (!entry) notFound();

  const settings = await getSettings();

  return (
    <article className="mx-auto max-w-2xl px-5 pb-24 pt-32 sm:px-8">
      <h1 className="font-display text-3xl text-bone sm:text-4xl">{entry.title}</h1>
      <p className="mt-4 text-stone-400">{entry.intro}</p>

      <div className="mt-10 rounded-xl border border-stone-800 bg-stone-900/40 p-6 text-sm leading-relaxed text-stone-400">
        <p>
          El texto completo de esta política está en preparación. Mientras tanto,
          si tenés una consulta sobre tus datos o el uso del sitio, escribinos a{" "}
          {settings.email ? (
            <a
              href={`mailto:${settings.email}`}
              className="text-terracotta hover:text-bone"
            >
              {settings.email}
            </a>
          ) : (
            <span className="text-stone-300">nuestro correo de contacto</span>
          )}{" "}
          o llamá al {settings.phone}.
        </p>
      </div>
    </article>
  );
}
