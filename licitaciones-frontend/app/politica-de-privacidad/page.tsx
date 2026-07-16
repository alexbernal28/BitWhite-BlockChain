import LegalPage from "../components/LegalPage";

export const metadata = { title: "Política de privacidad" };

export default function PoliticaDePrivacidadPage() {
  return (
    <LegalPage title="Política de privacidad" updated="20 de junio de 2026">
      <p>
        BitWhite garantiza la confidencialidad de la información que maneja y
        de los servicios que ofrece, tanto a la ciudadanía como a las
        empresas proveedoras y entidades gubernamentales que participan del
        sistema.
      </p>
      <h2 className="text-base font-semibold text-gov-ink">Datos que se recopilan</h2>
      <p>
        Durante el registro y la autenticación, el sistema recopila datos de
        identificación de usuarios (correo electrónico, contraseña cifrada
        con bcrypt) y, para empresas, datos de la propuesta y su huella
        criptográfica (hash SHA-256).
      </p>
      <h2 className="text-base font-semibold text-gov-ink">Uso de la información</h2>
      <p>
        Los datos suministrados se usan únicamente para dar seguimiento al
        proceso de licitación solicitado. No se difunde, distribuye ni
        comercializa información personal, salvo consentimiento expreso del
        usuario.
      </p>
      <h2 className="text-base font-semibold text-gov-ink">Cookies</h2>
      <p>
        El portal puede almacenar y recuperar información sobre los hábitos
        de navegación de los usuarios con fines exclusivamente funcionales.
      </p>
    </LegalPage>
  );
}
