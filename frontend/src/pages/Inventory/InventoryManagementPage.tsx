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
import { fetchProducts, deleteProduct } from "../../services/inventoryService";

interface InventoryItem {
  id: string;
  nombre: string;
  categoria: string;
  stock: number;
  precio: number;
  lastUpdated?: string;
}

interface Filters {
  search?: string;
  category?: string;
  stockStatus?: string;
}

const columns: ColumnDef<InventoryItem>[] = [
  { 
    accessorKey: "nombre", 
    header: "Producto", 
    cell: info => <Typography fontWeight="md">{info.getValue<string>()}</Typography> 
  },
  { 
    accessorKey: "categoria", 
    header: "Categoría" 
  },
  { 
    accessorKey: "precio", 
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
          to={`/Inventory/productos/ver-producto/${row.original.id}`}
        >
          <VisibilityIcon />
        </IconButton>
        <IconButton
          component={RouterLink}
          to={`/Inventory/productos/editar-producto/${row.original.id}`}
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
          onClick={async () => {
            if (window.confirm("¿Seguro que deseas eliminar este producto?")) {
              await deleteProduct(row.original.id);
              setRefreshFlag(f => !f);
            }
          }}
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
  const [data, setData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshFlag, setRefreshFlag] = useState(false);

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

  useEffect(() => {
    setLoading(true);
    fetchProducts()
      .then(apiData => setData(
        apiData.map(item => ({
          id: item.id,
          nombre: item.name,
          categoria: item.category,
          stock: item.stock,
          precio: item.price,
          lastUpdated: item.lastUpdated,
        }))
      ))
      .finally(() => setLoading(false));
  }, [refreshFlag]);

  // Filtros locales (puedes mejorarlo para que sean por backend)
  const filteredData = data.filter(item => {
    let match = true;
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      match = match && (
        item.nombre.toLowerCase().includes(searchTerm) ||
        item.categoria.toLowerCase().includes(searchTerm)
      );
    }
    if (filters.category) {
      match = match && item.categoria === filters.category;
    }
    if (filters.stockStatus) {
      switch (filters.stockStatus) {
        case "high":
          match = match && item.stock > 20;
          break;
        case "medium":
          match = match && item.stock > 0 && item.stock <= 20;
          break;
        case "low":
          match = match && item.stock === 0;
          break;
      }
    }
    return match;
  });

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
            isLoading={loading}
          />
        </Stack>
      </Box>
    </Box>
  );
}