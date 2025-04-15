import * as React from 'react';

interface PaginationParams {
  page: number;
  pageSize: number;
}

interface PaginationResult<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
}

export function usePagination<T>(
  fetchData: (params: PaginationParams) => Promise<PaginationResult<T>>,
  initialPage = 1,
  initialPageSize = 10,
  demoData?: T[], // Nuevo parámetro para datos de ejemplo
  demoTotalItems?: number // Total de items para el modo demo
) {
  const [data, setData] = React.useState<T[]>([]);
  const [currentPage, setCurrentPage] = React.useState(initialPage);
  const [pageSize, setPageSize] = React.useState(initialPageSize);
  const [totalItems, setTotalItems] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [isDemoMode, setIsDemoMode] = React.useState(!!demoData); // Estado para modo demo

  const fetchDataWithPagination = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (isDemoMode && demoData) {
        // Modo demo: usa los datos de ejemplo
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = demoData.slice(startIndex, endIndex);
        
        setData(paginatedData);
        setTotalItems(demoTotalItems || demoData.length);
        setTotalPages(Math.ceil((demoTotalItems || demoData.length) / pageSize));
      } else {
        // Modo real: llama al backend
        const result = await fetchData({ page: currentPage, pageSize });
        setData(result.data);
        setTotalItems(result.totalItems);
        setTotalPages(result.totalPages);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching data'));
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, fetchData, isDemoMode, demoData, demoTotalItems]);

  React.useEffect(() => {
    fetchDataWithPagination();
  }, [fetchDataWithPagination, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Función para cambiar entre modo demo y real
  const toggleDemoMode = (enable: boolean) => {
    setIsDemoMode(enable);
    // Refrescar datos cuando se cambia el modo
    fetchDataWithPagination();
  };

  return {
    data,
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    isLoading,
    error,
    isDemoMode,
    handlePageChange,
    setPageSize,
    toggleDemoMode,
    refresh: fetchDataWithPagination,
  };
}