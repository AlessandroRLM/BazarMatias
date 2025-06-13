import { User } from "./auth.types"
import { Product } from "./inventory.types"


export interface Client {
  id: string
  national_id: string
  first_name: string
  last_name: string
  email?: string
  phone_number?: string
  formatted_rut?: string
}

export interface SaleDetail {
  id: string
  product: Product
  quantity: number
  unit_price: number
}

export type DocumentType = 'FAC' | 'BOL'  // Factura o Boleta
export type PaymentMethod = 'EF' | 'TC' | 'TD' | 'TR' | 'OT' // Efectivo, Tarjeta Crédito, Tarjeta Débito, Transferencia, Otro
export type SaleStatus = 'PE' | 'PA' | 'CA'


// Sale original para las respuestas
export interface Sale {
  id: string
  client: Client | null
  document_type: DocumentType
  folio: number
  created_at: string
  payment_method: PaymentMethod
  status: SaleStatus
  details: SaleDetail[]
  net_amount: number
  iva: number
  total_amount: number
}

export interface Return {
  id: string;
  client: {
    id: string;
    national_id: string;
    first_name: string;
    last_name: string;
    email?: string;
    phone_number?: string;
  };
  cliente_nombre: string;
  sale: {
    id: string;
    folio: number;
    date: string;
  };
  fecha_venta: string;
  product: {
    id: string;
    supplier: string;
    supplier_name: string;
    is_below_min_stock: boolean;
    name: string;
    price_clp: number;
    iva: boolean;
    stock: number;
    min_stock: number;
    category: string;
    data: any;
  };
  producto_nombre: string;
  quantity: number;
  reason: string;
  created_at: string;
  status: 'pending' | 'completed' | 'refused' | null;
}

export interface ReturnCreationPayload {
  client_id: string;
  sale_id: string;
  product_id: string;
  quantity: number;
  reason: string;
}

export interface QuoteDetail {
    id: string
    product: string
    quantity: number
    unit_price: number
    discount: number

}

export interface Quote {
    id: string
    client: string
    details: QuoteDetail[]
    status: string
    created_at: Date
    total: number
}

export type WorkOrderPriority = 'baja' | 'media' | 'alta'
export type WorkOrderStatus = 'pendiente' | 'en_proceso' | 'completada' | 'cancelada'

export interface WorkOrder {
  id: string
  numero_orden: string
  trabajador: User
  tipo_tarea: string
  descripcion: string
  prioridad: WorkOrderPriority
  plazo: string // ISO date string
  status: WorkOrderStatus
  created_at: string
  trabajador_nombre?: string
  trabajador_rut?: string
  trabajador_cargo?: string
}

// Nuevo tipo para el payload de actualización
export type WorkOrderUpdatePayload = Omit<Partial<WorkOrder>, 'trabajador'> & {
  trabajador: string  // Solo el ID (string)
}

// Tipos para filtros
export interface SaleFilters {
  document_type?: DocumentType
  payment_method?: PaymentMethod
  search?: string
  ordering?: string
}

export interface QuoteFilters {
  client?: string
  search?: string
  ordering?: string
}

export interface ReturnFilters {
  sale_folio?: string
  product_name?: string
  search?: string
  ordering?: string
}

export interface WorkOrderFilters {
  worker_id?: string
  status?: WorkOrderStatus
  search?: string
  ordering?: string
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

export type { Product };
