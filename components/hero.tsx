"use client";

import Image from "next/image";
import { motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowRight } from "lucide-react";
import { site } from "@/lib/site";
import { ScaleMark } from "@/components/scale-mark";

export function Hero() {
  const reduceMotion = useReducedMotion();

  // Transform-only entrance: if the tween is throttled by a background tab and
  // never completes, the copy still reads fully (just fractionally offset)
  // rather than being stuck invisible.
  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.12, delayChildren: 0.15 },
    },
  };

  const item: Variants = {
    hidden: reduceMotion ? {} : { y: 20 },
    show: {
      y: 0,
      transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="relative flex min-h-svh flex-col justify-end overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={reduceMotion ? false : { scale: 1.06 }}
        animate={reduceMotion ? undefined : { scale: 1 }}
        transition={{ duration: 2.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src="/images/balanza-1.webp"
          alt="La fachada verde de La Balanza en la esquina de Maldonado, al atardecer"
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* soft scrim so the nav stays legible over the flames */}
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-stone-950/45 to-transparent" />
      {/* one gentle wash: darkest at the base, gone by the midpoint */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
      {/* dark backing for the text column; the grill stays bright on the right */}
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/25 to-transparent to-65%" />
      {/* forest glow at the foot */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_15%_100%,rgba(44,94,59,0.5),transparent_60%)]" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto w-full max-w-page px-5 pb-16 pt-32 [text-shadow:0_2px_28px_rgba(12,10,9,0.7)] sm:px-8 sm:pb-24"
      >
        <motion.div
          variants={item}
          className="flex items-center gap-3 text-bone/80"
        >
          <ScaleMark size={20} className="text-terracotta" />
          <span className="font-mono text-xs uppercase tracking-[0.3em]">
            Maldonado · Uruguay · Est. {site.established}
          </span>
        </motion.div>

        <h1 className="mt-6 flex max-w-3xl flex-col md:flex-row md:items-end md:gap-4">
          <motion.span
            variants={item}
            className="font-script text-4xl leading-none text-terracotta sm:text-5xl"
          >
            Simplemente
          </motion.span>
          <motion.span
            variants={item}
            className="mt-1 font-heading text-5xl font-extrabold leading-[0.9] tracking-tight text-bone sm:text-6xl lg:text-7xl md:mt-0"
          >
            La Balanza
          </motion.span>
        </h1>

        <motion.p
          variants={item}
          className="mt-6 max-w-md text-base leading-relaxed text-stone-200"
        >
          Carnes al fuego a leña, pastas caseras y más de 30 años de historia en
          la esquina de Santa Teresa y 25 de Mayo.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <a
            href="#destacados"
            className="inline-flex items-center justify-center gap-2.5 rounded-full bg-terracotta px-6 py-3.5 text-sm font-medium text-stone-950 transition-colors hover:bg-terracotta-deep"
          >
            Revisá la carta
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#parrilla"
            className="inline-flex items-center justify-center gap-2.5 rounded-full border border-bone/25 px-6 py-3.5 text-sm font-medium text-bone transition-colors hover:border-bone/60"
          >
            Conocé la parrilla
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
