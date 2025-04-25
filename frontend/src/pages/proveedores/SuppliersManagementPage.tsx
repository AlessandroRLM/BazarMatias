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
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  products: string[];
  lastOrder: string;
}

interface Filters<T> {
  search?: string;
  productType?: string;
  lastOrder?: string;
}

const sampleData: Supplier[] = [
  {
    id: "1",
    name: "Distribuidora Electrónica SA",
    contact: "Juan Pérez",
    email: "juan@electronica.com",
    phone: "+56912345678",
    products: ["Componentes electrónicos", "Cables"],
    lastOrder: "2023-06-15",
  },
  {
    id: "2",
    name: "Mayorista de Oficina",
    contact: "María González",
    email: "ventas@oficina.cl",
    phone: "+56987654321",
    products: ["Papelería", "Utiles de oficina"],
    lastOrder: "2023-05-28",
  },
  {
    id: "3",
    name: "Importadora de Tecnología",
    contact: "Carlos Rojas",
    email: "carlos@tecnologia.cl",
    phone: "+56945678912",
    products: ["Computadores", "Tablets", "Accesorios"],
    lastOrder: "2023-06-20",
  },
  {
    id: "4",
    name: "Suministros Industriales LTDA",
    contact: "Ana Silva",
    email: "ana@suministros.com",
    phone: "+56932165498",
    products: ["Herramientas", "Insumos industriales"],
    lastOrder: "2023-04-10",
  },
];

const columns: ColumnDef<Supplier>[] = [
  { accessorKey: "name", header: "Proveedor", cell: info => <Typography fontWeight="md">{info.getValue<string>()}</Typography> },
  { accessorKey: "contact", header: "Contacto" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "phone", header: "Teléfono" },
  { accessorKey: "products", header: "Productos", cell: info => (info.getValue<string[]>().join(', ')) },
  { accessorKey: "lastOrder", header: "Último Pedido", cell: info => new Date(info.getValue<string>()).toLocaleDateString() },
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
        to={``}
    >
        <VisibilityIcon />
    </IconButton>
    <IconButton
        component={RouterLink}
        to={``}
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
      id: "productType",
      placeholder: "Tipo de producto",
      options: [
        { value: "", label: "Todos" },
        { value: "Electrónicos", label: "Electrónicos" },
        { value: "Oficina", label: "Oficina" },
        { value: "Industriales", label: "Industriales" },
      ],
    },
    {
      id: "lastOrder",
      placeholder: "Último pedido",
      options: [
        { value: "", label: "Todos" },
        { value: "lastMonth", label: "Último mes" },
        { value: "last3Months", label: "Últimos 3 meses" },
        { value: "older", label: "Más de 3 meses" },
      ],
    },
  ];

  // Efecto para aplicar los filtros
  useEffect(() => {
    let result = [...sampleData];
    
    // Filtro de búsqueda
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(supplier => 
        supplier.name.toLowerCase().includes(searchTerm) || 
        supplier.contact.toLowerCase().includes(searchTerm) ||
        supplier.email.toLowerCase().includes(searchTerm) ||
        supplier.products.some(product => product.toLowerCase().includes(searchTerm))
      );
    }
    
    // Filtro por tipo de producto
    if (filters.productType) {
      result = result.filter(supplier => 
        supplier.products.some(product => {
          switch (filters.productType) {
            case "Electrónicos":
              return product.includes("electrónico") || product.includes("Tecnología");
            case "Oficina":
              return product.includes("Papelería") || product.includes("oficina");
            case "Industriales":
              return product.includes("Industrial") || product.includes("Herramienta");
            default:
              return true;
          }
        })
      );
    }
    
    // Filtro por último pedido
    if (filters.lastOrder) {
      const today = new Date();
      result = result.filter(supplier => {
        const lastOrderDate = new Date(supplier.lastOrder);
        const diffTime = today.getTime() - lastOrderDate.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        
        switch (filters.lastOrder) {
          case "lastMonth":
            return diffDays <= 30;
          case "last3Months":
            return diffDays <= 90;
          case "older":
            return diffDays > 90;
          default:
            return true;
        }
      });
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