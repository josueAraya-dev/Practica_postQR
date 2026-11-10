import { apiFetch } from '@/features/api/client';
import type { Order, PaginatedResponse } from '@/interfaces/orders';

export async function getOrders(page: number): Promise<{ orders: Order[]; lastPage: number }> {
  const params = new URLSearchParams({ page: String(page) });
  const { data, meta } = await apiFetch<PaginatedResponse<Order>>(`/api/orders?${params}`);
  return { orders: data, lastPage: meta.last_page };
}

export async function getOrder(id: string | number): Promise<Order> {
  const { data } = await apiFetch<{ data: Order }>(`/api/orders/${encodeURIComponent(id)}`);
  return data;
}

// El backend manda el IVA con muchos decimales (ej. 52.237899999999996); se muestra igual que el total
export function formatMonto(valor: number | string): string {
  return Number(valor).toFixed(2);
}
