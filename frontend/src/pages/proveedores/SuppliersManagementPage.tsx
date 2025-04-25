import { useState, useEffect } from "react";
import { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
import { Button, Stack, Typography, Box } from "@mui/joy";
import CustomTable from "../../components/core/CustomTable/CustomTable";
import Header from "../../components/core/layout/components/Header";
import FilterOptions, { SelectConfig } from "../../components/core/FilterOptions/FilterOptions";
import { Link } from "@tanstack/react-router";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/joy/IconButton';
import { Link as RouterLink } from '@tanstack/react-router';

interface Supplier {
  id?: string;
  name?: string;
  direction?: string;
  contact?: string;
  email?: string;
  phone?: string;
  products?: string[];
  category?: string; 

}

interface Filters<T> {
  search?: string;
  productType?: string;
  category?: string;
}

const sampleData: Supplier[] = [
  {
    id: "1",
    name: "Distribuidora Electrónica SA",
    direction: "Sazie 1455, Estacion Central",
    phone: "+56912345678",
    products: ["Componentes electrónicos", "Cables"],
    category: "Electronica"
  },
  {
    id: "2",
    name: "Mayorista de Oficina",
    direction: "Calle Ecuador 1234, Santiago",
    contact: "María González",
    phone: "+56987654321",
    products: ["Papelería", "Utiles de oficina"],
    category: "Papeleria"
  },
  {
    id: "3",
    name: "Importadora de Tecnología",
    direction: "Av. Vicuña Mackenna 4600",
    contact: "Carlos Rojas",
    phone: "+56945678912",
    products: ["Computadores", "Tablets", "Accesorios"],
    category: "Electronica"
  },
  {
    id: "4",
    name: "Suministros Industriales LTDA",
    direction: "Av. Vicuña Mackenna 7500",
    contact: "Ana Silva",
    phone: "+56932165498",
    products: ["Herramientas", "Insumos industriales"],
    category: "Cotillon"
  },
];

const columns: ColumnDef<Supplier>[] = [
  { accessorKey: "name", header: "Nombre", cell: info => <Typography fontWeight="md">{info.getValue<string>()}</Typography> },
  { accessorKey: "direction", header: "Dirección"},
  { accessorKey: "phone", header: "Teléfono" },
  { accessorKey: "category", header: "Categoria"},
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
        to={`/Suppliers/ver-proveedor`}
    >
        <VisibilityIcon />
    </IconButton>
    <IconButton
        component={RouterLink}
        to={`/Suppliers/editar-proveedor`}
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

export default function SuppliersManagementPage() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState<Filters<Supplier>>({});
  const [filteredData, setFilteredData] = useState<Supplier[]>(sampleData);

  // Configuración de los selects de filtro
  const selectConfigs: SelectConfig[] = [
    {
      id: "category",
      placeholder: "Categoría",
      options: [
        { value: "", label: "Todas" },
        { value: "Electronica", label: "Electrónica" },
        { value: "Papeleria", label: "Papelería" },
        { value: "Cotillon", label: "Cotillón" },
      ],
    },
  ];

  // Efecto para aplicar los filtros
  useEffect(() => {
    let result = [...sampleData];
    
    // Filtro de búsqueda (ahora seguro contra valores undefined)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(supplier => {
        const nameMatch = supplier.name?.toLowerCase().includes(searchTerm) ?? false;
        const contactMatch = supplier.contact?.toLowerCase().includes(searchTerm) ?? false;
        const emailMatch = supplier.email?.toLowerCase().includes(searchTerm) ?? false;
        const phoneMatch = supplier.phone?.toLowerCase().includes(searchTerm) ?? false;
        
        return nameMatch || contactMatch || emailMatch || phoneMatch;
      });
    }
    
    // Filtro por tipo de producto
    if (filters.category) {
        result = result.filter(supplier => supplier.category === filters.category);
      }
      
      setFilteredData(result);
    }, [filters]);

  const handleFilterChange = (newFilters: Partial<Filters<Supplier>>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flex: 1, p: 3, pt: { xs: 'calc(var(--Header-height) + 16px)', md: 3 }, maxWidth: '1600px', mx: 'auto', width: '100%' }}>
        <Stack spacing={3}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography level="h2">Gestión de Proveedores</Typography>
            <Button 
            component={Link}
            to="/Suppliers/crear-proveedor"
            variant="solid" 
            color="primary"
            >
            Añadir Proveedor
            </Button>
          </Stack>
          
          {/* Componente de filtros importado */}
          <FilterOptions<Supplier>
            onChangeFilters={handleFilterChange}
            selects={selectConfigs}
          />
          
          <CustomTable<Supplier>
            data={filteredData}
            columns={columns}
            pagination={pagination}
            paginationOptions={{ onPaginationChange: setPagination, rowCount: filteredData.length }}
            sorting={sorting}
            onSortingChange={setSorting}
          />
        </Stack>
      </Box>
    </Box>
  );
}