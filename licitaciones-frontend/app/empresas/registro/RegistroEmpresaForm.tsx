"use client";

import Link from "next/link";
import { useState } from "react";
import { registerEmpresa, ApiError } from "../../lib/api";
import { saveSession } from "../../lib/session";

const SECTORES = [
  "Construcción e infraestructura",
  "Tecnología y servicios digitales",
  "Consultoría y servicios profesionales",
  "Suministro de bienes y equipos",
  "Salud y farmacéutica",
  "Transporte y logística",
  "Otro",
];

const PROVINCIAS = [
  "Distrito Nacional",
  "Santo Domingo",
  "Santiago",
  "La Vega",
  "San Cristóbal",
  "Puerto Plata",
  "La Altagracia",
  "San Pedro de Macorís",
  "Duarte",
  "Azua",
  "Otra provincia",
];

export default function RegistroEmpresaForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordsMismatch = confirm.length > 0 && password !== confirm;

  return (
    <div className="flex flex-1 justify-center bg-gov-surface px-4 py-12">
      <div className="w-full max-w-2xl rounded-xl border border-gov-border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gov-ink">Registro de empresa proveedora</h1>
        <p className="mt-1 text-sm text-gov-ink-muted">
          Este registro crea la cuenta de tu empresa en BitWhite y su perfil
          en el modelo <code className="text-xs">Company</code> del backend,
          para poder postularte a licitaciones públicas.
        </p>

        {submitted ? (
          <div className="mt-8 rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-center">
            <p className="text-sm font-semibold text-emerald-800">
              Cuenta de empresa creada e iniciada sesión correctamente.
            </p>
            <Link
              href="/empresas"
              className="mt-4 inline-block text-sm font-semibold text-gov-blue-700 hover:underline"
            >
              Volver al Portal de Empresas
            </Link>
          </div>
        ) : (
          <form
            className="mt-8 space-y-8"
            onSubmit={async (e) => {
              e.preventDefault();
              if (passwordsMismatch) return;

              const data = new FormData(e.currentTarget);
              const razonSocial = String(data.get("razonSocial") || "");
              const nombreComercial = String(data.get("nombreComercial") || "");

              setError(null);
              setLoading(true);
              try {
                const { token, user } = await registerEmpresa({
                  name: String(data.get("contactoNombre") || ""),
                  email: String(data.get("contactoEmail") || ""),
                  password,
                  companyName: nombreComercial || razonSocial,
                  rnc: String(data.get("rnc") || ""),
                  razonSocial,
                  address: String(data.get("direccion") || "") || undefined,
                  sectorEconomico: String(data.get("sector") || ""),
                  phone: String(data.get("contactoTelefono") || ""),
                  cargoEmpresa: String(data.get("contactoCargo") || ""),
                  provincia: String(data.get("provincia") || ""),
                });
                saveSession({ token, user });
                setSubmitted(true);
              } catch (err) {
                setError(err instanceof ApiError ? err.message : "No se pudo completar el registro.");
              } finally {
                setLoading(false);
              }
            }}
            noValidate={false}
          >
            {error && (
              <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                {error}
              </p>
            )}

            {/* Datos de la empresa */}
            <fieldset className="space-y-4">
              <legend className="mb-1 text-sm font-bold text-gov-ink">
                Datos de la empresa
              </legend>

              <Field label="RNC" htmlFor="rnc" required>
                <input
                  id="rnc"
                  name="rnc"
                  type="text"
                  required
                  inputMode="numeric"
                  placeholder="Ej. 1-30-12345-6"
                  pattern="[0-9\-]{9,15}"
                  className={inputClass}
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Razón social" htmlFor="razon-social" required>
                  <input id="razon-social" name="razonSocial" type="text" required className={inputClass} />
                </Field>
                <Field label="Nombre comercial" htmlFor="nombre-comercial">
                  <input id="nombre-comercial" name="nombreComercial" type="text" className={inputClass} />
                </Field>
              </div>

              <Field label="Sector económico" htmlFor="sector" required>
                <select id="sector" name="sector" required className={inputClass}>
                  <option value="">Selecciona una opción</option>
                  {SECTORES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </Field>
            </fieldset>

            {/* Datos de contacto */}
            <fieldset className="space-y-4">
              <legend className="mb-1 text-sm font-bold text-gov-ink">
                Datos del representante
              </legend>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Nombre completo" htmlFor="contacto-nombre" required>
                  <input id="contacto-nombre" name="contactoNombre" type="text" required className={inputClass} />
                </Field>
                <Field label="Cargo en la empresa" htmlFor="contacto-cargo" required>
                  <input id="contacto-cargo" name="contactoCargo" type="text" required className={inputClass} />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Correo electrónico" htmlFor="contacto-email" required>
                  <input
                    id="contacto-email"
                    name="contactoEmail"
                    type="email"
                    required
                    autoComplete="email"
                    className={inputClass}
                  />
                </Field>
                <Field label="Teléfono" htmlFor="contacto-telefono" required>
                  <input
                    id="contacto-telefono"
                    name="contactoTelefono"
                    type="tel"
                    required
                    placeholder="(809) 000-0000"
                    className={inputClass}
                  />
                </Field>
              </div>
            </fieldset>

            {/* Dirección */}
            <fieldset className="space-y-4">
              <legend className="mb-1 text-sm font-bold text-gov-ink">Dirección fiscal</legend>

              <Field label="Dirección" htmlFor="direccion" required>
                <input id="direccion" name="direccion" type="text" required className={inputClass} />
              </Field>

              <Field label="Provincia" htmlFor="provincia" required>
                <select id="provincia" name="provincia" required className={inputClass}>
                  <option value="">Selecciona una opción</option>
                  {PROVINCIAS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </Field>
            </fieldset>

            {/* Documentación legal */}
            <fieldset className="space-y-4">
              <legend className="mb-1 text-sm font-bold text-gov-ink">
                Documentación legal
              </legend>

              <FileField
                id="registro-mercantil"
                label="Registro Mercantil vigente"
                required
              />
              <FileField
                id="rpe-dgcp"
                label="Certificación del Registro de Proveedores del Estado (RPE-DGCP)"
                helpText="Opcional en esta etapa; podrá adjuntarse después de crear la cuenta."
              />
            </fieldset>

            {/* Credenciales */}
            <fieldset className="space-y-4">
              <legend className="mb-1 text-sm font-bold text-gov-ink">
                Credenciales de acceso
              </legend>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Contraseña" htmlFor="password" required>
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
                </Field>
                <Field
                  label="Confirmar contraseña"
                  htmlFor="confirm-password"
                  required
                  error={passwordsMismatch ? "Las contraseñas no coinciden." : undefined}
                >
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
                </Field>
              </div>
              <p className="text-xs text-gov-ink-muted">Mínimo 8 caracteres.</p>
            </fieldset>

            {/* Aceptación de términos */}
            <label htmlFor="acepto" className="flex items-start gap-2 text-sm text-gov-ink">
              <input
                id="acepto"
                name="acepto"
                type="checkbox"
                required
                className="mt-0.5 h-4 w-4 rounded border-gov-border text-gov-blue-700 focus-visible:outline-2"
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
              disabled={loading}
              className="w-full rounded-md bg-gov-blue-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gov-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creando cuenta…" : "Crear cuenta de empresa"}
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

const inputClass =
  "w-full rounded-md border border-gov-border px-3 py-2.5 text-sm text-gov-ink placeholder:text-gov-ink-muted focus:border-gov-blue-700";

function Field({
  label,
  htmlFor,
  required,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-gov-ink">
        {label}
        {required && (
          <>
            <span aria-hidden="true"> *</span>
            <span className="sr-only"> (obligatorio)</span>
          </>
        )}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1 text-xs font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

function FileField({
  id,
  label,
  required,
  helpText,
}: {
  id: string;
  label: string;
  required?: boolean;
  helpText?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gov-ink">
        {label}
        {required && (
          <>
            <span aria-hidden="true"> *</span>
            <span className="sr-only"> (obligatorio)</span>
          </>
        )}
      </label>
      <input
        id={id}
        name={id}
        type="file"
        required={required}
        accept="application/pdf"
        className="block w-full text-sm text-gov-ink-muted file:mr-3 file:rounded-md file:border-0 file:bg-gov-blue-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-gov-blue-700 hover:file:bg-blue-200"
      />
      {helpText && <p className="mt-1 text-xs text-gov-ink-muted">{helpText}</p>}
    </div>
  );
}
