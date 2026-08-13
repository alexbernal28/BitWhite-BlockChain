"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProposal, documentUrl, type Proposal, ApiError } from "../lib/api";
import { getSession, type Session } from "../lib/session";

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

/**
 * Detalle completo de una propuesta, reutilizado tanto por el panel de
 * gobierno (dueño de la licitación asociada) como por el portal de
 * empresas (empresa que la envió). La autorización real la valida el
 * backend (GET /api/proposals/:id); aquí solo se ajusta la navegación.
 */
export default function PropuestaDetalle({ proposalId }: { proposalId: string }) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const active = getSession();
    setSession(active);
    if (!active) {
      setLoading(false);
      return;
    }
    getProposal(active.token, proposalId)
      .then(setProposal)
      .catch((err) => setError(err instanceof ApiError ? err.message : "No se pudo cargar la propuesta."))
      .finally(() => setLoading(false));
  }, [proposalId]);

  if (session === undefined || loading) {
    return <p className="flex-1 py-16 text-center text-sm text-gov-ink-muted">Cargando propuesta…</p>;
  }

  if (!session || (session.user.role !== "empresa" && session.user.role !== "gobierno")) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gov-surface px-4 py-12">
        <div className="w-full max-w-md rounded-xl border border-gov-border bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-gov-ink">Acceso restringido</h1>
          <p className="mt-2 text-sm text-gov-ink-muted">
            Debes iniciar sesión con una cuenta de empresa o de gobierno para ver el detalle de una propuesta.
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

  const backHref = session.user.role === "gobierno" ? "/gobierno" : "/empresas/propuestas";

  if (error || !proposal) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gov-surface px-4 py-12">
        <div className="w-full max-w-md rounded-xl border border-gov-border bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-gov-ink">Propuesta no disponible</h1>
          <p className="mt-2 text-sm text-gov-ink-muted">{error || "No se encontró esta propuesta."}</p>
          <Link href={backHref} className="mt-4 inline-block text-sm font-semibold text-gov-blue-700 hover:underline">
            ← Volver
          </Link>
        </div>
      </div>
    );
  }

  const document = proposal.documents?.[0];

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-gov-border bg-gov-surface">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <Link href={backHref} className="text-xs font-semibold text-gov-blue-700 hover:underline">
            ← Volver
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-gov-ink sm:text-3xl">
              Propuesta #{proposal.id}
            </h1>
            <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${ESTADO_PROPUESTA_STYLES[proposal.status]}`}>
              {proposal.status}
            </span>
          </div>
          {proposal.tender && (
            <p className="mt-2 text-sm text-gov-ink-muted">
              Para la licitación{" "}
              <Link href={`/${session.user.role}/licitaciones/${proposal.tenderId}`} className="font-semibold text-gov-blue-700 hover:underline">
                {proposal.tender.processNumber} — {proposal.tender.title}
              </Link>
            </p>
          )}
        </div>
      </header>

      <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8 sm:px-6">
        <section className="rounded-xl border border-gov-border bg-white p-5">
          <h2 className="text-sm font-bold text-gov-ink">Datos de la propuesta</h2>

          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            {session.user.role === "gobierno" && proposal.company && (
              <div className="sm:col-span-2">
                <dt className="text-xs font-semibold text-gov-ink-muted">Empresa proponente</dt>
                <dd className="text-sm text-gov-ink">
                  {proposal.company.companyName} ({proposal.company.razon_social}) · RNC {proposal.company.rnc}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-xs font-semibold text-gov-ink-muted">Monto ofertado</dt>
              <dd className="text-sm text-gov-ink">{formatMonto(proposal.offeredAmount)}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-gov-ink-muted">Fecha de envío</dt>
              <dd className="text-sm text-gov-ink">{new Date(proposal.createdAt).toLocaleString("es-DO")}</dd>
            </div>
          </dl>

          {proposal.message && (
            <div className="mt-5">
              <h3 className="text-xs font-semibold text-gov-ink-muted">Mensaje / notas</h3>
              <p className="mt-1 whitespace-pre-line text-sm text-gov-ink">{proposal.message}</p>
            </div>
          )}

          <div className="mt-5 border-t border-gov-border pt-4">
            <h3 className="text-xs font-semibold text-gov-ink-muted">Documento de la propuesta</h3>
            {document ? (
              <>
                <a
                  href={documentUrl(document.filePath)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-sm font-semibold text-gov-blue-700 hover:underline"
                >
                  Descargar {document.documentName}
                </a>
                <p className="mt-1 break-all font-mono text-[11px] text-gov-ink-muted">
                  Hash SHA-256: {document.documentHash}
                </p>
              </>
            ) : (
              <p className="mt-1 text-sm text-gov-ink-muted">No hay documento adjunto.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
