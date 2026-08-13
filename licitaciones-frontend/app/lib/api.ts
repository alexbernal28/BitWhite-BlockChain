/**
 * Cliente HTTP hacia bitwhite-backend. En esta fase del proyecto la
 * integración es directa (fetch + JWT en localStorage) sin capa de
 * blockchain: la verificación de integridad se hace comparando hashes
 * SHA-256 almacenados en PostgreSQL.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, options);
  } catch {
    throw new ApiError("No se pudo contactar al servidor. Verifica tu conexión.", 0);
  }

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(body?.message || "Ocurrió un error inesperado.", res.status);
  }

  return body?.data as T;
}

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

// ---------- Autenticación ----------

export type RoleName = "ciudadano" | "empresa" | "gobierno" | "administrador";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: RoleName;
  profile: Record<string, unknown> | null;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export function login(email: string, password: string) {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export interface RegisterCiudadanoPayload {
  name: string;
  email: string;
  password: string;
  cedula: string;
  phone?: string;
}

export function registerCiudadano(payload: RegisterCiudadanoPayload) {
  return request<AuthResponse>("/auth/register/ciudadano", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export interface RegisterEmpresaPayload {
  name: string;
  email: string;
  password: string;
  companyName: string;
  rnc: string;
  razonSocial: string;
  address?: string;
  sectorEconomico: string;
  phone: string;
  cargoEmpresa: string;
  provincia: string;
}

export function registerEmpresa(payload: RegisterEmpresaPayload) {
  return request<AuthResponse>("/auth/register/empresa", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

// ---------- Licitaciones (procurement) ----------

export interface Tender {
  id: number;
  title: string;
  processNumber: string;
  description: string;
  category: string;
  budget: string | null;
  publicationDate: string;
  deadline: string;
  requirements: string | null;
  documentPath: string | null;
  documentHash: string | null;
  status: "Publicada" | "En evaluación" | "Adjudicada" | "Cancelada";
  createdByUserId: number;
  awardedCompanyId: number | null;
  createdAt: string;
}

export function listTenders(status?: string) {
  const qs = status ? `?status=${encodeURIComponent(status)}` : "";
  return request<Tender[]>(`/procurement${qs}`);
}

export function listMyTenders(token: string) {
  return request<Tender[]>("/procurement/mine", { headers: authHeaders(token) });
}

export function getTender(id: number | string) {
  return request<Tender>(`/procurement/${id}`);
}

export function createTender(token: string, formData: FormData) {
  return request<Tender>("/procurement", {
    method: "POST",
    headers: authHeaders(token),
    body: formData,
  });
}

// ---------- Propuestas ----------

export interface ProposalDocumentInfo {
  id: number;
  documentName: string;
  filePath: string;
  documentHash: string;
  createdAt: string;
}

export interface ProposalCompanyInfo {
  id: number;
  companyName: string;
  rnc: string;
  razon_social: string;
}

export interface Proposal {
  id: number;
  tenderId: number;
  companyId: number;
  offeredAmount: string | null;
  message: string | null;
  status: "Enviada" | "En revisión" | "Aprobada" | "Rechazada";
  createdAt: string;
  tender?: Tender;
  company?: ProposalCompanyInfo;
  documents?: ProposalDocumentInfo[];
}

export interface ProposalResult {
  proposal: { id: number; tenderId: number; companyId: number; status: string };
  document: { id: number; documentName: string; documentHash: string };
}

export function submitProposal(token: string, formData: FormData) {
  return request<ProposalResult>("/proposals", {
    method: "POST",
    headers: authHeaders(token),
    body: formData,
  });
}

/** Propuestas enviadas por la empresa autenticada. */
export function listMyProposals(token: string) {
  return request<Proposal[]>("/proposals/mine", { headers: authHeaders(token) });
}

/** Propuestas recibidas por una licitación (solo la institución que la publicó). */
export function listProposalsForTender(token: string, tenderId: number | string) {
  return request<Proposal[]>(`/proposals/tender/${tenderId}`, { headers: authHeaders(token) });
}

/** Detalle completo de una propuesta. */
export function getProposal(token: string, id: number | string) {
  return request<Proposal>(`/proposals/${id}`, { headers: authHeaders(token) });
}

/** URL pública para descargar/visualizar un documento subido (pliego o propuesta). */
export function documentUrl(filePath: string) {
  return `${API_BASE_URL.replace(/\/api\/?$/, "")}/uploads/${filePath}`;
}

// ---------- Auditoría ----------

export interface VerifyResult {
  match: boolean;
  type?: "tender" | "proposal";
  reference?: Record<string, unknown>;
}

export function verifyHash(hash: string) {
  return request<VerifyResult>("/audit/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ hash }),
  });
}
