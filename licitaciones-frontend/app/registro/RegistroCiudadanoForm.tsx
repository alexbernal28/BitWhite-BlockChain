"use client";

import Link from "next/link";
import { useState } from "react";

const inputClass =
  "w-full rounded-md border border-gov-border px-3 py-2.5 text-sm text-gov-ink placeholder:text-gov-ink-muted focus:border-gov-blue-700";

export default function RegistroCiudadanoForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const passwordsMismatch = confirm.length > 0 && password !== confirm;

  return (
    <div className="flex flex-1 justify-center bg-gov-surface px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-gov-border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gov-ink">Crear cuenta de ciudadano</h1>
        <p className="mt-1 text-sm text-gov-ink-muted">
          La consulta pública de licitaciones no requiere cuenta. Regístrate
          solo si quieres guardar búsquedas o dar seguimiento a procesos.
        </p>

        {submitted ? (
          <div className="mt-8 rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-center">
            <p className="text-sm font-semibold text-emerald-800">
              Formulario completo. En esta fase del proyecto los datos no se
              envían aún al backend (Fase 4 del roadmap).
            </p>
            <Link href="/ciudadano" className="mt-4 inline-block text-sm font-semibold text-gov-blue-700 hover:underline">
              Ir al Portal Ciudadano
            </Link>
          </div>
        ) : (
          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (passwordsMismatch) return;
              setSubmitted(true);
            }}
          >
            <div>
              <label htmlFor="nombre" className="mb-1 block text-sm font-medium text-gov-ink">
                Nombre completo <span aria-hidden="true">*</span>
                <span className="sr-only"> (obligatorio)</span>
              </label>
              <input id="nombre" name="nombre" type="text" required autoComplete="name" className={inputClass} />
            </div>

            <div>
              <label htmlFor="cedula" className="mb-1 block text-sm font-medium text-gov-ink">
                Cédula de identidad <span aria-hidden="true">*</span>
                <span className="sr-only"> (obligatorio)</span>
              </label>
              <input
                id="cedula"
                name="cedula"
                type="text"
                required
                inputMode="numeric"
                placeholder="000-0000000-0"
                pattern="[0-9\-]{11,13}"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-gov-ink">
                Correo electrónico <span aria-hidden="true">*</span>
                <span className="sr-only"> (obligatorio)</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="telefono" className="mb-1 block text-sm font-medium text-gov-ink">
                Teléfono
              </label>
              <input
                id="telefono"
                name="telefono"
                type="tel"
                placeholder="(809) 000-0000"
                className={inputClass}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="password" className="mb-1 block text-sm font-medium text-gov-ink">
                  Contraseña <span aria-hidden="true">*</span>
                  <span className="sr-only"> (obligatorio)</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="mb-1 block text-sm font-medium text-gov-ink">
                  Confirmar <span aria-hidden="true">*</span>
                  <span className="sr-only"> (obligatorio)</span>
                </label>
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  aria-invalid={passwordsMismatch}
                  className={inputClass}
                />
                {passwordsMismatch && (
                  <p role="alert" className="mt-1 text-xs font-medium text-red-700">
                    Las contraseñas no coinciden.
                  </p>
                )}
              </div>
            </div>

            <label htmlFor="acepto" className="flex items-start gap-2 text-sm text-gov-ink">
              <input
                id="acepto"
                name="acepto"
                type="checkbox"
                required
                className="mt-0.5 h-4 w-4 rounded border-gov-border text-gov-blue-700"
              />
              <span>
                He leído y acepto los{" "}
                <Link href="/terminos-de-uso" className="font-semibold text-gov-blue-700 hover:underline">
                  Términos de uso
                </Link>{" "}
                y la{" "}
                <Link href="/politica-de-privacidad" className="font-semibold text-gov-blue-700 hover:underline">
                  Política de privacidad
                </Link>
                .
              </span>
            </label>

            <button
              type="submit"
              className="w-full rounded-md bg-gov-blue-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gov-blue-800"
            >
              Crear cuenta
            </button>

            <p className="text-center text-sm text-gov-ink-muted">
              ¿Ya tienes cuenta?{" "}
              <Link href="/login" className="font-semibold text-gov-blue-700 hover:underline">
                Inicia sesión
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}