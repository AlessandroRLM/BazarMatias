import AxiosInstance from '../helpers/AxiosInstance';
import { CustomPagination } from '../types/core.types';
import { Client, Sale, Quote, Return, WorkOrder, WorkOrderUpdatePayload, CreateSaleData, SaleUpdateData } from '../types/sales.types';

// CRUD de Clientes con paginación, búsqueda y filtros
export const fetchClients = async ({
  page = 1,
  page_size = 10,
  search = '',
  ordering = '',
}: {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
} = {}): Promise<CustomPagination<Client>> => {
  let url = `/api/sales/clients/?page=${page}&page_size=${page_size}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (ordering) url += `&ordering=${encodeURIComponent(ordering)}`;
  const response = await AxiosInstance.get(url);
  return response.data;
};

export const fetchClient = async (id: string): Promise<Client> => {
  const response = await AxiosInstance.get(`/api/sales/clients/${id}/`);
  return response.data;
};

export const createClient = async (client: Omit<Client, 'id'>): Promise<Client> => {
  const response = await AxiosInstance.post('/api/sales/clients/', client);
  return response.data;
};

export const updateClient = async (id: string, client: Partial<Client>): Promise<Client> => {
  const response = await AxiosInstance.put(`/api/sales/clients/${id}/`, client);
  return response.data;
};

export const deleteClient = async (id: string): Promise<void> => {
  await AxiosInstance.delete(`/api/sales/clients/${id}/`);
};

// CRUD de Ventas con paginación, búsqueda y filtros
export const fetchSales = async ({
  page = 1,
  page_size = 10,
  search = '',
  document_type = '',
  payment_method = '',
  ordering = '-created_at',
  created_at_after = '',
  created_at_before = ''
}: {
  page?: number;
  page_size?: number;
  search?: string;
  document_type?: string;
  payment_method?: string;
  ordering?: string;
  created_at_after?: string;
  created_at_before?: string;
} = {}): Promise<CustomPagination<Sale>> => {
  let url = `/api/sales/sales/?page=${page}&page_size=${page_size}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (document_type) url += `&document_type=${encodeURIComponent(document_type)}`;
  if (payment_method) url += `&payment_method=${encodeURIComponent(payment_method)}`;
  if (ordering) url += `&ordering=${encodeURIComponent(ordering)}`;
  if (created_at_after) url += `&created_at_after=${encodeURIComponent(created_at_after)}`;
  if (created_at_before) url += `&created_at_before=${encodeURIComponent(created_at_before)}`;
  
  const response = await AxiosInstance.get(url);
  return response.data;
};

export async function updateSaleStatus(id: string, status: string) {
  const { data } = await AxiosInstance.patch(`/api/sales/sales/${id}/cambiar-estado/`, { status });
  return data;
}

export const fetchSaleById = async (id: string): Promise<Sale> => {
  const response = await AxiosInstance.get(`/api/sales/sales/${id}/`);
  return response.data;
};

export const createSale = async (sale: CreateSaleData): Promise<Sale> => {
  const response = await AxiosInstance.post('/api/sales/sales/', sale);
  return response.data;
};

export const updateSale = async (id: string, sale: SaleUpdateData): Promise<Sale> => {
  const response = await AxiosInstance.put(`/api/sales/sales/${id}/`, sale);
  return response.data;
};

export const deleteSale = async (id: string): Promise<void> => {
  await AxiosInstance.delete(`/api/sales/sales/${id}/`);
};

// CRUD de Cotizaciones con paginación, búsqueda y filtros
export const fetchQuotes = async ({
  page = 1,
  page_size = 10,
  search = '',
  client = '',
  ordering = '-created_at',
  created_at_after = '',
  created_at_before = ''
}: {
  page?: number;
  page_size?: number;
  search?: string;
  client?: string;
  ordering?: string;
  created_at_after?: string;
  created_at_before?: string;
} = {}): Promise<CustomPagination<Quote>> => {
  let url = `/api/sales/quotes/?page=${page}&page_size=${page_size}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (client) url += `&client=${encodeURIComponent(client)}`;
  if (ordering) url += `&ordering=${encodeURIComponent(ordering)}`;
  if (created_at_after) url += `&created_at_after=${encodeURIComponent(created_at_after)}`;
  if (created_at_before) url += `&created_at_before=${encodeURIComponent(created_at_before)}`;
  
  const response = await AxiosInstance.get(url);
  return response.data;
};

export const fetchQuote = async (id: string): Promise<Quote> => {
  const response = await AxiosInstance.get(`/api/sales/quotes/${id}/`);
  return response.data;
};

export const createQuote = async (quote: Omit<Quote, 'id' | 'created_at'>): Promise<Quote> => {
  const response = await AxiosInstance.post('/api/sales/quotes/', quote);
  return response.data;
};

export const updateQuote = async (id: string, quote: Partial<Quote>): Promise<Quote> => {
  const response = await AxiosInstance.put(`/api/sales/quotes/${id}/`, quote);
  return response.data;
};

export const deleteQuote = async (id: string): Promise<void> => {
  await AxiosInstance.delete(`/api/sales/quotes/${id}/`);
};

// CRUD de Devoluciones con paginación, búsqueda y filtros
export const fetchReturns = async ({
  page = 1,
  page_size = 10,
  search = '',
  sale_folio = '',
  product_name = '',
  ordering = '-created_at',
}: {
  page?: number;
  page_size?: number;
  search?: string;
  sale_folio?: string;
  product_name?: string;
  ordering?: string;
} = {}): Promise<CustomPagination<Return>> => {
  let url = `/api/sales/returns/?page=${page}&page_size=${page_size}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (sale_folio) url += `&sale__folio=${encodeURIComponent(sale_folio)}`;
  if (product_name) url += `&product__name=${encodeURIComponent(product_name)}`;
  if (ordering) url += `&ordering=${encodeURIComponent(ordering)}`;
  const response = await AxiosInstance.get(url);
  return response.data;
};

