"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BREADCRUMB_LABELS } from "./nav-config";

/**
 * Rastro de navegación (breadcrumbs).
 *
 * NORTIC A2:2023, Sección 2.01, directriz (b.iii): "El portal debe contar
 * con un rastro de navegación que oriente al usuario y le permita saber
 * dónde se encuentra dentro de este." Debe ubicarse en el panel superior
 * de la división de contenido (Sección 3.02, directriz e.i) y es obligatorio
 * en secciones y subsecciones internas (Sección 3.04, directriz b.ii).
 *
 * No se muestra en la página de inicio, ya que ahí no hay una sección
 * "interna" que rastrear.
 */
export default function Breadcrumbs() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = BREADCRUMB_LABELS[segment] ?? segment;
    const isLast = index === segments.length - 1;
    return { href, label, isLast };
  });

  return (
    <nav aria-label="Rastro de navegación" className="border-b border-gov-border bg-gov-surface">
      <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-1.5 px-4 py-2.5 text-sm text-gov-ink-muted sm:px-6">
        <li className="flex items-center gap-1.5">
          <Link href="/" className="flex items-center gap-1 rounded text-gov-blue-700 hover:underline">
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14">
              <path
                d="M2 6.5 L7 2 L12 6.5 M3.2 5.6 V12 H10.8 V5.6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinejoin="round"
              />
            </svg>
            Inicio
          </Link>
        </li>
        {crumbs.map((crumb) => (
          <li key={crumb.href} className="flex items-center gap-1.5">
            <span aria-hidden="true" className="text-gov-border">
              /
            </span>
            {crumb.isLast ? (
              <span aria-current="page" className="font-semibold text-gov-ink">
                {crumb.label}
              </span>
            ) : (
              <Link href={crumb.href} className="rounded text-gov-blue-700 hover:underline">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
