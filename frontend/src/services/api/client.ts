/**
 * HTTP client for the Spring Boot backend.
 *
 * Behaviour:
 * - When VITE_API_URL is set, requests go to that base URL.
 * - When VITE_API_URL is unset OR a request fails (network error / 5xx /
 *   timeout), the caller is expected to catch `ApiUnavailableError` and
 *   transparently fall back to the local mock implementation.
 *
 * This keeps a single source of truth on the frontend: every feature talks
 * to the same `api` facade, and we only change the data source.
 */

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, "") || "";
const TIMEOUT_MS = 6000;

export const isRealApiConfigured = () => Boolean(BASE_URL);

export class ApiUnavailableError extends Error {
  constructor(message = "Real API unavailable") {
    super(message);
    this.name = "ApiUnavailableError";
  }
}

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

function getToken(): string | null {
  try {
    const raw = localStorage.getItem("todoist_auth");
    if (!raw) return null;
    return JSON.parse(raw)?.state?.token ?? null;
  } catch {
    return null;
  }
}

interface RequestOpts extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean;
}

export async function request<T>(path: string, opts: RequestOpts = {}): Promise<T> {
  if (!BASE_URL) throw new ApiUnavailableError("VITE_API_URL not set");

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(opts.headers as Record<string, string>),
  };
  if (opts.auth !== false) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...opts,
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
      signal: ctrl.signal,
    });
  } catch (e) {
    clearTimeout(timer);
    // Network / CORS / abort — treat as backend unavailable so caller can fall back.
    throw new ApiUnavailableError((e as Error)?.message);
  }
  clearTimeout(timer);

  if (res.status >= 500) {
    throw new ApiUnavailableError(`Server ${res.status}`);
  }
  if (!res.ok) {
    let body: unknown;
    try { body = await res.json(); } catch { body = await res.text().catch(() => undefined); }
    throw new ApiError(res.status, `Request failed: ${res.status}`, body);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

/**
 * Try the real API; on `ApiUnavailableError`, run the mock fallback.
 * Real auth/business errors (4xx) bubble up unchanged.
 */
export async function withFallback<T>(real: () => Promise<T>, mock: () => Promise<T>): Promise<T> {
  if (!isRealApiConfigured()) return mock();
  try {
    return await real();
  } catch (e) {
    if (e instanceof ApiUnavailableError) {
      if (import.meta.env.DEV) console.info("[api] Falling back to mock:", e.message);
      return mock();
    }
    throw e;
  }
}