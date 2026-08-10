"use client";

import { useEffect, useState } from "react";
import { listTenders, verifyHash, type Tender, type VerifyResult, ApiError } from "../lib/api";

const ESTADOS = ["Publicada", "En evaluación", "Adjudicada", "Cancelada"];

export default function CiudadanoDashboard() {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loadingTenders, setLoadingTenders] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [estado, setEstado] = useState("");

  const [hash, setHash] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [result, setResult] = useState<VerifyResult | null>(null);

  useEffect(() => {
    setLoadingTenders(true);
    listTenders(estado || undefined)
      .then(setTenders)
      .catch((err) => setListError(err instanceof ApiError ? err.message : "No se pudieron cargar las licitaciones."))
      .finally(() => setLoadingTenders(false));
  }, [estado]);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!hash.trim()) return;
    setVerifyError(null);
    setResult(null);
    setVerifying(true);
    try {
      const data = await verifyHash(hash.trim());
      setResult(data);
    } catch (err) {
      setVerifyError(err instanceof ApiError ? err.message : "No se pudo verificar el documento.");
    } finally {
      setVerifying(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-gov-border bg-amber-50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <span className="mb-2 inline-block w-fit rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
            Ciudadanía
          </span>
          <h1 className="text-2xl font-bold text-gov-ink sm:text-3xl">Portal Ciudadano</h1>
          <p className="mt-2 max-w-2xl text-sm text-gov-ink-muted sm:text-base">
            Verificación e historial de licitaciones registradas en el sistema. Consulta abierta, sin necesidad de
            registro.
          </p>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[280px_1fr]">
        {/* Filtros — panel izquierdo (Sección 3.02.e.iii.a.ii) */}
        <aside aria-label="Filtros de búsqueda" className="h-fit rounded-xl border border-gov-border bg-white p-5">
          <h2 className="text-sm font-bold text-gov-ink">Filtrar licitaciones</h2>
          <div className="mt-4 space-y-4 text-sm">
            <div>
              <label htmlFor="f-estado" className="mb-1 block font-medium text-gov-ink">
                Estado del proceso
              </label>
              <select
                id="f-estado"
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full rounded-md border border-gov-border px-3 py-2 text-gov-ink focus:border-gov-blue-700"
              >
                <option value="">Todos</option>
                {ESTADOS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        {/* Contenido principal */}
        <div className="space-y-6">
          {/* Verificador de hash */}
          <section className="rounded-xl border border-gov-border bg-white p-5">
            <h2 className="text-sm font-bold text-gov-ink">Verificar un documento</h2>
            <p className="mt-1 text-sm text-gov-ink-muted">
              Introduce el hash SHA-256 de un documento (pliego o propuesta) para comprobar si coincide con un
              registro del sistema.
            </p>
            <form className="mt-3 flex flex-col gap-2 sm:flex-row" onSubmit={handleVerify}>
              <label htmlFor="hash" className="sr-only">
                Hash del documento
              </label>
              <input
                id="hash"
                type="text"
                placeholder="Ej. 3b1c...e42f"
                value={hash}
                onChange={(e) => setHash(e.target.value)}
                className="flex-1 rounded-md border border-gov-border px-3 py-2.5 text-sm text-gov-ink placeholder:text-gov-ink-muted focus:border-gov-blue-700"
              />
              <button
                type="submit"
                disabled={verifying}
                className="rounded-md border border-gov-blue-700 px-4 py-2.5 text-sm font-semibold text-gov-blue-700 hover:bg-gov-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {verifying ? "Verificando…" : "Verificar"}
              </button>
            </form>

            {verifyError && (
              <p role="alert" className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                {verifyError}
              </p>
            )}

            {result && (
              <p
                role="status"
                className={`mt-3 rounded-md border px-3 py-2 text-sm font-medium ${
                  result.match
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {result.match
                  ? `Documento auténtico: coincide con ${result.type === "tender" ? "una licitación" : "una propuesta"} registrada.`
                  : "No se encontró ningún registro con ese hash. El documento podría ser inexistente o haber sido alterado."}
              </p>
            )}
          </section>

          {/* Listado de licitaciones */}
          <section className="rounded-xl border border-gov-border bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gov-ink">Licitaciones registradas</h2>
              <span className="text-xs text-gov-ink-muted">{tenders.length} resultados</span>
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
                  <rect x="6" y="10" width="28" height="22" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M6 16 H34" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M12 22 H28 M12 26 H22" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                <p className="text-sm font-semibold text-gov-ink">
                  Aún no hay licitaciones publicadas
                </p>
                <p className="mt-1 max-w-sm text-xs text-gov-ink-muted">
                  Cuando una institución publique un proceso desde el Panel de Gobierno, aparecerá aquí
                  automáticamente.
                </p>
              </div>
            ) : (
              <ul className="mt-4 divide-y divide-gov-border">
                {tenders.map((tender) => (
                  <li key={tender.id} className="py-3">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gov-ink">{tender.title}</p>
                        <p className="text-xs text-gov-ink-muted">
                          {tender.processNumber} · {tender.category} · Publicada el {tender.publicationDate}
                        </p>
                      </div>
                      <span className="w-fit rounded-full bg-gov-blue-100 px-2.5 py-1 text-xs font-semibold text-gov-blue-700">
                        {tender.status}
                      </span>
                    </div>
                    {tender.documentHash && (
                      <p className="mt-1 truncate font-mono text-[11px] text-gov-ink-muted">
                        Hash del pliego: {tender.documentHash}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
