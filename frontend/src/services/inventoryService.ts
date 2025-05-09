import AxiosInstance from '../helpers/AxiosInstance';

// CRUD de Proveedores con paginación, búsqueda y filtros
export const fetchSuppliers = async ({
  page = 1,
  page_size = 10,
  search = '',
  category = '',
  ordering = '',
}: {
  page?: number;
  page_size?: number;
  search?: string;
  category?: string;
  ordering?: string;
} = {}) => {
  let url = `/api/inventory/suppliers/?page=${page}&page_size=${page_size}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (category) url += `&category=${encodeURIComponent(category)}`;
  if (ordering) url += `&ordering=${encodeURIComponent(ordering)}`;
  const response = await AxiosInstance.get(url);
  return response.data;
};

export const fetchSupplier = async (id: string) => {
  const response = await AxiosInstance.get(`/api/inventory/suppliers/${id}/`);
  return response.data;
};

export const createSupplier = async (supplier: any) => {
  const response = await AxiosInstance.post('/api/inventory/suppliers/', supplier);
  return response.data;
};

export const updateSupplier = async (id: string, supplier: any) => {
  const response = await AxiosInstance.put(`/api/inventory/suppliers/${id}/`, supplier);
  return response.data;
};

export const deleteSupplier = async (id: string) => {
  await AxiosInstance.delete(`/api/inventory/suppliers/${id}/`);
};

// CRUD de Productos con paginación, búsqueda y filtros
export const fetchProducts = async ({
  page = 1,
  page_size = 10,
  search = '',
  category = '',
  supplier = '',
  ordering = '',
}: {
  page?: number;
  page_size?: number;
  search?: string;
  category?: string;
  supplier?: string;
  ordering?: string;
} = {}) => {
  let url = `/api/inventory/products/?page=${page}&page_size=${page_size}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (category) url += `&category=${encodeURIComponent(category)}`;
  if (supplier) url += `&supplier=${encodeURIComponent(supplier)}`;
  if (ordering) url += `&ordering=${encodeURIComponent(ordering)}`;
  const response = await AxiosInstance.get(url);
  return response.data;
};

export const fetchProduct = async (id: string) => {
  const response = await AxiosInstance.get(`/api/inventory/products/${id}/`);
  return response.data;
};

export const createProduct = async (product: any) => {
  const response = await AxiosInstance.post('/api/inventory/products/', product);
  return response.data;
};

export const updateProduct = async (id: string, product: any) => {
  const response = await AxiosInstance.put(`/api/inventory/products/${id}/`, product);
  return response.data;
};

export const deleteProduct = async (id: string) => {
  await AxiosInstance.delete(`/api/inventory/products/${id}/`);
};

// CRUD de Insumos (Supplies)
export const fetchSupplies = async ({
  page = 1,
  page_size = 10,
  search = '',
  category = '',
  ordering = '',
}: {
  page?: number;
  page_size?: number;
  search?: string;
  category?: string;
  ordering?: string;
} = {}) => {
  let url = `/api/inventory/supplies/?page=${page}&page_size=${page_size}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (category) url += `&category=${encodeURIComponent(category)}`;
  if (ordering) url += `&ordering=${encodeURIComponent(ordering)}`;
  const response = await AxiosInstance.get(url);
  return response.data;
};

export const fetchSupply = async (id: string) => {
  const response = await AxiosInstance.get(`/api/inventory/supplies/${id}/`);
  return response.data;
};

export const createSupply = async (supply: any) => {
  const response = await AxiosInstance.post('/api/inventory/supplies/', supply);
  return response.data;
};

export const updateSupply = async (id: string, supply: any) => {
  const response = await AxiosInstance.put(`/api/inventory/supplies/${id}/`, supply);
  return response.data;
};

export const deleteSupply = async (id: string) => {
  await AxiosInstance.delete(`/api/inventory/supplies/${id}/`);
};

// CRUD de Mermas (Shrinkages) con paginación, búsqueda y filtros
export const fetchShrinkages = async ({
  page = 1,
  page_size = 10,
  search = '',
  category = '',
  ordering = '',
}: {
  page?: number;
  page_size?: number;
  search?: string;
  category?: string;
  ordering?: string;
} = {}) => {
  let url = `/api/inventory/shrinkages/?page=${page}&page_size=${page_size}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (category) url += `&category=${encodeURIComponent(category)}`;
  if (ordering) url += `&ordering=${encodeURIComponent(ordering)}`;
  const response = await AxiosInstance.get(url);
  return response.data;
};

export const fetchShrinkage = async (id: string) => {
  const response = await AxiosInstance.get(`/api/inventory/shrinkages/${id}/`);
  return response.data;
};

export const createShrinkage = async (shrinkage: any) => {
  const response = await AxiosInstance.post('/api/inventory/shrinkages/', shrinkage);
  return response.data;
};

export const updateShrinkage = async (id: string, shrinkage: any) => {
  const response = await AxiosInstance.put(`/api/inventory/shrinkages/${id}/`, shrinkage);
  return response.data;
};

export const deleteShrinkage = async (id: string) => {
  await AxiosInstance.delete(`/api/inventory/shrinkages/${id}/`);
};

// CRUD de Devoluciones de Proveedores (ReturnSupplier)
export const fetchReturnSuppliers = async ({
  page = 1,
  page_size = 10,
  search = '',
  ordering = '',
}: {
  page?: number;
  page_size?: number;
  search?: string;
  ordering?: string;
} = {}) => {
  let url = `/api/inventory/return-suppliers/?page=${page}&page_size=${page_size}`;
  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (ordering) url += `&ordering=${encodeURIComponent(ordering)}`;
  const response = await AxiosInstance.get(url);
  return response.data;
};

export const fetchReturnSupplier = async (id: string) => {
  const response = await AxiosInstance.get(`/api/inventory/return-suppliers/${id}/`);
  return response.data;
};

export const createReturnSupplier = async (returnData: any) => {
  const response = await AxiosInstance.post(`/api/inventory/return-suppliers/`, returnData);
  return response.data;
};

export const updateReturnSupplier = async (id: string, returnData: any) => {
  const response = await AxiosInstance.patch(`/api/inventory/return-suppliers/${id}/`, returnData);
  return response.data;
};

export const deleteReturnSupplier = async (id: string) => {
  await AxiosInstance.delete(`/api/inventory/return-suppliers/${id}/`);
};

export const resolveReturn = async (id: string) => {
  const response = await AxiosInstance.patch(`/api/inventory/return-suppliers/${id}/resolve/`);
  return response.data;
};