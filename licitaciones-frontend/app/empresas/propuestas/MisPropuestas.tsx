"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listMyProposals, type Proposal, ApiError } from "../../lib/api";
import { getSession, type Session } from "../../lib/session";

const ESTADO_PROPUESTA_STYLES: Record<Proposal["status"], string> = {
  Enviada: "bg-gov-blue-100 text-gov-blue-700",
  "En revisión": "bg-amber-100 text-amber-800",
  Aprobada: "bg-emerald-100 text-emerald-800",
  Rechazada: "bg-red-100 text-red-700",
};

function formatMonto(value: string | null) {
  if (!value) return "No especificado";
  const n = Number(value);
  return Number.isFinite(n) ? `RD$ ${n.toLocaleString("es-DO", { minimumFractionDigits: 2 })}` : value;
}

export default function MisPropuestas() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const active = getSession();
    setSession(active);
    if (!active || active.user.role !== "empresa") {
      setLoading(false);
      return;
    }
    listMyProposals(active.token)
      .then(setProposals)
      .catch((err) => setError(err instanceof ApiError ? err.message : "No se pudieron cargar tus propuestas."))
      .finally(() => setLoading(false));
  }, []);

  if (session === undefined) return null;

  if (!session || session.user.role !== "empresa") {
    return (
      <div className="flex flex-1 items-center justify-center bg-gov-surface px-4 py-12">
        <div className="w-full max-w-md rounded-xl border border-gov-border bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-gov-ink">Acceso restringido</h1>
          <p className="mt-2 text-sm text-gov-ink-muted">
            Este panel es exclusivo para cuentas de empresa. Inicia sesión para continuar.
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

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-gov-border bg-indigo-50">
        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
          <Link href="/empresas" className="text-xs font-semibold text-gov-blue-700 hover:underline">
            ← Volver al Portal de Empresas
          </Link>
          <h1 className="mt-3 text-2xl font-bold text-gov-ink sm:text-3xl">Mis propuestas</h1>
          <p className="mt-2 max-w-2xl text-sm text-gov-ink-muted sm:text-base">
            Historial de propuestas enviadas por tu empresa, con su estado y respaldo criptográfico.
          </p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <section className="rounded-xl border border-gov-border bg-white p-5">
          {error && (
            <p role="alert" className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              {error}
            </p>
          )}

          {loading ? (
            <p className="py-10 text-center text-sm text-gov-ink-muted">Cargando propuestas…</p>
          ) : proposals.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gov-border px-6 py-12 text-center">
              <p className="text-sm font-semibold text-gov-ink">Aún no has enviado propuestas</p>
              <p className="mt-1 max-w-sm text-xs text-gov-ink-muted">
                Explora las licitaciones abiertas y envía tu propuesta desde el Portal de Empresas.
              </p>
              <Link
                href="/empresas"
                className="mt-4 rounded-md bg-gov-blue-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gov-blue-800"
              >
                Ver licitaciones abiertas
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gov-border">
              {proposals.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-semibold text-gov-ink">
                      {p.tender ? `${p.tender.processNumber} — ${p.tender.title}` : `Licitación #${p.tenderId}`}
                    </p>
                    <p className="text-xs text-gov-ink-muted">
                      Monto ofertado: {formatMonto(p.offeredAmount)} · Enviada {new Date(p.createdAt).toLocaleDateString("es-DO")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${ESTADO_PROPUESTA_STYLES[p.status]}`}>
                      {p.status}
                    </span>
                    <Link href={`/empresas/propuestas/${p.id}`} className="text-xs font-semibold text-gov-blue-700 hover:underline">
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
