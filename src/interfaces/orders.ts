export interface Customer {
  id: number;
  name: string;
}

export interface Order {
  id: number;
  numero_orden: string;
  iva: number;
  total: string;
  customer: Customer;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
