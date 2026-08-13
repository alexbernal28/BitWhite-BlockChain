"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listMyTenders, type Tender, ApiError } from "../lib/api";
import { getSession, type Session } from "../lib/session";

export default function GobiernoDashboard() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const active = getSession();
    setSession(active);
    if (!active || active.user.role !== "gobierno") {
      setLoading(false);
      return;
    }
    listMyTenders(active.token)
      .then(setTenders)
      .catch((err) => setError(err instanceof ApiError ? err.message : "No se pudieron cargar las licitaciones."))
      .finally(() => setLoading(false));
  }, []);

  if (session === undefined) return null;

  if (!session || session.user.role !== "gobierno") {
    return (
      <div className="flex flex-1 items-center justify-center bg-gov-surface px-4 py-12">
        <div className="w-full max-w-md rounded-xl border border-gov-border bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-gov-ink">Acceso restringido</h1>
          <p className="mt-2 text-sm text-gov-ink-muted">
            Este panel es exclusivo para cuentas institucionales (gobierno). Inicia sesión para continuar.
          </p>
          <Link
            href="/login"
            className="mt-4 inline-block rounded-md bg-gov-blue-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gov-blue-800"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  const summary = [
    { label: "Publicadas", value: tenders.filter((t) => t.status === "Publicada").length },
    { label: "En evaluación", value: tenders.filter((t) => t.status === "En evaluación").length },
    { label: "Adjudicadas", value: tenders.filter((t) => t.status === "Adjudicada").length },
  ];

  const filtered = tenders.filter((t) =>
    `${t.title} ${t.processNumber}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-gov-border bg-emerald-50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <span className="mb-2 inline-block w-fit rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
            Entidades gubernamentales
          </span>
          <h1 className="text-2xl font-bold text-gov-ink sm:text-3xl">Panel de Gobierno</h1>
          <p className="mt-2 max-w-2xl text-sm text-gov-ink-muted sm:text-base">
            Crea, gestiona y publica los procesos de licitación de tu institución, {session.user.name}.
          </p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        <section className="grid gap-4 sm:grid-cols-[repeat(3,1fr)_auto] sm:items-center">
          {summary.map((item) => (
            <div key={item.label} className="rounded-xl border border-gov-border bg-white p-4">
              <p className="text-2xl font-bold text-gov-ink">{item.value}</p>
              <p className="text-xs text-gov-ink-muted">{item.label}</p>
            </div>
          ))}
          <Link
            href="/gobierno/nueva-licitacion"
            className="h-fit w-fit rounded-md bg-gov-blue-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gov-blue-800"
          >
            + Nueva licitación
          </Link>
        </section>

        {/* Gestión de licitaciones */}
        <section className="rounded-xl border border-gov-border bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-gov-ink">Mis licitaciones</h2>
            <label className="flex items-center gap-2 text-xs text-gov-ink-muted">
              <span className="sr-only">Buscar en mis licitaciones</span>
              <input
                type="search"
                placeholder="Buscar por título o número…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-md border border-gov-border px-3 py-1.5 text-xs text-gov-ink placeholder:text-gov-ink-muted focus:border-gov-blue-700"
              />
            </label>
          </div>

          {error && (
            <p role="alert" className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              {error}
            </p>
          )}

          {loading ? (
            <p className="mt-6 text-center text-sm text-gov-ink-muted">Cargando licitaciones…</p>
          ) : filtered.length === 0 ? (
            <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-dashed border-gov-border px-6 py-12 text-center">
              <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true" className="mb-3 text-gov-ink-muted">
                <path d="M20 5 V35 M9 12 H31 M9 28 H31" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="20" cy="20" r="14" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
              <p className="text-sm font-semibold text-gov-ink">
                Tu institución aún no ha publicado licitaciones
              </p>
              <p className="mt-1 max-w-sm text-xs text-gov-ink-muted">
                Al crear una licitación, se calcula el hash de su pliego y queda disponible para verificación en
                el Portal Ciudadano.
              </p>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-gov-border">
              {filtered.map((tender) => (
                <li key={tender.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gov-ink">{tender.title}</p>
                    <p className="text-xs text-gov-ink-muted">
                      {tender.processNumber} · {tender.category} · Límite {tender.deadline}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-fit rounded-full bg-gov-blue-100 px-2.5 py-1 text-xs font-semibold text-gov-blue-700">
                      {tender.status}
                    </span>
                    <Link
                      href={`/gobierno/licitaciones/${tender.id}`}
                      className="text-xs font-semibold text-gov-blue-700 hover:underline"
                    >
                      Ver detalle
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
