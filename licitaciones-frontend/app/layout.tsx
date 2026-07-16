import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "./components/Layout/SiteHeader";
import Breadcrumbs from "./components/Layout/Breadcrumbs";
import SiteFooter from "./components/Layout/SiteFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "BitWhite — Licitaciones Públicas Transparentes",
    template: "%s · BitWhite",
  },
  description:
    "Portal oficial de BitWhite: gestión transparente de licitaciones públicas con verificación en blockchain.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-DO"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white text-gov-ink">
        <a
          href="#contenido-principal"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-gov-blue-900 focus:px-4 focus:py-2 focus:text-white"
        >
          Saltar al contenido principal
        </a>

        <div className="sticky top-0 z-40">
          <SiteHeader />
        </div>

        <Breadcrumbs />

        <main id="contenido-principal" className="flex flex-1 flex-col">
          {children}
        </main>

        <SiteFooter />
      </body>
    </html>
  );
}
