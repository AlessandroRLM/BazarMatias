import AxiosInstance from '../helpers/AxiosInstance';

// CRUD de Proveedores
export const fetchSuppliers = async () => {
  const response = await AxiosInstance.get('/api/inventory/suppliers/');
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

// CRUD de Productos
export const fetchProducts = async () => {
  const response = await AxiosInstance.get('/api/inventory/products/');
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