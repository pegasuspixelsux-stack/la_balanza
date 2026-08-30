import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces, Pacifico, Montserrat } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { OrderProvider } from "@/components/menu/order-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: `${site.name} | ${site.address.city}, ${site.address.country}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    locale: "es_UY",
    type: "website",
    images: [{ url: "/images/balanza-11.webp", width: 680, height: 458 }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${pacifico.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-stone-950 text-stone-300">
        <OrderProvider>{children}</OrderProvider>
      </body>
    </html>
  );
}
