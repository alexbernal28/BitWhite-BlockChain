/**
 * Configuración centralizada de navegación.
 *
 * Se mantiene en un solo lugar para cumplir NORTIC A2:2023, Sección 2.01,
 * directriz (b.iv): "El texto del encabezado principal del contenido de una
 * página web debe ser consistente con el texto del botón o hipervínculo al
 * que el usuario hizo clic para llegar a dicha página web." El mismo mapa se
 * usa para el menú principal, el rastro de navegación (breadcrumbs) y los
 * encabezados <h1> de cada portal.
 */

export type PortalKey = "ciudadano" | "empresas" | "gobierno";

export interface NavItem {
  href: string;
  label: string;
}

/** Menú principal horizontal de la cabecera (Sección 3.02, directriz b). */
export const MAIN_NAV: NavItem[] = [
  { href: "/", label: "Inicio" },
  { href: "/ciudadano", label: "Portal Ciudadano" },
  { href: "/empresas", label: "Portal de Empresas" },
  { href: "/gobierno", label: "Panel de Gobierno" },
];

export const LOGIN_NAV: NavItem = { href: "/login", label: "Iniciar sesión" };

/**
 * Etiquetas para el rastro de navegación, indexadas por segmento de ruta.
 * Debe coincidir exactamente con MAIN_NAV / LOGIN_NAV.
 */
export const BREADCRUMB_LABELS: Record<string, string> = {
  ciudadano: "Portal Ciudadano",
  empresas: "Portal de Empresas",
  gobierno: "Panel de Gobierno",
  login: "Iniciar sesión",
};

/**
 * Menú en cuadrícula desplegable de enlaces de interés
 * (NORTIC A2:2023, Sección 4.01, directriz c).
 * Los URL de "Portales" son los oficiales exigidos por la norma.
 */
export const INTEREST_MENU: {
  heading: string;
  links: { label: string; href: string }[];
}[] = [
  {
    heading: "Portales",
    links: [
      { label: "Portal del Estado Dominicano", href: "https://www.dominicana.gob.do" },
      { label: "Portal de Servicios del Gobierno (gob.do)", href: "https://www.gob.do" },
      { label: "Sistema 311 - Atención Ciudadana", href: "https://www.311.gob.do" },
      { label: "Sistema Nacional de Emergencias 911", href: "https://www.911.gob.do" },
    ],
  },
  {
    heading: "Instituciones relacionadas",
    links: [
      { label: "Dirección General de Contrataciones Públicas", href: "https://www.dgcp.gob.do" },
      { label: "Instituto Tecnológico de las Américas (ITLA)", href: "https://www.itla.edu.do" },
    ],
  },
];
