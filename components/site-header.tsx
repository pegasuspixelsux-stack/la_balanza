"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, Phone, X } from "lucide-react";
import { site } from "@/lib/site";
import { ScaleMark } from "@/components/scale-mark";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || menuOpen
          ? "border-b border-stone-800/80 bg-stone-950/85 backdrop-blur"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-page items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-bone"
          onClick={() => setMenuOpen(false)}
        >
          <ScaleMark size={26} className="text-terracotta" />
          <span className="font-display text-lg tracking-wide">
            La Balanza
          </span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative font-sans text-sm text-stone-300 transition-colors hover:text-bone"
            >
              {item.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-terracotta transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/#contacto"
            className="hidden items-center gap-2 rounded-full border border-stone-700 px-4 py-2 text-sm text-bone transition-colors hover:border-terracotta hover:text-terracotta sm:inline-flex"
          >
            <Phone className="h-3.5 w-3.5" />
            Reservas
          </Link>
          <button
            type="button"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-bone md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.nav
            key="mobile-menu"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, height: "auto" }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-stone-800/80 bg-stone-950/95 md:hidden"
          >
            <ul className="flex flex-col px-5 py-2 sm:px-8">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block border-b border-stone-800/60 py-4 font-display text-xl text-bone last:border-b-0"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/#contacto"
                  onClick={() => setMenuOpen(false)}
                  className="mt-3 inline-flex items-center gap-2 text-sm text-terracotta"
                >
                  <Phone className="h-4 w-4" />
                  Reservas y contacto
                </Link>
              </li>
            </ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
