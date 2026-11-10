import { apiFetch } from '@/features/api/client';
import { clearToken, saveToken } from '@/features/auth/session';

const DEVICE_NAME = 'movil';

export async function login(email: string, password: string): Promise<void> {
  const { token } = await apiFetch<{ token: string }>('/api/sanctum/token', {
    method: 'POST',
    body: JSON.stringify({ email, password, device_name: DEVICE_NAME }),
  });
  saveToken(token);
}

// El backend no expone un endpoint para revocar el token, así que solo se borra localmente
export function logout(): void {
  clearToken();
}
