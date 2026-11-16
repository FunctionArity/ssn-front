import { storage } from "../auth/storage";

const BASE_URL = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// Called when the API refuses the token (expired, password changed, user locked), to send the user to sign in.
let onUnauthorized: () => void = () => {};
export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler;
}

type Params = Record<string, string | number | undefined | null>;

export async function api<T>(path: string, options: { method?: string; body?: unknown; params?: Params } = {}): Promise<T> {
  const url = new URL(`${BASE_URL}/api/v1${path}`, window.location.origin);
  for (const [key, value] of Object.entries(options.params ?? {})) {
    if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
  }

  const headers: Record<string, string> = { Accept: "application/json" };
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  const token = storage.token();
  if (token) headers.Authorization = `Bearer ${token}`;
  const headquarterId = storage.headquarterId();
  if (headquarterId) headers["X-Headquarter-Id"] = headquarterId;

  let response: Response;
  try {
    response = await fetch(url, {
      method: options.method ?? "GET",
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch {
    throw new ApiError(0, "No se pudo conectar con el servidor.");
  }

  const data = response.headers.get("Content-Type")?.includes("json") ? await response.json() : null;
  if (!response.ok) {
    if (response.status === 401 && token) onUnauthorized();
    throw new ApiError(response.status, data?.error ?? `Error ${response.status}`);
  }
  return data as T;
}
