import { useState, useEffect } from "react";
import { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
import { Button, Stack, Typography, Box } from "@mui/joy";
import CustomTable from "../../components/core/CustomTable/CustomTable";
import Header from "../../components/core/layout/components/Header";
import FilterOptions, { SelectConfig } from "../../components/core/FilterOptions/FilterOptions";
import { Link as RouterLink } from '@tanstack/react-router';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/joy/IconButton';
import { Link } from "@tanstack/react-router";

interface Order {
  id?: string;
  name?: string;
  details?: string;
  charge?: string;
  status?: 'Pendiente' | 'En Proceso' | 'Completado' | 'Cancelado';
  productType?: string;
}

interface Filters {
  search?: string;
  productType?: string;
}

const sampleData: Order[] = [
  {
    id: "1",
    name: "Pedido #001",
    details: "Materiales de construcción",
    charge: "Juan Pérez",
    status: "Pendiente",
    productType: "Construcción"
  },
  {
    id: "2",
    name: "Pedido #002",
    details: "Suministros de oficina",
    charge: "María García",
    status: "En Proceso",
    productType: "Oficina"
  },
  {
    id: "3",
    name: "Pedido #003",
    details: "Equipos electrónicos",
    charge: "Carlos López",
    status: "Completado",
    productType: "Electrónica"
  },
  {
    id: "4",
    name: "Pedido #004",
    details: "Materiales de limpieza",
    charge: "Ana Martínez",
    status: "Cancelado",
    productType: "Limpieza"
  },
  {
    id: "5",
    name: "Pedido #005",
    details: "Herramientas manuales",
    charge: "Luis Rodríguez",
    status: "En Proceso",
    productType: "Herramientas"
  },
];

const columns: ColumnDef<Order>[] = [
  { 
    accessorKey: "name", 
    header: "Nombre", 
    cell: info => <Typography fontWeight="md">{info.getValue<string>()}</Typography> 
  },
  { 
    accessorKey: "details", 
    header: "Detalle" 
  },
  { 
    accessorKey: "charge", 
    header: "Cargo" 
  },
  { 
    accessorKey: "status", 
    header: "Status", 
    cell: info => {
      const status = info.getValue<string>();
      let color: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
      
      switch(status) {
        case 'Pendiente':
          color = 'warning';
          break;
        case 'En Proceso':
          color = 'primary';
          break;
        case 'Completado':
          color = 'success';
          break;
        case 'Cancelado':
          color = 'danger';
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
    cell: ({ row }) => (
      <Stack direction="row" spacing={1}>
        <IconButton
          variant="plain"
          color="neutral"
          size="sm"
          aria-label="View"
          component={RouterLink}
          to={`/proveedores/ordenesdecompra/ver-orden`}
        >
          <VisibilityIcon />
        </IconButton>
        <IconButton
          component={RouterLink}
          to={`/proveedores/ordenesdecompra/editar-orden`}
          variant="plain"
          color="neutral"
          size="sm"
          aria-label="Edit"
        >
          <EditIcon />
        </IconButton>
        <IconButton
          variant="plain"
          color="danger"
          size="sm"
          aria-label="Delete"
          //onClick={() => handleDeleteClick()}
        >
          <DeleteIcon />
        </IconButton>
      </Stack>
    ),
  },
];

export default function OrderManagementPage() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [filteredData, setFilteredData] = useState<Order[]>(sampleData);

  // Configuración de los selects de filtro
  const selectConfigs: SelectConfig[] = [
    {
      id: "productType",
      placeholder: "Tipo de Producto",
      options: [
        { value: "", label: "Todos" },
        { value: "Construcción", label: "Construcción" },
        { value: "Oficina", label: "Oficina" },
        { value: "Electrónica", label: "Electrónica" },
        { value: "Limpieza", label: "Limpieza" },
        { value: "Herramientas", label: "Herramientas" },
      ],
    }
  ];

  // Efecto para aplicar los filtros
  useEffect(() => {
    let result = [...sampleData];
    
    // Filtro por tipo de producto
    if (filters.productType) {
      result = result.filter(item => item.productType === filters.productType);
    }
    
    // Filtro por búsqueda
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(item => 
        item.name?.toLowerCase().includes(searchTerm) ||
        item.details?.toLowerCase().includes(searchTerm) ||
        item.charge?.toLowerCase().includes(searchTerm)
      );
    }
    
    setFilteredData(result);
  }, [filters]);

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
            <Typography level="h2">Lista Ordenes de Trabajo</Typography>
            <Button 
              component={Link}
              to="/proveedores/ordenesdecompra/crear-orden"
              variant="solid" 
              color="primary"
            >
              Crear Pedido
            </Button>
          </Stack>
          
          {/* Componente de filtros */}
          <FilterOptions<Filters>
            onChangeFilters={handleFilterChange}
            selects={selectConfigs}
            searchPlaceholder="Buscar pedidos..."
          />
          
          <CustomTable<Order>
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