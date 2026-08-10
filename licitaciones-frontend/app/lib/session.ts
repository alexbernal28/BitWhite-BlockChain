"use client";

import type { AuthUser } from "./api";

const STORAGE_KEY = "bitwhite_session";

export interface Session {
  token: string;
  user: AuthUser;
}

export function saveSession(session: Session) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

/** Ruta del portal correspondiente al rol de la sesión activa. */
export function portalPathForRole(role: AuthUser["role"]): string {
  switch (role) {
    case "ciudadano":
      return "/ciudadano";
    case "empresa":
      return "/empresas";
    case "gobierno":
      return "/gobierno";
    default:
      return "/";
  }
}
