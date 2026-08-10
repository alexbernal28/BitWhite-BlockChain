"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BitWhiteMark } from "./Logos";
import { INTEREST_MENU, LOGIN_NAV, MAIN_NAV } from "./nav-config";
import { clearSession, getSession, type Session } from "../../lib/session";

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [interestOpen, setInterestOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  // Se re-lee en cada cambio de ruta (p. ej. justo después de iniciar sesión)
  // porque localStorage no dispara un re-render por sí solo.
  useEffect(() => {
    setSession(getSession());
  }, [pathname]);

  function handleLogout() {
    clearSession();
    setSession(null);
    setMobileOpen(false);
    router.push("/");
  }

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="border-b border-gov-border bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 rounded"
          aria-label="BitWhite — ir al inicio"
        >
          <BitWhiteMark className="h-10 w-10 shrink-0" />
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-base font-bold text-gov-ink sm:text-lg">
              BitWhite
            </span>
            <span className="block truncate text-[11px] text-gov-ink-muted sm:text-xs">
              Sistema Nacional de Licitaciones Públicas Transparentes
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {/* Herramienta de búsqueda */}
          <form
            role="search"
            action="#"
            className="flex h-10 w-[246px] items-center rounded-md border border-gov-border bg-gov-surface px-3 focus-within:border-gov-blue-700"
            onSubmit={(e) => e.preventDefault()}
          >
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" className="shrink-0 text-gov-ink-muted">
              <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <path d="M11 11 L15 15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <label htmlFor="site-search" className="sr-only">
              Buscar en el portal
            </label>
            <input
              id="site-search"
              type="search"
              placeholder="Buscar licitaciones, empresas…"
              className="ml-2 w-full bg-transparent text-sm text-gov-ink placeholder:text-gov-ink-muted focus:outline-none"
            />
          </form>

          {/* Menú en cuadrícula de enlaces de interés */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setInterestOpen((v) => !v)}
              aria-expanded={interestOpen}
              aria-label="Enlaces de interés del Gobierno Dominicano"
              className="flex h-10 w-10 items-center justify-center rounded-md border border-gov-border text-gov-ink-muted hover:border-gov-blue-700 hover:text-gov-blue-700"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                {[0, 6.5, 13].flatMap((x) =>
                  [0, 6.5, 13].map((y) => (
                    <rect key={`${x}-${y}`} x={x} y={y} width="4" height="4" rx="1" fill="currentColor" />
                  ))
                )}
              </svg>
            </button>

            {interestOpen && (
              <div className="absolute right-0 z-50 mt-2 w-72 rounded-lg border border-gov-border bg-white p-4 shadow-lg">
                +{INTEREST_MENU.map((group) => (
                  <div key={group.heading} className="mb-3 last:mb-0">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gov-ink-muted">
                      {group.heading}
                    </p>
                    <ul className="space-y-1">
                      {group.links.map((link) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block rounded px-1 py-1 text-sm text-gov-blue-700 hover:bg-gov-blue-100 hover:underline"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          {session ? (
            <div className="flex items-center gap-2">
              <span className="max-w-[140px] truncate text-sm font-medium text-gov-ink" title={session.user.name}>
                {session.user.name}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="flex h-10 items-center rounded-md border border-gov-border px-4 text-sm font-semibold text-gov-ink hover:bg-gov-surface"
              >
                Cerrar sesión
              </button>
            </div>
          ) : (
            <Link
              href={LOGIN_NAV.href}
              className="flex h-10 items-center rounded-md bg-gov-blue-900 px-4 text-sm font-semibold text-white hover:bg-gov-blue-800"
            >
              {LOGIN_NAV.label}
            </Link>
          )}
        </div>

        {/* Botón hamburguesa (versión móvil) */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label="Abrir menú de navegación"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-gov-border text-gov-ink md:hidden"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M3 5 H17 M3 10 H17 M3 15 H17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Menú principal horizontal */}
      <nav
        aria-label="Menú principal"
        className="hidden border-t border-gov-border bg-gov-surface md:block"
      >
        <ul className="mx-auto flex h-14 max-w-7xl items-center gap-1 px-4 sm:px-6">
          {MAIN_NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-gov-blue-900 text-white"
                      : "text-gov-ink hover:bg-gov-blue-100 hover:text-gov-blue-900"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Navegación móvil */}
      {mobileOpen && (
        <nav id="mobile-nav" aria-label="Menú principal (móvil)" className="border-t border-gov-border md:hidden">
          <ul className="flex flex-col gap-1 px-4 py-3">
            {MAIN_NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-md px-3 py-2 text-sm font-medium ${
                      active ? "bg-gov-blue-900 text-white" : "text-gov-ink hover:bg-gov-blue-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li>
              {session ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-gov-ink hover:bg-gov-blue-100"
                >
                  Cerrar sesión ({session.user.name})
                </button>
              ) : (
                <Link
                  href={LOGIN_NAV.href}
                  aria-current={isActive(LOGIN_NAV.href) ? "page" : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-md px-3 py-2 text-sm font-medium ${
                    isActive(LOGIN_NAV.href) ? "bg-gov-blue-900 text-white" : "text-gov-ink hover:bg-gov-blue-100"
                  }`}
                >
                  {LOGIN_NAV.label}
                </Link>
              )}
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
