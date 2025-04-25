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

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  lastUpdated: string;
}

interface Filters {
  search?: string;
  category?: string;
  stockStatus?: string;
}

const sampleData: InventoryItem[] = [
  {
    id: "1",
    name: "Laptop HP EliteBook",
    category: "Electrónicos",
    stock: 15,
    price: 1200,
    lastUpdated: "2023-05-15",
  },
  {
    id: "2",
    name: "Mouse inalámbrico",
    category: "Accesorios",
    stock: 42,
    price: 25,
    lastUpdated: "2023-06-02",
  },
  {
    id: "3",
    name: "Teclado mecánico",
    category: "Accesorios",
    stock: 18,
    price: 75,
    lastUpdated: "2023-05-28",
  },
  {
    id: "4",
    name: "Monitor 24\"",
    category: "Electrónicos",
    stock: 8,
    price: 200,
    lastUpdated: "2023-06-10",
  },
  {
    id: "5",
    name: "Impresora Laser",
    category: "Electrónicos",
    stock: 5,
    price: 350,
    lastUpdated: "2023-06-05",
  },
];

const columns: ColumnDef<InventoryItem>[] = [
  { 
    accessorKey: "name", 
    header: "Producto", 
    cell: info => <Typography fontWeight="md">{info.getValue<string>()}</Typography> 
  },
  { 
    accessorKey: "category", 
    header: "Categoría" 
  },
  { 
    accessorKey: "price", 
    header: "Precio", 
    cell: info => `$${info.getValue<number>()}` 
  },
  { 
    accessorKey: "stock", 
    header: "Stock", 
    cell: info => {
      const stock = info.getValue<number>();
      return (
        <Typography color={stock > 20 ? 'success' : stock > 0 ? 'warning' : 'danger'}>
          {stock} unidades
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
        to={`/Inventory/productos/ver-producto`}
    >
        <VisibilityIcon />
    </IconButton>
    <IconButton
        component={RouterLink}
        to={`/Inventory/productos/editar-producto`}
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
        //onClick={() => handleDeleteClick(user.rut, user.name)}
    >
        <DeleteIcon />
    </IconButton>
</Stack>
    ),
  },
];

export default function InventoryManagementPage() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [filteredData, setFilteredData] = useState<InventoryItem[]>(sampleData);

  // Configuración de los selects de filtro
  const selectConfigs: SelectConfig[] = [
    {
      id: "category",
      placeholder: "Categoría",
      options: [
        { value: "", label: "Todas" },
        { value: "Electrónicos", label: "Electrónicos" },
        { value: "Accesorios", label: "Accesorios" },
      ],
    },
    {
      id: "stockStatus",
      placeholder: "Estado stock",
      options: [
        { value: "", label: "Todos" },
        { value: "high", label: "Alto (>20)" },
        { value: "medium", label: "Medio (1-20)" },
        { value: "low", label: "Agotado (0)" },
      ],
    },
  ];

  // Efecto para aplicar los filtros
  useEffect(() => {
    let result = [...sampleData];
    
    // Filtro de búsqueda
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchTerm) || 
        item.category.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filtro por categoría
    if (filters.category) {
      result = result.filter(item => item.category === filters.category);
    }
    
    // Filtro por estado de stock
    if (filters.stockStatus) {
      switch (filters.stockStatus) {
        case "high":
          result = result.filter(item => item.stock > 20);
          break;
        case "medium":
          result = result.filter(item => item.stock > 0 && item.stock <= 20);
          break;
        case "low":
          result = result.filter(item => item.stock === 0);
          break;
      }
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
            <Typography level="h2">Gestión de Productos</Typography>
            <Button 
            component={Link}
            to="/Inventory/productos/ProductCreation"
            variant="solid" 
            color="primary"
            >
            Añadir Producto
            </Button>
          </Stack>
          
          {/* Componente de filtros */}
          <FilterOptions<Filters>
            onChangeFilters={handleFilterChange}
            selects={selectConfigs}
          />
          
          <CustomTable<InventoryItem>
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