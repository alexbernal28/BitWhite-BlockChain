import LegalPage from "../components/LegalPage";

export const metadata = { title: "Preguntas frecuentes" };

const FAQS = [
  {
    q: "¿Qué es BitWhite?",
    a: "Un sistema web de gestión transparente de licitaciones públicas que combina una arquitectura cliente-servidor con un registro en blockchain para garantizar la inmutabilidad de los eventos clave del proceso.",
  },
  {
    q: "¿Quién puede usar el Portal Ciudadano?",
    a: "Cualquier persona. No requiere registro: permite consultar y auditar el historial público de licitaciones.",
  },
  {
    q: "¿Cómo se verifica un documento en BitWhite?",
    a: "Cada documento genera una huella criptográfica (hash SHA-256) que se registra en la blockchain, permitiendo comprobar que no ha sido alterado desde su publicación.",
  },
  {
    q: "¿El sistema ya está en producción?",
    a: "No. BitWhite se encuentra en desarrollo activo como proyecto de grado; el estado actual de cada módulo se documenta en el roadmap técnico del equipo.",
  },
];

export default function PreguntasFrecuentesPage() {
  return (
    <LegalPage title="Preguntas frecuentes" updated="20 de junio de 2026">
      <div className="divide-y divide-gov-border">
        {FAQS.map((item) => (
          <details key={item.q} className="group py-4 first:pt-0">
            <summary className="cursor-pointer list-none text-sm font-semibold text-gov-ink marker:content-none">
              <span className="flex items-center justify-between gap-3">
                {item.q}
                <span aria-hidden="true" className="text-gov-blue-700 group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <p className="mt-2 text-sm text-gov-ink-muted">{item.a}</p>
          </details>
        ))}
      </div>
    </LegalPage>
  );
}
