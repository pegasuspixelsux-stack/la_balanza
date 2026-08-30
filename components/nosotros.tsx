"use client";

import Image from "next/image";
import { Clock, MapPin, Phone } from "lucide-react";
import { site } from "@/lib/site";
import { Reveal } from "@/components/reveal";
import { BalanceScale } from "@/components/balance-scale";

const facts = [
  {
    icon: MapPin,
    title: "Dónde estamos",
    body: "Av. Santa Teresa esquina 25 de Mayo, Maldonado. Estacionamiento propio para clientes por calle 25 de Mayo.",
  },
  {
    icon: Clock,
    title: "Horarios",
    body: "Martes a viernes de 11:30 a 23:30. Sábados y domingos de 11:30 a 24:00. Lunes cerrado.",
  },
  {
    icon: Phone,
    title: "Reservas y pedidos",
    body: "Llamanos al 42 25 39 09 o al 098 253 909. Salón, para llevar y delivery por PedidosYa.",
  },
] as const;

export function Nosotros() {
  return (
    <section id="nosotros" className="mx-auto max-w-page px-5 py-24 sm:px-8 sm:py-32">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="flex items-center gap-3 text-terracotta">
            <span className="font-mono text-xs uppercase tracking-[0.28em]">
              Nuestra casa
            </span>
          </div>
          <h2 className="mt-4 font-display text-3xl leading-[1.1] text-bone sm:text-4xl md:text-[2.75rem]">
            Fuego y paciencia,
            <br />
            <span className="italic text-terracotta">el punto justo</span>
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-stone-400">
            Abrimos en {site.established} y desde entonces hacemos lo mismo: leña,
            brasa y tiempo. La balanza de nuestro nombre es una promesa —{" "}
            <span className="text-stone-200">el precio justo</span>, el punto
            justo, la mesa siempre lista.
          </p>

          <BalanceScale className="mt-10 h-auto w-44 text-bone/80" />
        </div>

        <div className="space-y-10">
          <Reveal className="overflow-hidden rounded-2xl border border-pine-light/30">
            <Image
              src="/images/balanza-18.webp"
              alt="Rincón del salón con fotos enmarcadas, plantas y el certificado en la pared"
              width={680}
              height={510}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="h-full w-full object-cover"
            />
          </Reveal>

          <ul className="space-y-4">
            {facts.map((fact, index) => (
              <Reveal key={fact.title} delay={index * 0.08}>
                <li className="flex gap-4 rounded-xl border border-stone-800 bg-stone-900/40 p-5 transition-colors hover:border-pine-light/50">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pine/40 text-terracotta">
                    <fact.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg text-bone">{fact.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-stone-400">
                      {fact.body}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
