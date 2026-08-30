"use client";

import Image from "next/image";
import { ArrowUpRight, CalendarOff, MapPin, MessageCircle, Phone } from "lucide-react";
import type { SiteSettings } from "@/lib/menu-types";
import { site } from "@/lib/site";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

export function Contacto({ settings }: { settings: SiteSettings }) {
  const waHref = `https://wa.me/${settings.whatsapp}`;

  return (
    <section id="contacto" className="mx-auto max-w-page px-5 py-24 sm:px-8 sm:py-32">
      <SectionHeading
        eyebrow="Contacto"
        title="Te esperamos en Maldonado"
        intro="Reservá tu mesa por teléfono o pedí a domicilio. Los fines de semana conviene reservar con tiempo."
      />

      <div className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        <Reveal className="space-y-8">
          <div className="flex gap-4">
            <MapPin className="mt-1 h-5 w-5 shrink-0 text-terracotta" />
            <div>
              <p className="text-bone">{site.address.line}</p>
              <p className="text-sm text-stone-400">
                {site.address.city}, {site.address.country}
              </p>
              <a
                href={site.address.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-sm text-terracotta hover:text-bone"
              >
                Cómo llegar
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <div className="flex gap-4">
            <Phone className="mt-1 h-5 w-5 shrink-0 text-terracotta" />
            <div className="space-y-1 text-bone">
              <p>{settings.phone}</p>
              {settings.email ? (
                <a
                  href={`mailto:${settings.email}`}
                  className="block text-sm text-stone-400 hover:text-bone"
                >
                  {settings.email}
                </a>
              ) : null}
            </div>
          </div>

          <dl className="border-t border-stone-800 pt-6">
            {settings.hours.map((row) => (
              <div
                key={row.days}
                className="flex items-baseline justify-between border-b border-stone-800/60 py-3 last:border-b-0"
              >
                <dt className="text-sm text-stone-300">{row.days}</dt>
                <dd className="font-mono text-sm text-bone">{row.time}</dd>
              </div>
            ))}
          </dl>

          {settings.specialClosings.length > 0 ? (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
              <p className="flex items-center gap-2 text-sm font-medium text-amber-300">
                <CalendarOff className="h-4 w-4" />
                Cierres especiales
              </p>
              <ul className="mt-2 space-y-1 text-sm text-stone-300">
                {settings.specialClosings.map((closing) => (
                  <li key={closing.id}>
                    <span className="font-mono text-xs text-stone-400">
                      {closing.date}
                    </span>{" "}
                    — {closing.label}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </Reveal>

        <Reveal delay={0.08} className="flex flex-col gap-5">
          <div className="overflow-hidden rounded-2xl border border-stone-800">
            <Image
              src="/images/balanza-1.webp"
              alt="La esquina de La Balanza al atardecer"
              width={680}
              height={384}
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="rounded-2xl border border-pine-light/30 bg-pine/20 p-6">
            <p className="font-display text-lg text-bone">Pedí a domicilio</p>
            <p className="mt-1 text-sm text-stone-400">
              Armá tu pedido desde la carta y envialo por WhatsApp, o pedí por{" "}
              {site.delivery.label}.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-2.5 text-sm font-medium text-stone-950 transition-colors hover:bg-terracotta-deep"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              <a
                href={site.delivery.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-amber-500 px-5 py-2.5 text-sm font-medium text-stone-950 transition-colors hover:bg-amber-400"
              >
                {site.delivery.label}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
