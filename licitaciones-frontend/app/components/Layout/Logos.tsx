/**
 * ⚠️ MARCAS DE MARCADOR DE POSICIÓN (placeholder)
 * ------------------------------------------------
 * Estos componentes SVG son sustitutos genéricos, NO el Escudo Nacional
 * oficial ni el logo real de la institución (ambos son activos con derechos
 * reservados que no deben recrearse a mano). Antes de pasar a producción,
 * reemplazar por los archivos oficiales:
 *   - Escudo Nacional: Manual de Identidad del Gobierno Dominicano / DIECOM.
 *   - Línea gráfica y componentes: repositorio del Sistema de Diseño
 *     Dominicano — https://github.com/opticrd/sdd-lib
 *   - Logo institucional: proveído por ITLA / equipo BitWhite.
 */

export function EscudoPlaceholder({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 44"
      role="img"
      aria-label="Escudo Nacional de la República Dominicana (marcador de posición)"
      className={className}
    >
      <path
        d="M20 1 L37 7 V21 C37 32 30 40 20 43 C10 40 3 32 3 21 V7 Z"
        fill="#ffffff"
        stroke="var(--gov-blue-800)"
        strokeWidth="1.6"
      />
      <path d="M20 3.3 L20 41.2" stroke="var(--gov-blue-800)" strokeWidth="1.1" />
      <path d="M4.4 12.6 L35.6 12.6" stroke="var(--gov-blue-800)" strokeWidth="1.1" />
      <rect x="4.6" y="12.9" width="15.1" height="9.2" fill="#CE1126" />
      <rect x="20.3" y="12.9" width="15.1" height="9.2" fill="#002D62" />
      <rect x="4.6" y="3.6" width="15.1" height="8.7" fill="#002D62" />
      <rect x="20.3" y="3.6" width="15.1" height="8.7" fill="#CE1126" />
      <circle cx="20" cy="17.5" r="4.4" fill="#ffffff" stroke="var(--gov-blue-800)" strokeWidth="1" />
    </svg>
  );
}

export function BitWhiteMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      role="img"
      aria-label="BitWhite — Sistema de Licitaciones Públicas Transparentes"
      className={className}
    >
      <rect x="1" y="1" width="38" height="38" rx="9" fill="var(--gov-blue-900)" />
      <path
        d="M12 27 V13 h7.2 a4.3 4.3 0 0 1 0 8.6 H12"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 21.6 h8.4 a4.3 4.3 0 0 1 0 8.6 H12"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="28.5" cy="11.5" r="2.4" fill="#5EEAD4" />
    </svg>
  );
}
