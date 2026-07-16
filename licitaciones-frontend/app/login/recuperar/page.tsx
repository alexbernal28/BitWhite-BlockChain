import Link from "next/link";

export const metadata = { title: "Recuperar contraseña" };

export default function RecuperarPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-gov-surface px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-gov-border bg-white p-8 text-center shadow-sm">
        <h1 className="text-xl font-bold text-gov-ink">Recuperar contraseña</h1>
        <p className="mt-3 text-sm text-gov-ink-muted">
          Este módulo se implementará junto a la autenticación (JWT + bcrypt)
          en la Fase 4 del roadmap técnico del proyecto.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-md bg-gov-blue-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gov-blue-800"
        >
          Volver a iniciar sesión
        </Link>
      </div>
    </div>
  );
}
