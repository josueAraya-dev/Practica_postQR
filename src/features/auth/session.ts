// El token de Sanctum se guarda en localStorage para que la sesión sobreviva al cerrar la app
const TOKEN_KEY = 'pedidos-app:token';

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Si el almacenamiento no está disponible no hay nada que borrar
  }
}

export function hasSession(): boolean {
  return getToken() !== null;
}
