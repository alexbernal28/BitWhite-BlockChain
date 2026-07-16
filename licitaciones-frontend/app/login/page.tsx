"use client";

import Link from "next/link";
import { useState } from "react";

const PROFILES = [
  { id: "ciudadano", label: "Ciudadano" },
  { id: "empresa", label: "Empresa" },
  { id: "gobierno", label: "Entidad gubernamental" },
] as const;

const SIGNUP_CONFIG: Record<
  (typeof PROFILES)[number]["id"],
  { question: string; label: string; href?: string }
> = {
  ciudadano: {
    question: "¿Nuevo en BitWhite?",
    label: "Crea tu cuenta de ciudadano",
    href: "/registro",
  },
  empresa: {
    question: "¿Eres una empresa proveedora nueva?",
    label: "Regístrate en el Portal de Empresas",
    href: "/empresas/registro",
  },
  gobierno: {
    question: "¿Tu institución aún no tiene acceso?",
    label: "Solicita una cuenta institucional a tu administrador BitWhite",
  },
};

export default function LoginPage() {
  const [profile, setProfile] = useState<(typeof PROFILES)[number]["id"]>("ciudadano");

  return (
    <div className="flex flex-1 items-center justify-center bg-gov-surface px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-gov-border bg-white p-8 shadow-sm">
        <h1 className="text-center text-2xl font-bold text-gov-ink">Iniciar sesión</h1>
        <p className="mt-1 text-center text-sm text-gov-ink-muted">
          Sistema de Licitaciones Transparentes — BitWhite
        </p>

        {/* Selector de perfil */}
        <fieldset className="mt-6">
          <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-gov-ink-muted">
            Ingresar como
          </legend>
          <div className="grid grid-cols-3 gap-2">
            {PROFILES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setProfile(p.id)}
                aria-pressed={profile === p.id}
                className={`rounded-md border px-2 py-2 text-xs font-medium transition-colors ${
                  profile === p.id
                    ? "border-gov-blue-900 bg-gov-blue-900 text-white"
                    : "border-gov-border text-gov-ink hover:border-gov-blue-700"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </fieldset>

        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => e.preventDefault()}
          aria-describedby="login-status-note"
        >
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gov-ink">
              Correo electrónico <span aria-hidden="true">*</span>
              <span className="sr-only">(obligatorio)</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              maxLength={254}
              placeholder="nombre@correo.com"
              className="w-full rounded-md border border-gov-border px-3 py-2.5 text-sm text-gov-ink placeholder:text-gov-ink-muted focus:border-gov-blue-700"
            />
          </div>

          <div>
            <div className="mb-1 flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gov-ink">
                Contraseña <span aria-hidden="true">*</span>
                <span className="sr-only">(obligatorio)</span>
              </label>
              <Link href="/login/recuperar" className="text-xs font-medium text-gov-blue-700 hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              maxLength={128}
              className="w-full rounded-md border border-gov-border px-3 py-2.5 text-sm text-gov-ink focus:border-gov-blue-700"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-gov-blue-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gov-blue-800"
          >
            Entrar como {PROFILES.find((p) => p.id === profile)?.label.toLowerCase()}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gov-ink-muted">
          {SIGNUP_CONFIG[profile].question}{" "}
          {SIGNUP_CONFIG[profile].href ? (
            <Link
              href={SIGNUP_CONFIG[profile].href}
              className="font-semibold text-gov-blue-700 hover:underline"
            >
              {SIGNUP_CONFIG[profile].label}
            </Link>
          ) : (
            <span className="font-semibold text-gov-ink">{SIGNUP_CONFIG[profile].label}</span>
          )}
        </p>
      </div>
    </div>
  );
}