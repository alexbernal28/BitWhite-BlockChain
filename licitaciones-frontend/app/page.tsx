import Link from "next/link";

const PORTALS = [
  {
    href: "/ciudadano",
    title: "Portal Ciudadano",
    audience: "Ciudadanía",
    description:
      "Consulta y auditoría pública del historial inmutable de licitaciones registrado en blockchain.",
    accent: "border-amber-300 hover:border-amber-400",
    tag: "bg-amber-50 text-amber-800",
  },
  {
    href: "/empresas",
    title: "Portal de Empresas",
    audience: "Proveedores",
    description:
      "Postulación de ofertas y registro de propuestas con respaldo criptográfico verificable.",
    accent: "border-indigo-300 hover:border-indigo-400",
    tag: "bg-indigo-50 text-indigo-800",
  },
  {
    href: "/gobierno",
    title: "Panel de Gobierno",
    audience: "Entidades gubernamentales",
    description: "Creación, gestión y publicación de licitaciones del organismo.",
    accent: "border-emerald-300 hover:border-emerald-400",
    tag: "bg-emerald-50 text-emerald-800",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="border-b border-gov-border bg-gov-surface">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-gov-blue-700">
            Proyecto de grado · Grupo 19 · ITLA
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-gov-ink sm:text-5xl">
            Licitaciones públicas con trazabilidad verificable
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gov-ink-muted sm:text-lg">
            BitWhite registra cada evento clave de una licitación (publicación,
            propuestas y adjudicación) con verificación criptográfica en
            blockchain, para que cualquier ciudadano pueda auditar el proceso.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/ciudadano"
              className="rounded-md bg-gov-blue-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gov-blue-800"
            >
              Auditar licitaciones
            </Link>
            <Link
              href="/login"
              className="rounded-md border border-gov-blue-700 px-6 py-3 text-sm font-semibold text-gov-blue-700 hover:bg-gov-blue-100"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </section>

      {/* Problema que resuelve */}
      <section className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6">
        <h2 className="text-xl font-bold text-gov-ink sm:text-2xl">
          ¿Por qué blockchain en las contrataciones públicas?
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <FeatureCard
            title="Registro inmutable"
            text="Cada evento de la licitación queda anclado a la blockchain y no puede alterarse retroactivamente."
          />
          <FeatureCard
            title="Verificación por hash"
            text="Los documentos y propuestas se validan mediante huellas criptográficas, no por confianza en un tercero."
          />
          <FeatureCard
            title="Auditoría abierta"
            text="Cualquier ciudadano puede consultar el historial de un proceso de contratación sin solicitud previa."
          />
        </div>
      </section>

      {/* Portales */}
      <section className="border-t border-gov-border bg-gov-surface">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
          <h2 className="text-xl font-bold text-gov-ink sm:text-2xl">Accede a tu portal</h2>
          <p className="mt-2 text-sm text-gov-ink-muted">
            BitWhite ofrece tres experiencias según tu rol dentro del proceso de
            contratación pública.
          </p>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {PORTALS.map((portal) => (
              <Link
                key={portal.href}
                href={portal.href}
                className={`flex flex-col rounded-xl border-2 bg-white p-5 shadow-sm transition-colors ${portal.accent}`}
              >
                <span className={`mb-3 w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${portal.tag}`}>
                  {portal.audience}
                </span>
                <h3 className="text-lg font-bold text-gov-ink">{portal.title}</h3>
                <p className="mt-2 flex-1 text-sm text-gov-ink-muted">{portal.description}</p>
                <span className="mt-4 text-sm font-semibold text-gov-blue-700">
                  Entrar →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-lg border border-gov-border bg-white p-5">
      <h3 className="text-sm font-bold text-gov-ink">{title}</h3>
      <p className="mt-2 text-sm text-gov-ink-muted">{text}</p>
    </div>
  );
}
