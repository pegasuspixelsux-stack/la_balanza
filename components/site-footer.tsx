import type { ComponentType } from "react";
import Link from "next/link";
import type { SiteSettings } from "@/lib/menu-types";
import { site } from "@/lib/site";
import { ScaleMark } from "@/components/scale-mark";
import { FacebookIcon, InstagramIcon } from "@/components/brand-icons";

const currentYear = new Date().getFullYear();

const columnTitle =
  "mb-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-cream/55";

const socialIcons: Record<string, ComponentType<{ className?: string }>> = {
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
};

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="border-t border-clay-deep/50 bg-clay text-cream/80">
      <div className="mx-auto grid max-w-page gap-10 px-5 py-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
        <div className="max-w-xs">
          <Link href="/" className="flex items-center gap-2.5 text-cream">
            <ScaleMark size={24} className="text-cream" />
            <span className="font-display text-lg tracking-wide">La Balanza</span>
          </Link>
          <p className="mt-3 text-sm text-cream/60">{site.tagline}</p>
          <div className="mt-4 flex gap-2">
            {site.social.map((account) => {
              const Icon = socialIcons[account.label];
              return (
                <a
                  key={account.label}
                  href={account.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={account.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/25 text-cream/70 transition-colors hover:border-cream hover:text-cream"
                >
                  {Icon ? <Icon className="h-4 w-4" /> : account.label}
                </a>
              );
            })}
          </div>
        </div>

        <nav>
          <p className={columnTitle}>Explorar</p>
          <div className="flex flex-col gap-3 text-sm text-cream/75">
            {site.nav.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-cream">
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="text-sm text-cream/75">
          <p className={columnTitle}>Dónde estamos</p>
          <p className="text-cream">{site.address.line}</p>
          <p>
            {site.address.city}, {site.address.country}
          </p>
          <div className="mt-3 flex flex-col gap-1">
            <span>{settings.phone}</span>
            {settings.email ? (
              <a href={`mailto:${settings.email}`} className="hover:text-cream">
                {settings.email}
              </a>
            ) : null}
          </div>
        </div>

        <div className="text-sm text-cream/75">
          <p className={columnTitle}>Horarios</p>
          <dl className="space-y-1.5">
            {settings.hours.map((row) => (
              <div key={row.days} className="flex justify-between gap-4">
                <dt>{row.days}</dt>
                <dd className="font-mono text-cream">{row.time}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="border-t border-cream/15">
        <div className="mx-auto flex max-w-page flex-col gap-3 px-5 py-6 text-xs text-cream/55 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            © {currentYear} {site.name}. Maldonado, Uruguay.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            {site.legal.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-cream">
                {item.label}
              </Link>
            ))}
            <Link href="/panel" className="hover:text-cream">
              Panel de gestión
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
