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

interface ShrinkageItem {
  id?: string;
  name?: string;
  category?: string;
  stock?: number;
  cost?: number;
}

interface Filters {
  search?: string;
  category?: string;
};

const sampleData: ShrinkageItem[] = [
  {
    id: "1",
    name: "Lapiz",
    category: "Papeleria",
    stock: 5,
    cost: 200,
  },
  {
    id: "2",
    name: "Recma",
    category: "Papeleria",
    stock: 8,
    cost: 1000,
  },
  {
    id: "3",
    name: "Polera",
    category: "Ropa",
    stock: 3,
    cost: 7000,
  },
  {
    id: "4",
    name: "Audifonos Gamer",
    category: "Audifonos",
    stock: 12,
    cost: 10000,
  },
];

const columns: ColumnDef<ShrinkageItem>[] = [
  { 
    accessorKey: "name", 
    header: "Producto", 
    cell: info => <Typography fontWeight="md">{info.getValue<string>()}</Typography> 
  },
  { 
    accessorKey: "category", 
    header: "Categoría",
  },
  { 
    accessorKey: "cost", 
    header: "Precio", 
  },
  { 
    accessorKey: "stock", 
    header: "Stock", 
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
          to={`/Inventario/mermas/ver-merma`}
        >
          <VisibilityIcon />
        </IconButton>
        <IconButton
          component={RouterLink}
          to={`/Inventario/mermas/editar-merma`}
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
          //onClick={() => handleDeleteClick(row.original.id)}
        >
          <DeleteIcon />
        </IconButton>
      </Stack>
    ),
    size: 150
  },
];

export default function ShrinkageManagementPage() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [filteredData, setFilteredData] = useState<ShrinkageItem[]>(sampleData);

  // Configuración de los selects de filtro
  const selectConfigs: SelectConfig[] = [
    {
      id: "category",
      placeholder: "Categoría",
      options: [
        { value: "", label: "Todas" },
        { value: "Papeleria", label: "Papeleria" },
        { value: "Audifonos", label: "Audifonos" },
        { value: "Ropa", label: "Ropa" },
      ],
    },
    {
      id: "stockStatus",
      placeholder: "Stock",
      options: [
        { value: "", label: "Todos" },
        { value: "high", label: "Alto (>50)" },
        { value: "medium", label: "Medio (10-50)" },
        { value: "low", label: "Bajo (<10)" },
      ],
    },
  ];

  // Efecto para aplicar los filtros
  useEffect(() => {
    let result = [...sampleData];
    
    // Filtro por categoría
    if (filters.category) {
      result = result.filter(item => item.category === filters.category);
    }
    
    // Filtro por estado de stock
    if (filters.stockStatus) {
      switch (filters.stockStatus) {
        case "high":
          result = result.filter(item => item.stock > 50);
          break;
        case "medium":
          result = result.filter(item => item.stock >= 10 && item.stock <= 50);
          break;
        case "low":
          result = result.filter(item => item.stock < 10);
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
            <Typography level="h2">Gestión de Mermas</Typography>
            <Button 
              component={Link}
              to="/Inventario/mermas/crear-merma"
              variant="solid" 
              color="primary"
            >
              Añadir Merma
            </Button>
          </Stack>
          
          {/* Componente de filtros */}
          <FilterOptions<Filters>
            onChangeFilters={handleFilterChange}
            selects={selectConfigs}
          />
          
          <CustomTable<ShrinkageItem>
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