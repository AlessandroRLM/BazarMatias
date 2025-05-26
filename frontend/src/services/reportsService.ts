import AxiosInstance from '../helpers/AxiosInstance';

// Descargar reporte PDF de usuarios
export const downloadUserReportPDF = async (): Promise<Blob> => {
  const response = await AxiosInstance.get('/api/reports/users/', {
    responseType: 'blob', // --> para recibir el archivo
  });
  return response.data;
};

// Descargar reporte PDF de inventario
export const downloadInventoryReportPDF = async (): Promise<Blob> => {
  const response = await AxiosInstance.get('/api/reports/inventory/', {
    responseType: 'blob', // --> para recibir el archivo
  });
  return response.data;
};

// Descargar reporte PDF de proveedores
export const downloadSupplierReportPDF = async (): Promise<Blob> => {
  const response = await AxiosInstance.get('/api/reports/suppliers/', {
    responseType: 'blob', // --> para recibir el archivo
  });
  return response.data;
};

// Descargar reporte PDF de ventas
export const downloadSalesReportPDF = async (): Promise<Blob> => {
  const response = await AxiosInstance.get('/api/reports/sales/', {
    responseType: 'blob',
  });
  return response.data;
};