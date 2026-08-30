import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";
import { ScaleMark } from "@/components/scale-mark";
import { logout } from "@/app/panel/actions";

export const metadata: Metadata = {
  title: "Panel de gestión",
  robots: { index: false, follow: false },
};

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) {
    redirect("/panel/login");
  }

  return (
    <div className="min-h-svh bg-stone-950">
      <header className="sticky top-0 z-30 border-b border-stone-800 bg-stone-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/panel" className="flex items-center gap-2.5 text-bone">
            <ScaleMark size={22} className="text-terracotta" />
            <span className="font-display text-base tracking-wide">
              La Balanza · Panel
            </span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link
              href="/menu"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-stone-400 hover:text-bone"
            >
              Ver carta
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 text-stone-400 hover:text-terracotta"
              >
                <LogOut className="h-3.5 w-3.5" />
                Salir
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-10 sm:px-8">{children}</main>
    </div>
  );
}
