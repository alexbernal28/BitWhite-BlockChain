import LegalPage from "../components/LegalPage";

export const metadata = { title: "Términos de uso" };

export default function TerminosDeUsoPage() {
  return (
    <LegalPage title="Términos de uso" updated="20 de junio de 2026">
      <p>
        Este documento establece los términos que regulan el uso del portal
        BitWhite, desarrollado como proyecto de grado del Grupo 19 del Centro
        de Excelencia en Software del Instituto Tecnológico de las Américas
        (ITLA).
      </p>
      <h2 className="text-base font-semibold text-gov-ink">1. Naturaleza del portal</h2>
      <p>
        BitWhite es un prototipo académico. La información publicada aquí no
        constituye un registro oficial de licitaciones del Estado dominicano
        mientras el proyecto se encuentre en fase de desarrollo (ver el
        roadmap técnico del equipo).
      </p>
      <h2 className="text-base font-semibold text-gov-ink">2. Uso permitido</h2>
      <p>
        El acceso a los portales Ciudadano, Empresas y Gobierno es de
        carácter demostrativo. No debe introducirse información sensible o
        real de terceros durante esta fase del proyecto.
      </p>
      <h2 className="text-base font-semibold text-gov-ink">3. Propiedad intelectual</h2>
      <p>
        El código fuente del proyecto se encuentra disponible en el
        repositorio público del equipo bajo los términos allí indicados.
      </p>
    </LegalPage>
  );
}
