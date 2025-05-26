import { User } from "./auth.types";
import { Product } from "./inventory.types";

export interface Client {
  id: string;
  national_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone_number?: string;
  formatted_rut?: string;
}

export interface SaleDetail {
  id: string;
  product: Product;
  quantity: number;
  unit_price: number;
  discount: number;
  net_price: number;
  iva_amount: number;
}

export type DocumentType = 'FAC' | 'BOL'; // Factura o Boleta
export type PaymentMethod = 'EF' | 'TC' | 'TD' | 'TR' | 'OT'; // Efectivo, Tarjeta Crédito, Tarjeta Débito, Transferencia, Otro
export type SaleStatus = 'pending' | 'paid' | 'completed' | 'cancelled';

export type CreateSaleData = {
  document_type: DocumentType;
  client?: string;
  client_id?: string;
  payment_method: PaymentMethod;
  details: Array<{
    product_id: string;
    quantity: number;
    unit_price: number;
    discount: number;
  }>;
  net_amount: number;
  iva: number;
  total_amount: number;
};

export interface SaleUpdateData extends Omit<Partial<Sale>, 'client' | 'details'> {
  client: string | null;
  details: Array<{
    id?: string;
    product: string;
    quantity: number;
    unit_price: number;
    discount: number;
  }>;
}

// Sale original para las respuestas
export interface Sale {
  id: string;
  folio: string;
  created_at: string;
  client: Client | null;
  payment_method: string;
  details: {
    id?: string;
    product: Product;
    quantity: number;
    unit_price: number;
    discount: number;
  }[];
  net_amount: number;
  iva: number;
  total_amount: number;
  status: SaleStatus;
}
export interface QuoteDetail {
  id: string;
  product: Product;
  quantity: number;
  unit_price: number;
  discount: number;
}

export interface Quote {
  id: string;
  client: Client;
  created_at: string;
  details: QuoteDetail[];
  total: number;
}

export interface Return {
  id: string;
  client: Client;
  sale: {
    id: string;
    folio: number;
    created_at: string;
  };
  product: Product;
  quantity: number;
  reason: string;
  created_at: string;
  producto_nombre?: string;
  cliente_nombre?: string;
  fecha_venta?: string;
}

export type WorkOrderPriority = 'baja' | 'media' | 'alta';
export type WorkOrderStatus = 'pendiente' | 'en_proceso' | 'completada' | 'cancelada';

export interface WorkOrder {
  id: string;
  numero_orden: string;
  trabajador: User;
  tipo_tarea: string;
  descripcion: string;
  prioridad: WorkOrderPriority;
  plazo: string; // ISO date string
  status: WorkOrderStatus;
  created_at: string;
  trabajador_nombre?: string;
  trabajador_rut?: string;
  trabajador_cargo?: string;
}

// Nuevo tipo para el payload de actualización
export type WorkOrderUpdatePayload = Omit<Partial<WorkOrder>, 'trabajador'> & {
  trabajador: string;  // Solo el ID (string)
};

// Tipos para filtros
export interface SaleFilters {
  document_type?: DocumentType;
  payment_method?: PaymentMethod;
  search?: string;
  ordering?: string;
}

export interface QuoteFilters {
  client?: string;
  search?: string;
  ordering?: string;
}

export interface ReturnFilters {
  sale_folio?: string;
  product_name?: string;
  search?: string;
  ordering?: string;
}

export interface WorkOrderFilters {
  worker_id?: string;
  status?: WorkOrderStatus;
  search?: string;
  ordering?: string;
}

export interface CustomPagination<T> {
  info: {
    count: number;
    pages: number;
    current_page: number;
    next: number | null;
    previous: number | null;
  };
  results: T[];
}