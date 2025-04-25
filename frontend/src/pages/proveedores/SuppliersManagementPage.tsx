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
import { fetchSuppliers, deleteSupplier } from "../../services/inventoryService";

interface Supplier {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  correo: string;
  rut: string;
  categoria: string;
}

interface Filters<T> {
  search?: string;
  category?: string;
}

const columns: ColumnDef<Supplier>[] = [
  { accessorKey: "nombre", header: "Nombre", cell: info => <Typography fontWeight="md">{info.getValue<string>()}</Typography> },
  { accessorKey: "direccion", header: "Dirección"},
  { accessorKey: "telefono", header: "Teléfono" },
  { accessorKey: "categoria", header: "Categoría"},
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
          to={`/Suppliers/ver-proveedor/${row.original.id}`}
        >
          <VisibilityIcon />
        </IconButton>
        <IconButton
          component={RouterLink}
          to={`/Suppliers/editar-proveedor/${row.original.id}`}
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
            if (window.confirm(`¿Seguro que deseas eliminar a ${row.original.nombre}?`)) {
              await deleteSupplier(row.original.id);
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

export default function SuppliersManagementPage() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState<Filters<Supplier>>({});
  const [data, setData] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshFlag, setRefreshFlag] = useState(false);

  // Configuración de los selects de filtro
  const selectConfigs: SelectConfig[] = [
    {
      id: "category",
      placeholder: "Categoría",
      options: [
        { value: "", label: "Todas" },
        { value: "Electrónicos", label: "Electrónica" },
        { value: "Papelería", label: "Papelería" },
        { value: "Cotillón", label: "Cotillón" },
      ],
    },
  ];

  useEffect(() => {
    setLoading(true);
    fetchSuppliers()
      .then(apiData => setData(
        apiData.map(item => ({
          id: item.id,
          nombre: item.name,
          direccion: item.address,
          telefono: item.phone,
          correo: item.email,
          rut: item.rut,
          categoria: item.category,
        }))
      ))
      .finally(() => setLoading(false));
  }, [refreshFlag]);

  // Filtros locales
  const filteredData = data.filter(supplier => {
    let match = true;
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      match = match && (
        supplier.nombre.toLowerCase().includes(searchTerm) ||
        supplier.direccion.toLowerCase().includes(searchTerm) ||
        supplier.telefono.toLowerCase().includes(searchTerm) ||
        supplier.correo.toLowerCase().includes(searchTerm) ||
        supplier.rut.toLowerCase().includes(searchTerm)
      );
    }
    if (filters.category) {
      match = match && supplier.categoria === filters.category;
    }
    return match;
  });

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
            isLoading={loading}
          />
        </Stack>
      </Box>
    </Box>
  );
}