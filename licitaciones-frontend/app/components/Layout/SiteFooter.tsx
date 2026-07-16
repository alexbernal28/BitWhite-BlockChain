import Link from "next/link";
import { BitWhiteMark } from "./Logos";

const SOCIAL_LINKS = [
  { label: "X (Twitter)", href: "https://x.com" },
  { label: "Facebook", href: "https://facebook.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "YouTube", href: "https://youtube.com" },
];

/**
 * Pie de página (NORTIC A2:2023, Sección 3.02, directriz f — Opción B,
 * tema oscuro). Contiene únicamente los elementos permitidos por la norma:
 * logo del Gobierno, "Conócenos", contactos, "Búscanos", "Infórmate"
 * (Términos de uso / Política de privacidad / Preguntas frecuentes), año +
 * derechos de autor, sello de certificación NORTIC y redes sociales
 * (máximo 4, a todo color, sin plugins).
 */
export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gov-blue-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        {/* Logo del Gobierno + Conócenos */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <BitWhiteMark className="h-9 w-9" />
            <span className="text-sm font-bold">Gobierno de la República Dominicana</span>
          </div>
          <h2 className="mb-1 text-sm font-semibold text-white">Conócenos</h2>
          <p className="text-sm leading-relaxed text-blue-100">
            BitWhite (BW) — Sistema de Licitaciones Públicas con verificación en
            Blockchain. Proyecto de grado, Centro de Excelencia en Software, ITLA.
          </p>
        </div>

        {/* Contactos */}
        <div>
          <h2 className="mb-2 text-sm font-semibold text-white">Contactos</h2>
          <ul className="space-y-1.5 text-sm text-blue-100">
            <li>Tel.: (809) 000-0000</li>
            <li>Fax: (809) 000-0001</li>
            <li>
              <a href="mailto:contacto@bitwhite.gob.do" className="hover:underline">
                contacto@bitwhite.gob.do
              </a>
            </li>
          </ul>

          <h2 className="mb-2 mt-4 text-sm font-semibold text-white">Búscanos</h2>
          <p className="text-sm text-blue-100">
            Av. Panamericana, Santo Domingo, República Dominicana
          </p>
        </div>

        {/* Infórmate */}
        <div>
          <h2 className="mb-2 text-sm font-semibold text-white">Infórmate</h2>
          <ul className="space-y-1.5 text-sm">
            <li>
              <Link href="/terminos-de-uso" className="text-blue-100 hover:text-white hover:underline">
                Términos de uso
              </Link>
            </li>
            <li>
              <Link href="/politica-de-privacidad" className="text-blue-100 hover:text-white hover:underline">
                Política de privacidad
              </Link>
            </li>
            <li>
              <Link href="/preguntas-frecuentes" className="text-blue-100 hover:text-white hover:underline">
                Preguntas frecuentes
              </Link>
            </li>
          </ul>

          <h2 className="mb-2 mt-4 text-sm font-semibold text-white">Síguenos</h2>
          <ul className="flex gap-3">
            {SOCIAL_LINKS.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-blue-100 hover:bg-white/20 hover:text-white"
                >
                  <span aria-hidden="true" className="text-[10px] font-bold">
                    {social.label.charAt(0)}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Sello de certificación NORTIC */}
        <div className="flex flex-col items-start gap-2 md:items-end">
          <div
            role="img"
            aria-label="Espacio reservado para el sello digital de certificación NORTIC A2"
            className="flex h-[100px] w-[100px] flex-col items-center justify-center rounded-full border-2 border-dashed border-blue-300/60 text-center text-[10px] leading-tight text-blue-100"
          >
            <span className="font-bold">NORTIC</span>
            <span>A2</span>
            <span className="mt-1 text-[8px]">Sello pendiente</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-blue-100 sm:px-6">
          © {year} BitWhite — Grupo 19, ITLA. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
