import { useState, useEffect } from "react";
import { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
import { Button, Stack, Typography, Box, Checkbox } from "@mui/joy";
import CustomTable from "../../components/core/CustomTable/CustomTable";
import Header from "../../components/core/layout/components/Header";
import FilterOptions, { SelectConfig } from "../../components/core/FilterOptions/FilterOptions";
import { Link as RouterLink } from '@tanstack/react-router';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/joy/IconButton';
import { Link } from "@tanstack/react-router";

interface Return {
  id?: string;
  provider?: string;
  product?: string;
  date?: string;
  status?: 'Pendiente' | 'Resuelto';
}

interface Filters {
  search?: string;
  productType?: string;
}

const initialData: Return[] = [
  {
    id: "1",
    provider: "Proveedor A",
    product: "Producto X",
    date: "2023-05-15",
    status: "Pendiente"
  },
  {
    id: "2",
    provider: "Proveedor B",
    product: "Producto Y",
    date: "2023-05-16",
    status: "Resuelto"
  },
  {
    id: "3",
    provider: "Proveedor C",
    product: "Producto Z",
    date: "2023-05-17",
    status: "Resuelto"
  },
  {
    id: "4",
    provider: "Proveedor D",
    product: "Producto W",
    date: "2023-05-18",
    status: "Pendiente"
  },
  {
    id: "5",
    provider: "Proveedor E",
    product: "Producto V",
    date: "2023-05-19",
    status: "Pendiente"
  },
];

export default function ReturnManagementPage() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [filteredData, setFilteredData] = useState<Return[]>(initialData);
  const [data, setData] = useState<Return[]>(initialData);

  const handleCheckboxChange = (id: string) => {
    setData(prevData => 
      prevData.map(item => 
        item.id === id && item.status === 'Pendiente'
          ? { ...item, status: 'Resuelto' } 
          : item
      )
    );
  };

  const columns: ColumnDef<Return>[] = [
    { 
      accessorKey: "provider", 
      header: "Proveedor", 
      cell: info => <Typography fontWeight="md">{info.getValue<string>()}</Typography> 
    },
    { 
      accessorKey: "product", 
      header: "Producto" 
    },
    { 
      accessorKey: "date", 
      header: "Fecha" 
    },
    { 
      accessorKey: "status", 
      header: "Estado", 
      cell: info => {
        const status = info.getValue<string>();
        let color: 'success' | 'warning' | 'neutral';
        
        switch(status) {
          case 'Pendiente':
            color = 'warning';
            break;
          case 'Resuelto':
            color = 'success';
            break;
          default:
            color = 'neutral';
        }
        
        return (
          <Typography color={color}>
            {status}
          </Typography>
        );
      } 
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const status = row.original.status;
        const isPending = status === 'Pendiente';
        
        return (
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              variant="plain"
              color="neutral"
              size="sm"
              aria-label="View"
              component={RouterLink}
              to={`/proveedores/devoluciones/ver-devolucion`}
            >
              <VisibilityIcon />
            </IconButton>
            <Checkbox 
              size="sm" 
              color="primary" 
              checked={status === 'Resuelto'}
              onChange={isPending ? () => handleCheckboxChange(row.original.id!) : undefined}
              disabled={status === 'Resuelto'}
              sx={{ ml: 1 }} 
            />
            {isPending && (
              <IconButton
                component={RouterLink}
                to={`/proveedores/devoluciones/editar-devolucion`}
                variant="plain"
                color="neutral"
                size="sm"
                aria-label="Edit"
              >
                <EditIcon />
              </IconButton>
            )}
          </Stack>
        );
      },
    },
  ];

  // Configuración de los selects de filtro
  const selectConfigs: SelectConfig[] = [
    {
      id: "productType",
      placeholder: "Tipo de Producto",
      options: [
        { value: "", label: "Todos" },
        { value: "Electrónica", label: "Electrónica" },
        { value: "Muebles", label: "Muebles" },
        { value: "Ropa", label: "Ropa" },
      ],
    }
  ];

  // Efecto para aplicar los filtros
  useEffect(() => {
    let result = [...data];
    
    // Filtro por tipo de producto
    if (filters.productType) {
      result = result.filter(item => item.product?.includes(filters.productType!));
    }
    
    // Filtro por búsqueda
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(item => 
        item.provider?.toLowerCase().includes(searchTerm) ||
        item.product?.toLowerCase().includes(searchTerm) ||
        item.date?.toLowerCase().includes(searchTerm)
      );
    }
    
    setFilteredData(result);
  }, [filters, data]);

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ 
        flex: 1, 
        p: 3, 
        pt: { xs: 'calc(var(--Header-height) + 16px)', md: 3 }, 
        maxWidth: '1600px', 
        mx: 'auto', 
        width: '100%' 
      }}>
        <Stack spacing={3}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography level="h2">Gestión de Devoluciones</Typography>
            <Button 
              component={Link}
              to="/proveedores/devoluciones/crear-devolucion"
              variant="solid" 
              color="primary"
            >
              Añadir
            </Button>
          </Stack>
          
          {/* Componente de filtros */}
          <FilterOptions<Filters>
            onChangeFilters={handleFilterChange}
            selects={selectConfigs}
            searchPlaceholder="Buscar devoluciones..."
          />
          
          <CustomTable<Return>
            data={filteredData}
            columns={columns}
            pagination={pagination}
            paginationOptions={{ 
              onPaginationChange: setPagination, 
              rowCount: filteredData.length 
            }}
            sorting={sorting}
            onSortingChange={setSorting}
          />
        </Stack>
      </Box>
    </Box>
  );
}