"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getTender,
  listProposalsForTender,
  submitProposal,
  documentUrl,
  type Tender,
  type Proposal,
  ApiError,
} from "../lib/api";
import { getSession, type Session } from "../lib/session";

const ESTADO_TENDER_STYLES: Record<Tender["status"], string> = {
  Publicada: "bg-gov-blue-100 text-gov-blue-700",
  "En evaluación": "bg-amber-100 text-amber-800",
  Adjudicada: "bg-emerald-100 text-emerald-800",
  Cancelada: "bg-red-100 text-red-700",
};

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
 * Detalle completo de una licitación, reutilizado por el panel de gobierno
 * (donde además se listan las propuestas recibidas) y por el portal de
 * empresas (donde se puede enviar una propuesta directamente).
 */
export default function LicitacionDetalle({ tenderId }: { tenderId: string }) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  const [tender, setTender] = useState<Tender | null>(null);
  const [loadingTender, setLoadingTender] = useState(true);
  const [tenderError, setTenderError] = useState<string | null>(null);

  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loadingProposals, setLoadingProposals] = useState(false);
  const [proposalsError, setProposalsError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitResult, setSubmitResult] = useState<string | null>(null);

  useEffect(() => {
    setSession(getSession());
  }, []);

  useEffect(() => {
    setLoadingTender(true);
    getTender(tenderId)
      .then(setTender)
      .catch((err) => setTenderError(err instanceof ApiError ? err.message : "No se pudo cargar la licitación."))
      .finally(() => setLoadingTender(false));
  }, [tenderId]);

  const isOwnerGobierno =
    !!session && session.user.role === "gobierno" && tender?.createdByUserId === session.user.id;

  useEffect(() => {
    if (!isOwnerGobierno || !session) return;
    setLoadingProposals(true);
    listProposalsForTender(session.token, tenderId)
      .then(setProposals)
      .catch((err) =>
        setProposalsError(err instanceof ApiError ? err.message : "No se pudieron cargar las propuestas recibidas.")
      )
      .finally(() => setLoadingProposals(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOwnerGobierno, tenderId]);

  async function handleSubmitProposal(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!session) return;

    // Se guarda la referencia al formulario antes del await (ver nota en
    // EmpresasDashboard.tsx): React anula `e.currentTarget` en cuanto el
    // manejador cede el control en el primer await.
    const form = e.currentTarget;
    const data = new FormData(form);
    const formData = new FormData();
    formData.set("tenderId", tenderId);
    const amount = String(data.get("montoOfertado") || "");
    if (amount) formData.set("offeredAmount", amount);
    const file = data.get("propuesta");
    if (file instanceof File && file.size > 0) formData.set("documento", file);

    setSubmitError(null);
    setSubmitResult(null);
    setSubmitting(true);
    try {
      await submitProposal(session.token, formData);
      setSubmitResult("Propuesta enviada correctamente. Su hash SHA-256 quedó registrado para verificación pública.");
      form.reset();
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "No se pudo enviar la propuesta.");
    } finally {
      setSubmitting(false);
    }
  }

  if (session === undefined || loadingTender) {
    return <p className="flex-1 py-16 text-center text-sm text-gov-ink-muted">Cargando licitación…</p>;
  }

  if (tenderError || !tender) {
    return (
      <div className="flex flex-1 items-center justify-center bg-gov-surface px-4 py-12">
        <div className="w-full max-w-md rounded-xl border border-gov-border bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-gov-ink">Licitación no encontrada</h1>
          <p className="mt-2 text-sm text-gov-ink-muted">{tenderError || "No existe esta licitación."}</p>
        </div>
      </div>
    );
  }

  const backHref = session?.user.role === "gobierno" ? "/gobierno" : "/empresas";

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-gov-border bg-gov-surface">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
          <Link href={backHref} className="text-xs font-semibold text-gov-blue-700 hover:underline">
            ← Volver
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-gov-ink sm:text-3xl">{tender.title}</h1>
            <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${ESTADO_TENDER_STYLES[tender.status]}`}>
              {tender.status}
            </span>
          </div>
          <p className="mt-2 text-sm text-gov-ink-muted">
            {tender.processNumber} · {tender.category}
          </p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6">
        <section className="rounded-xl border border-gov-border bg-white p-5">
          <h2 className="text-sm font-bold text-gov-ink">Descripción</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-gov-ink-muted">{tender.description}</p>

          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold text-gov-ink-muted">Presupuesto estimado</dt>
              <dd className="text-sm text-gov-ink">{formatMonto(tender.budget)}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-gov-ink-muted">Fecha de publicación</dt>
              <dd className="text-sm text-gov-ink">{tender.publicationDate}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-gov-ink-muted">Fecha límite de propuestas</dt>
              <dd className="text-sm text-gov-ink">{tender.deadline}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-gov-ink-muted">Publicada por (usuario #)</dt>
              <dd className="text-sm text-gov-ink">{tender.createdByUserId}</dd>
            </div>
          </dl>

          {tender.requirements && (
            <div className="mt-5">
              <h3 className="text-xs font-semibold text-gov-ink-muted">Requisitos para participar</h3>
              <p className="mt-1 whitespace-pre-line text-sm text-gov-ink">{tender.requirements}</p>
            </div>
          )}

          <div className="mt-5 border-t border-gov-border pt-4">
            <h3 className="text-xs font-semibold text-gov-ink-muted">Pliego de condiciones</h3>
            {tender.documentPath ? (
              <a
                href={documentUrl(tender.documentPath)}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block text-sm font-semibold text-gov-blue-700 hover:underline"
              >
                Descargar documento (PDF)
              </a>
            ) : (
              <p className="mt-1 text-sm text-gov-ink-muted">No se adjuntó documento.</p>
            )}
            {tender.documentHash && (
              <p className="mt-1 break-all font-mono text-[11px] text-gov-ink-muted">
                Hash SHA-256: {tender.documentHash}
              </p>
            )}
          </div>
        </section>

        {/* Panel de gobierno: propuestas recibidas */}
        {isOwnerGobierno && (
          <section className="rounded-xl border border-gov-border bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gov-ink">Propuestas recibidas</h2>
              <span className="text-xs text-gov-ink-muted">{proposals.length} recibidas</span>
            </div>

            {proposalsError && (
              <p role="alert" className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                {proposalsError}
              </p>
            )}

            {loadingProposals ? (
              <p className="mt-6 text-center text-sm text-gov-ink-muted">Cargando propuestas…</p>
            ) : proposals.length === 0 ? (
              <p className="mt-4 text-sm text-gov-ink-muted">Todavía no se han recibido propuestas para este proceso.</p>
            ) : (
              <ul className="mt-4 divide-y divide-gov-border">
                {proposals.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                    <div>
                      <p className="text-sm font-semibold text-gov-ink">{p.company?.companyName ?? `Empresa #${p.companyId}`}</p>
                      <p className="text-xs text-gov-ink-muted">
                        Monto ofertado: {formatMonto(p.offeredAmount)} · Enviada {new Date(p.createdAt).toLocaleDateString("es-DO")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${ESTADO_PROPUESTA_STYLES[p.status]}`}>
                        {p.status}
                      </span>
                      <Link
                        href={`/gobierno/propuestas/${p.id}`}
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
        )}

        {/* Portal de empresas: envío de propuesta */}
        {session?.user.role === "empresa" && (
          <section className="rounded-xl border border-gov-border bg-white p-5">
            <h2 className="text-sm font-bold text-gov-ink">Enviar propuesta para esta licitación</h2>

            {tender.status !== "Publicada" ? (
              <p className="mt-3 text-sm text-gov-ink-muted">
                Esta licitación ya no admite nuevas propuestas (estado actual: {tender.status}).
              </p>
            ) : (
              <form className="mt-3 space-y-3" onSubmit={handleSubmitProposal}>
                {submitError && (
                  <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                    {submitError}
                  </p>
                )}
                {submitResult && (
                  <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
                    {submitResult}
                  </p>
                )}

                <div>
                  <label htmlFor="montoOfertado" className="mb-1 block text-xs font-medium text-gov-ink">
                    Monto ofertado (RD$)
                  </label>
                  <input
                    id="montoOfertado"
                    name="montoOfertado"
                    type="number"
                    min={0}
                    step="0.01"
                    className="w-full rounded-md border border-gov-border px-3 py-2 text-sm text-gov-ink focus:border-gov-blue-700"
                  />
                </div>

                <label
                  htmlFor="propuesta"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gov-border px-4 py-8 text-center hover:border-gov-blue-700"
                >
                  <span className="text-xs font-semibold text-gov-blue-700">Seleccionar archivo (PDF)</span>
                  <span className="mt-1 text-[11px] text-gov-ink-muted">Tamaño máximo 10&nbsp;MB</span>
                  <input id="propuesta" name="propuesta" type="file" accept="application/pdf" required className="sr-only" />
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-md bg-gov-blue-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gov-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Enviando…" : "Enviar propuesta"}
                </button>
              </form>
            )}

            <p className="mt-4 text-xs text-gov-ink-muted">
              ¿Ya enviaste tu propuesta?{" "}
              <Link href="/empresas/propuestas" className="font-semibold text-gov-blue-700 hover:underline">
                Consulta el detalle en Mis propuestas
              </Link>
              .
            </p>
          </section>
        )}

        {(!session || session.user.role === "ciudadano") && (
          <section className="rounded-xl border border-gov-border bg-white p-5 text-sm text-gov-ink-muted">
            Inicia sesión con una cuenta de empresa para postularte a esta licitación.
          </section>
        )}
      </div>
    </div>
  );
}