export const fetchReturn = async (id: string): Promise<Return> => {
  const response = await AxiosInstance.get(`/api/sales/returns/${id}/`);
  return response.data;
};

export const createReturn = async (returnData: Omit<Return, 'id' | 'created_at'>): Promise<Return> => {
  const response = await AxiosInstance.post('/api/sales/returns/', returnData);
  return response.data;
};

export const updateReturn = async (id: string, returnData: Partial<Return>): Promise<Return> => {
  const response = await AxiosInstance.put(`/api/sales/returns/${id}/`, returnData);
  return response.data;
};

export const deleteReturn = async (id: string): Promise<void> => {
  await AxiosInstance.delete(`/api/sales/returns/${id}/`);
};

// CRUD de Órdenes de Trabajo con paginación, búsqueda y filtros
export const fetchWorkOrders = async ({
  page = 1,
  page_size = 10,
  search = '',
  worker_id = '',
  status = '',
  ordering = '-created_at',
}: {
  page?: number;
  page_size?: number;
  search?: string;
  worker_id?: string;
  status?: string;
  ordering?: string;
} = {}): Promise<CustomPagination<WorkOrder>> => {
  let url = `/api/sales/work-orders/?page=${page}&page_size=${page_size}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (worker_id) url += `&trabajador__national_id=${encodeURIComponent(worker_id)}`;
  if (status) url += `&status=${encodeURIComponent(status)}`;
  if (ordering) url += `&ordering=${encodeURIComponent(ordering)}`;
  const response = await AxiosInstance.get(url);
  return response.data;
};

export const fetchWorkOrder = async (id: string): Promise<WorkOrder> => {
  const response = await AxiosInstance.get(`/api/sales/work-orders/${id}/`);
  return response.data;
};

export const createWorkOrder = async (workOrder: Omit<WorkOrder, 'id' | 'created_at'>): Promise<WorkOrder> => {
  const response = await AxiosInstance.post('/api/sales/work-orders/', workOrder);
  return response.data;
};

export const updateWorkOrder = async (
    id: string, 
    workOrder: WorkOrderUpdatePayload
): Promise<WorkOrder> => {
    const response = await AxiosInstance.put(`/api/sales/work-orders/${id}/`, workOrder);
    return response.data;
};

export const deleteWorkOrder = async (id: string): Promise<void> => {
  await AxiosInstance.delete(`/api/sales/work-orders/${id}/`);
};

// Métodos especiales para Ventas
export const getNextSaleFolio = async (documentType: 'FAC' | 'BOL'): Promise<number> => {
  const response = await AxiosInstance.get(`/api/sales/document-counter/?document_type=${documentType}`);
  return response.data.next_folio;
};

// Métodos para el dashboard
export const fetchDashboardStats = async (): Promise<{
  monthlyProfit: number;
  previousMonthProfit: number;
  totalSales: number;
  paidSales: number;
  dueSales: number;
  approvedQuotes: number;
  pendingQuotes: number;
  rejectedQuotes: number;
  topClients: { name: string; value: number }[];
}> => {
  const response = await AxiosInstance.get('/api/sales/dashboard/stats/');
  return response.data;
};

export const fetchMonthlyProfitData = async (): Promise<
  { name: string; value: number; previousValue?: number }[]
> => {
  const response = await AxiosInstance.get('/api/sales/dashboard/monthly_profit/');
  return response.data;
};

export const fetchTopProductsData = async (): Promise<
  { name: string; value: number; percentage?: number }[]
> => {
  const response = await AxiosInstance.get('/api/sales/dashboard/top_products/');
  return response.data;
};
