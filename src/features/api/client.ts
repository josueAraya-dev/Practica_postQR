import { clearToken, getToken } from '@/features/auth/session';
import router from '@/router';

export const API_BASE_URL = 'https://ds4-demo-5w8lmtds.on-forge.com';

const REQUEST_TIMEOUT_MS = 15_000;
const HTTP_UNAUTHORIZED = 401;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function leerMensajeDeError(response: Response): Promise<string> {
  try {
    const json = await response.json();
    if (typeof json?.message === 'string') return json.message;
  } catch {
    // La respuesta no era JSON; se usa el mensaje genérico
  }
  return `Error ${response.status}`;
}

/**
 * fetch contra el backend: agrega la URL base, los headers JSON, el token
 * Bearer (si hay sesión) y un timeout. Si el backend responde 401 se borra
 * la sesión y se manda al usuario al login.
 */
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = new URL(path, API_BASE_URL);
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  if (options.body) headers.set('Content-Type', 'application/json');

  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, { ...options, headers, signal: controller.signal });

    if (response.status === HTTP_UNAUTHORIZED && token) {
      clearToken();
      router.replace('/login');
      throw new ApiError('Tu sesión expiró, vuelve a iniciar sesión', response.status);
    }

    if (!response.ok) {
      throw new ApiError(await leerMensajeDeError(response), response.status);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (controller.signal.aborted) throw new ApiError('El servidor tardó demasiado en responder', 0);
    throw new ApiError('No se pudo conectar con el servidor', 0);
  } finally {
    clearTimeout(timeoutId);
  }
}
