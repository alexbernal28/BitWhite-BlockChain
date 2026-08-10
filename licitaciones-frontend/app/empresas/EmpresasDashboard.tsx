"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listTenders, submitProposal, type Tender, ApiError } from "../lib/api";
import { getSession, type Session } from "../lib/session";

export default function EmpresasDashboard() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loadingTenders, setLoadingTenders] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitResult, setSubmitResult] = useState<string | null>(null);

  useEffect(() => {
    setSession(getSession());
    listTenders("Publicada")
      .then(setTenders)
      .catch((err) => setListError(err instanceof ApiError ? err.message : "No se pudieron cargar las licitaciones."))
      .finally(() => setLoadingTenders(false));
  }, []);

  async function handleSubmitProposal(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!session) return;

    const data = new FormData(e.currentTarget);
    const formData = new FormData();
    formData.set("tenderId", String(data.get("tenderId") || ""));
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
      e.currentTarget.reset();
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "No se pudo enviar la propuesta.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-gov-border bg-indigo-50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <span className="mb-2 inline-block w-fit rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-800">
            Proveedores
          </span>
          <h1 className="text-2xl font-bold text-gov-ink sm:text-3xl">Portal de Empresas</h1>
          <p className="mt-2 max-w-2xl text-sm text-gov-ink-muted sm:text-base">
            Regístrate como proveedor del Estado, postúlate a licitaciones abiertas y respalda tus propuestas con
            verificación criptográfica.
          </p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        {/* Registro de empresa */}
        {(!session || session.user.role !== "empresa") && (
          <section className="grid gap-6 rounded-xl border border-gov-border bg-white p-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-sm font-bold text-gov-ink">¿Aún no estás registrado?</h2>
              <p className="mt-1 text-sm text-gov-ink-muted">
                El registro requiere RNC, datos de contacto y documentación legal vigente de la empresa.
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/empresas/registro"
                className="w-fit rounded-md bg-gov-blue-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gov-blue-800"
              >
                Registrar empresa
              </Link>
              <Link
                href="/login"
                className="w-fit rounded-md border border-gov-border px-5 py-2.5 text-sm font-semibold text-gov-ink hover:bg-gov-surface"
              >
                Iniciar sesión
              </Link>
            </div>
          </section>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Licitaciones abiertas */}
          <section className="rounded-xl border border-gov-border bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gov-ink">Licitaciones abiertas</h2>
              <span className="text-xs text-gov-ink-muted">{tenders.length} disponibles</span>
            </div>

            {listError && (
              <p role="alert" className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                {listError}
              </p>
            )}

            {loadingTenders ? (
              <p className="mt-6 text-center text-sm text-gov-ink-muted">Cargando licitaciones…</p>
            ) : tenders.length === 0 ? (
              <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-dashed border-gov-border px-6 py-12 text-center">
                <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true" className="mb-3 text-gov-ink-muted">
                  <path
                    d="M20 6 L34 13 V22 C34 29 28 34 20 36 C12 34 6 29 6 22 V13 Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path d="M14 20 L18 24 L27 15" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-sm font-semibold text-gov-ink">
                  Todavía no hay licitaciones abiertas para postulación
                </p>
                <p className="mt-1 max-w-sm text-xs text-gov-ink-muted">
                  Cuando el Panel de Gobierno publique un proceso, se listará aquí con sus requisitos y fecha límite.
                </p>
              </div>
            ) : (
              <ul className="mt-4 divide-y divide-gov-border">
                {tenders.map((tender) => (
                  <li key={tender.id} className="py-3">
                    <p className="text-sm font-semibold text-gov-ink">{tender.title}</p>
                    <p className="text-xs text-gov-ink-muted">
                      {tender.processNumber} · {tender.category} · Límite {tender.deadline}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Carga de propuestas */}
          <section className="h-fit rounded-xl border border-gov-border bg-white p-5">
            <h2 className="text-sm font-bold text-gov-ink">Enviar propuesta</h2>

            {!session || session.user.role !== "empresa" ? (
              <p className="mt-3 text-sm text-gov-ink-muted">
                Inicia sesión con tu cuenta de empresa para postularte a una licitación abierta.
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
                  <label htmlFor="tenderId" className="mb-1 block text-xs font-medium text-gov-ink">
                    Licitación <span aria-hidden="true">*</span>
                  </label>
                  <select
                    id="tenderId"
                    name="tenderId"
                    required
                    disabled={tenders.length === 0}
                    className="w-full rounded-md border border-gov-border px-3 py-2 text-sm text-gov-ink focus:border-gov-blue-700"
                  >
                    <option value="">Selecciona una licitación</option>
                    {tenders.map((tender) => (
                      <option key={tender.id} value={tender.id}>
                        {tender.processNumber} — {tender.title}
                      </option>
                    ))}
                  </select>
                </div>

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

                <p className="text-xs text-gov-ink-muted">
                  El sistema generará un hash SHA-256 del documento al subirlo, como respaldo criptográfico de tu
                  propuesta.
                </p>
                <label
                  htmlFor="propuesta"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gov-border px-4 py-8 text-center hover:border-gov-blue-700"
                >
                  <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true" className="mb-2 text-gov-ink-muted">
                    <path d="M14 4 V18 M8 10 L14 4 L20 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M5 20 V22 A2 2 0 0 0 7 24 H21 A2 2 0 0 0 23 22 V20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  <span className="text-xs font-semibold text-gov-blue-700">Seleccionar archivo (PDF)</span>
                  <span className="mt-1 text-[11px] text-gov-ink-muted">Tamaño máximo 10&nbsp;MB</span>
                  <input id="propuesta" name="propuesta" type="file" accept="application/pdf" required className="sr-only" />
                </label>

                <button
                  type="submit"
                  disabled={submitting || tenders.length === 0}
                  className="w-full rounded-md bg-gov-blue-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gov-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Enviando…" : "Enviar propuesta"}
                </button>
              </form>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
