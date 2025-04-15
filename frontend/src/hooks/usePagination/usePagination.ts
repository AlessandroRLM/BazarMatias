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
  demoData?: T[],
  demoTotalItems?: number
) {
  const [data, setData] = React.useState<T[]>([]);
  const [currentPage, setCurrentPage] = React.useState(initialPage);
  const [pageSize, setPageSize] = React.useState(initialPageSize);
  const [totalItems, setTotalItems] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [isDemoMode, setIsDemoMode] = React.useState(!!demoData);
  const [connectionStatus, setConnectionStatus] = React.useState<'idle' | 'connecting' | 'error'>('idle');

  const fetchDataWithPagination = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (isDemoMode && demoData) {
        // Modo demo
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = demoData.slice(startIndex, endIndex);
        
        setData(paginatedData);
        setTotalItems(demoTotalItems || demoData.length);
        setTotalPages(Math.ceil((demoTotalItems || demoData.length) / pageSize));
      } else {
        // Modo real
        const result = await fetchData({ page: currentPage, pageSize });
        setData(result.data);
        setTotalItems(result.totalItems);
        setTotalPages(result.totalPages);
      }
      setConnectionStatus('idle');
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Error fetching data'));
      setConnectionStatus('error');
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

  const toggleDemoMode = async (enable: boolean) => {
    if (!enable) {
      setConnectionStatus('connecting');
      try {
        // Verificar conexión al backend
        const response = await fetch('/api/healthcheck');
        if (!response.ok) throw new Error('Backend no disponible');
        
        setIsDemoMode(false);
        setConnectionStatus('idle');
      } catch (error) {
        console.error("Error connecting to backend:", error);
        setConnectionStatus('error');
        throw error;
      }
    } else {
      setIsDemoMode(true);
      setConnectionStatus('idle');
    }
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
    connectionStatus, // Nuevo estado exportado
    handlePageChange,
    setPageSize,
    toggleDemoMode,
    refresh: fetchDataWithPagination,
  };
}