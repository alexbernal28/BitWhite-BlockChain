import Link from "next/link";

export const metadata = { title: "Nueva licitación" };

const CATEGORIAS = [
  "Bienes",
  "Servicios",
  "Obras",
  "Consultoría",
];

const inputClass =
  "w-full rounded-md border border-gov-border px-3 py-2.5 text-sm text-gov-ink placeholder:text-gov-ink-muted focus:border-gov-blue-700";

export default function NuevaLicitacionPage() {
  return (
    <div className="flex flex-1 justify-center bg-gov-surface px-4 py-12">
      <div className="w-full max-w-2xl rounded-xl border border-gov-border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gov-ink">Nueva licitación</h1>
        <p className="mt-1 text-sm text-gov-ink-muted">
          Los datos ingresados crearán un registro en el modelo{" "}
          <code className="text-xs">Tender</code> del backend. Al publicar,
          se generará el hash del proceso y se anclará a la blockchain.
        </p>

        <form className="mt-8 space-y-6">
          <fieldset className="space-y-4">
            <legend className="mb-1 text-sm font-bold text-gov-ink">
              Datos generales
            </legend>

            <div>
              <label htmlFor="titulo" className="mb-1 block text-sm font-medium text-gov-ink">
                Título de la licitación <span aria-hidden="true">*</span>
                <span className="sr-only"> (obligatorio)</span>
              </label>
              <input
                id="titulo"
                name="titulo"
                type="text"
                required
                placeholder="Ej. Suministro de equipos informáticos 2026"
                className={inputClass}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="numero-proceso" className="mb-1 block text-sm font-medium text-gov-ink">
                  Número de proceso <span aria-hidden="true">*</span>
                  <span className="sr-only"> (obligatorio)</span>
                </label>
                <input
                  id="numero-proceso"
                  name="numeroProceso"
                  type="text"
                  required
                  placeholder="Ej. BW-2026-0042"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="categoria" className="mb-1 block text-sm font-medium text-gov-ink">
                  Categoría <span aria-hidden="true">*</span>
                  <span className="sr-only"> (obligatorio)</span>
                </label>
                <select id="categoria" name="categoria" required className={inputClass}>
                  <option value="">Selecciona una opción</option>
                  {CATEGORIAS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="descripcion" className="mb-1 block text-sm font-medium text-gov-ink">
                Descripción del objeto de la licitación <span aria-hidden="true">*</span>
                <span className="sr-only"> (obligatorio)</span>
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                required
                rows={4}
                placeholder="Describe qué bien, servicio u obra se está licitando…"
                className={inputClass}
              />
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="mb-1 text-sm font-bold text-gov-ink">
              Presupuesto y fechas
            </legend>

            <div>
              <label htmlFor="presupuesto" className="mb-1 block text-sm font-medium text-gov-ink">
                Presupuesto estimado (RD$)
              </label>
              <input
                id="presupuesto"
                name="presupuesto"
                type="number"
                min={0}
                step="0.01"
                placeholder="0.00"
                className={inputClass}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="fecha-publicacion" className="mb-1 block text-sm font-medium text-gov-ink">
                  Fecha de publicación <span aria-hidden="true">*</span>
                  <span className="sr-only"> (obligatorio)</span>
                </label>
                <input id="fecha-publicacion" name="fechaPublicacion" type="date" required className={inputClass} />
              </div>
              <div>
                <label htmlFor="fecha-limite" className="mb-1 block text-sm font-medium text-gov-ink">
                  Fecha límite de propuestas <span aria-hidden="true">*</span>
                  <span className="sr-only"> (obligatorio)</span>
                </label>
                <input id="fecha-limite" name="fechaLimite" type="date" required className={inputClass} />
              </div>
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="mb-1 text-sm font-bold text-gov-ink">
              Pliego de condiciones
            </legend>

            <div>
              <label htmlFor="requisitos" className="mb-1 block text-sm font-medium text-gov-ink">
                Requisitos para participar
              </label>
              <textarea
                id="requisitos"
                name="requisitos"
                rows={3}
                placeholder="Ej. Estar inscrito en el RPE-DGCP, presentar garantía de oferta…"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="documento-pliego" className="mb-1 block text-sm font-medium text-gov-ink">
                Documento del pliego (PDF) <span aria-hidden="true">*</span>
                <span className="sr-only"> (obligatorio)</span>
              </label>
              <input
                id="documento-pliego"
                name="documentoPliego"
                type="file"
                required
                accept="application/pdf"
                className="block w-full text-sm text-gov-ink-muted file:mr-3 file:rounded-md file:border-0 file:bg-gov-blue-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-gov-blue-700 hover:file:bg-blue-200"
              />
            </div>
          </fieldset>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="flex-1 rounded-md bg-gov-blue-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gov-blue-800"
            >
              Publicar licitación
            </button>
            <Link
              href="/gobierno"
              className="flex-1 rounded-md border border-gov-border px-4 py-2.5 text-center text-sm font-semibold text-gov-ink hover:bg-gov-surface"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}