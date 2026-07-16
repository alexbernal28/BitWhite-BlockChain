import Link from "next/link";

export const metadata = { title: "Panel de Gobierno" };

const SUMMARY = [
  { label: "Publicadas", value: 0 },
  { label: "En evaluación", value: 0 },
  { label: "Adjudicadas", value: 0 },
];

export default function GobiernoPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-gov-border bg-emerald-50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <span className="mb-2 inline-block w-fit rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
            Entidades gubernamentales
          </span>
          <h1 className="text-2xl font-bold text-gov-ink sm:text-3xl">Panel de Gobierno</h1>
          <p className="mt-2 max-w-2xl text-sm text-gov-ink-muted sm:text-base">
            Crea, gestiona y publica los procesos de licitación de tu
            institución, con registro automático en blockchain.
          </p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        <section className="grid gap-4 sm:grid-cols-[repeat(3,1fr)_auto] sm:items-center">
          {SUMMARY.map((item) => (
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
                className="rounded-md border border-gov-border px-3 py-1.5 text-xs text-gov-ink placeholder:text-gov-ink-muted focus:border-gov-blue-700"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-dashed border-gov-border px-6 py-12 text-center">
            <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true" className="mb-3 text-gov-ink-muted">
              <path d="M20 5 V35 M9 12 H31 M9 28 H31" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="20" cy="20" r="14" fill="none" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            <p className="text-sm font-semibold text-gov-ink">
              Tu institución aún no ha publicado licitaciones
            </p>
            <p className="mt-1 max-w-sm text-xs text-gov-ink-muted">
              Al crear una licitación, su hash de publicación se ancla a la
              blockchain y queda disponible para auditoría en el Portal
              Ciudadano.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
