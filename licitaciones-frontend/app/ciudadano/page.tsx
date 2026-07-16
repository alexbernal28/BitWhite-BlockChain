export const metadata = { title: "Portal Ciudadano" };

export default function CiudadanoPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-gov-border bg-amber-50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <span className="mb-2 inline-block w-fit rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
            Ciudadanía
          </span>
          <h1 className="text-2xl font-bold text-gov-ink sm:text-3xl">Portal Ciudadano</h1>
          <p className="mt-2 max-w-2xl text-sm text-gov-ink-muted sm:text-base">
            Verificación e historial inmutable de licitaciones registradas en
            blockchain. Consulta abierta, sin necesidad de registro.
          </p>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[280px_1fr]">
        {/* Filtros — panel izquierdo (Sección 3.02.e.iii.a.ii) */}
        <aside aria-label="Filtros de búsqueda" className="h-fit rounded-xl border border-gov-border bg-white p-5">
          <h2 className="text-sm font-bold text-gov-ink">Filtrar licitaciones</h2>
          <div className="mt-4 space-y-4 text-sm">
            <div>
              <label htmlFor="f-institucion" className="mb-1 block font-medium text-gov-ink">
                Institución
              </label>
              <select
                id="f-institucion"
                className="w-full rounded-md border border-gov-border px-3 py-2 text-gov-ink focus:border-gov-blue-700"
              >
                <option>Todas las instituciones</option>
              </select>
            </div>
            <div>
              <label htmlFor="f-estado" className="mb-1 block font-medium text-gov-ink">
                Estado del proceso
              </label>
              <select
                id="f-estado"
                className="w-full rounded-md border border-gov-border px-3 py-2 text-gov-ink focus:border-gov-blue-700"
              >
                <option>Todos</option>
                <option>Publicada</option>
                <option>En evaluación</option>
                <option>Adjudicada</option>
              </select>
            </div>
            <div>
              <label htmlFor="f-fecha" className="mb-1 block font-medium text-gov-ink">
                Fecha de publicación
              </label>
              <input
                id="f-fecha"
                type="date"
                className="w-full rounded-md border border-gov-border px-3 py-2 text-gov-ink focus:border-gov-blue-700"
              />
            </div>
            <button
              type="button"
              className="w-full rounded-md bg-gov-blue-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gov-blue-800"
            >
              Aplicar filtros
            </button>
          </div>
        </aside>

        {/* Contenido principal */}
        <div className="space-y-6">
          {/* Verificador de hash */}
          <section className="rounded-xl border border-gov-border bg-white p-5">
            <h2 className="text-sm font-bold text-gov-ink">Verificar un documento</h2>
            <p className="mt-1 text-sm text-gov-ink-muted">
              Introduce el hash SHA-256 de un documento para comprobar si
              coincide con un registro anclado en la blockchain.
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <label htmlFor="hash" className="sr-only">
                Hash del documento
              </label>
              <input
                id="hash"
                type="text"
                placeholder="Ej. 3b1c...e42f"
                className="flex-1 rounded-md border border-gov-border px-3 py-2.5 text-sm text-gov-ink placeholder:text-gov-ink-muted focus:border-gov-blue-700"
              />
              <button
                type="button"
                className="rounded-md border border-gov-blue-700 px-4 py-2.5 text-sm font-semibold text-gov-blue-700 hover:bg-gov-blue-100"
              >
                Verificar
              </button>
            </div>
          </section>

          {/* Listado de licitaciones (estado vacío) */}
          <section className="rounded-xl border border-gov-border bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gov-ink">Licitaciones registradas</h2>
              <span className="text-xs text-gov-ink-muted">0 resultados</span>
            </div>

            <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-dashed border-gov-border px-6 py-12 text-center">
              <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true" className="mb-3 text-gov-ink-muted">
                <rect x="6" y="10" width="28" height="22" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="M6 16 H34" stroke="currentColor" strokeWidth="1.6" />
                <path d="M12 22 H28 M12 26 H22" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <p className="text-sm font-semibold text-gov-ink">
                Aún no hay licitaciones publicadas en blockchain
              </p>
              <p className="mt-1 max-w-sm text-xs text-gov-ink-muted">
                Cuando el módulo de Backend e Integración (Fase 4) conecte la
                API con el contrato inteligente de registro, los procesos
                publicados aparecerán aquí automáticamente.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
