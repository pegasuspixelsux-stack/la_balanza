import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ScaleMark } from "@/components/scale-mark";
import { LoginForm } from "@/components/panel/login-form";

export const metadata: Metadata = {
  title: "Panel — Ingreso",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  const demoPassword = process.env.ADMIN_PASSWORD;

  return (
    <div className="relative flex min-h-svh items-center justify-center px-5 py-24">
      <Image
        src="/images/balanza-1.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-forest-deep/70" />

      <div className="relative w-full max-w-sm rounded-2xl border border-white/15 bg-stone-950/40 p-8 shadow-2xl backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2.5 text-bone">
          <ScaleMark size={24} className="text-terracotta" />
          <span className="font-display text-lg tracking-wide">La Balanza</span>
        </Link>
        <h1 className="mt-6 font-display text-2xl text-bone">Panel de gestión</h1>
        <p className="mt-1 text-sm text-stone-300">
          Ingresá para administrar la carta y los datos de contacto.
        </p>

        <div className="mt-6">
          <LoginForm />
        </div>

        {demoPassword ? (
          <div className="mt-5 rounded-lg border border-neon/30 bg-neon/10 px-3 py-2 text-xs text-cream/80">
            <span className="font-mono uppercase tracking-[0.15em] text-neon">
              Demo
            </span>{" "}
            — contraseña:{" "}
            <span className="font-mono text-cream">{demoPassword}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
