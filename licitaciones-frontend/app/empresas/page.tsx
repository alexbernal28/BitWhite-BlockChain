import Link from "next/link";

export const metadata = { title: "Portal de Empresas" };

export default function EmpresasPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-gov-border bg-indigo-50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <span className="mb-2 inline-block w-fit rounded-full bg-indigo-100 px-2.5 py-1 text-xs font-semibold text-indigo-800">
            Proveedores
          </span>
          <h1 className="text-2xl font-bold text-gov-ink sm:text-3xl">Portal de Empresas</h1>
          <p className="mt-2 max-w-2xl text-sm text-gov-ink-muted sm:text-base">
            Regístrate como proveedor del Estado, postúlate a licitaciones
            abiertas y respalda tus propuestas con verificación criptográfica.
          </p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        {/* Registro de empresa */}
        <section className="grid gap-6 rounded-xl border border-gov-border bg-white p-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-sm font-bold text-gov-ink">¿Aún no estás registrado?</h2>
            <p className="mt-1 text-sm text-gov-ink-muted">
              El registro requiere RNC, datos de contacto y documentación
              legal vigente de la empresa.
            </p>
          </div>
          <Link
            href="../empresas/registro"
            className="w-fit rounded-md bg-gov-blue-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gov-blue-800"
          >
            Registrar empresa
          </Link>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Licitaciones abiertas */}
          <section className="rounded-xl border border-gov-border bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gov-ink">Licitaciones abiertas</h2>
              <span className="text-xs text-gov-ink-muted">0 disponibles</span>
            </div>

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
                Cuando el Panel de Gobierno publique un proceso, se listará
                aquí con sus requisitos y fecha límite.
              </p>
            </div>
          </section>

          {/* Carga de propuestas */}
          <section className="h-fit rounded-xl border border-gov-border bg-white p-5">
            <h2 className="text-sm font-bold text-gov-ink">Cargar propuesta</h2>
            <p className="mt-1 text-sm text-gov-ink-muted">
              El sistema generará un hash SHA-256 del documento al subirlo,
              como respaldo criptográfico de tu propuesta.
            </p>
            <label
              htmlFor="propuesta"
              className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gov-border px-4 py-8 text-center hover:border-gov-blue-700"
            >
              <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true" className="mb-2 text-gov-ink-muted">
                <path d="M14 4 V18 M8 10 L14 4 L20 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 20 V22 A2 2 0 0 0 7 24 H21 A2 2 0 0 0 23 22 V20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <span className="text-xs font-semibold text-gov-blue-700">Seleccionar archivo (PDF)</span>
              <span className="mt-1 text-[11px] text-gov-ink-muted">Tamaño máximo 10&nbsp;MB</span>
              <input id="propuesta" name="propuesta" type="file" accept="application/pdf" className="sr-only" />
            </label>
          </section>
        </div>
      </div>
    </div>
  );
}
