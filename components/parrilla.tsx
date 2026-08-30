"use client";

import Image from "next/image";
import { Car, Flame, Leaf, Truck, Utensils, Wheat } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

const offerings = [
  { icon: Flame, label: "Parrilla a leña", note: "Achuras, tira y cortes al fuego" },
  { icon: Utensils, label: "Pastas caseras", note: "Sorrentinos, canelones y ravioles" },
  { icon: Leaf, label: "Opciones vegetarianas", note: "Platos y guarniciones sin carne" },
  { icon: Wheat, label: "Menú sin TACC", note: "Alternativas para celíacos" },
  { icon: Car, label: "Estacionamiento propio", note: "Por calle 25 de Mayo" },
  { icon: Truck, label: "Delivery y para llevar", note: "A domicilio por PedidosYa" },
];

export function Parrilla() {
  return (
    <section id="parrilla" className="relative overflow-hidden border-y border-forest-deep/60 bg-forest/25">
      <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_80%_0%,rgba(0,255,102,0.1),transparent_65%)]" />
      <div className="relative mx-auto grid max-w-page gap-12 px-5 py-24 sm:px-8 sm:py-32 lg:grid-cols-2 lg:items-center lg:gap-16">
        <Reveal className="order-2 overflow-hidden rounded-2xl border border-stone-800 lg:order-1">
          <Image
            src="/images/balanza-5.webp"
            alt="La parrilla encendida con la leña apilada debajo"
            width={382}
            height={510}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="h-full w-full object-cover"
          />
        </Reveal>

        <div className="order-1 lg:order-2">
          <SectionHeading
            eyebrow="La parrilla"
            title={
              <>
                Al fuego,
                <br />
                como el primer día
              </>
            }
            intro="Encendemos con leña y esperamos la brasa. Lo demás es oficio: el asador atento, el punto cuidado y una carta que también tiene lugar para quienes no comen carne."
          />

          <ul className="mt-9 grid gap-x-6 gap-y-5 sm:grid-cols-2">
            {offerings.map((item, index) => (
              <Reveal key={item.label} delay={index * 0.06}>
                <li className="flex gap-3">
                  <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-terracotta" />
                  <div>
                    <p className="text-sm font-medium text-bone">{item.label}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-stone-500">
                      {item.note}
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
