import { useState } from "react";
import { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
import { Button, Stack, Typography, Box, IconButton } from "@mui/joy";
import CustomTable from "../../components/core/CustomTable/CustomTable";
import Header from "../../components/core/layout/components/Header";
import FilterOptions from "../../components/core/FilterOptions/FilterOptions";
import { Link } from "@tanstack/react-router";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Client {
  id: string;
  rut: string;
  name: string;
  email: string;
  phone: string;
}

interface Filters {
  search?: string;
}

export default function ClientsManagement() {
  const [filters, setFilters] = useState<Filters>({});
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data] = useState<Client[]>([
    { id: '1', rut: '12.345.678-9', name: 'Juan Pérez', email: 'juan@example.com', phone: '+56912345678' },
    { id: '2', rut: '23.456.789-0', name: 'María García', email: 'maria@example.com', phone: '+56923456789' },
    { id: '3', rut: '34.567.890-1', name: 'Carlos López', email: 'carlos@example.com', phone: '+56934567890' },
    { id: '4', rut: '45.678.901-2', name: 'Ana Martínez', email: 'ana@example.com', phone: '+56945678901' },
    { id: '5', rut: '56.789.012-3', name: 'Luis Rodríguez', email: 'luis@example.com', phone: '+56956789012' },
  ]);

  const filteredData = data.filter(client => {
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        client.rut.toLowerCase().includes(searchTerm) ||
        client.name.toLowerCase().includes(searchTerm) ||
        client.email.toLowerCase().includes(searchTerm) ||
        client.phone.toLowerCase().includes(searchTerm)
      );
    }
    return true;
  });

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const columns: ColumnDef<Client>[] = [
    { 
      accessorKey: "rut", 
      header: "RUT",
      cell: info => <Typography fontWeight="md">{info.getValue<string>()}</Typography>
    },
    { 
      accessorKey: "name", 
      header: "Nombre",
      cell: info => info.getValue<string>()
    },
    { 
      accessorKey: "email", 
      header: "Correo",
      cell: info => info.getValue<string>()
    },
    { 
      accessorKey: "phone", 
      header: "Teléfono",
      cell: info => info.getValue<string>()
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton
            variant="plain"
            color="neutral"
            size="sm"
            aria-label="View"
            component={Link}
            to={`/ventas/gestiondeclientes/ver-cliente${row.original.id}`}
          >
            <VisibilityIcon />
          </IconButton>
          
          <IconButton
            variant="plain"
            color="neutral"
            size="sm"
            aria-label="Edit"
            component={Link}
            to={`/ventas/gestiondeclientes/editar-cliente${row.original.id}`}
          >
            <EditIcon />
          </IconButton>
          
          <IconButton
            variant="plain"
            color="danger"
            size="sm"
            aria-label="Delete"
            //onClick={() => handleDeleteClick(row.original)}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

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
            <Typography level="h2">Gestión de Clientes</Typography>
            <Button 
              component={Link}
              to="/ventas/gestiondeclientes/añadir-cliente"
              variant="solid" 
              color="primary"
            >
              Nuevo Cliente
            </Button>
          </Stack>

          <FilterOptions<Filters>
            onChangeFilters={handleFilterChange}
            selects={[]} // No select filters
          />
          
          <CustomTable<Client>
            data={filteredData}
            columns={columns}
            pagination={pagination}
            onPaginationChange={setPagination}
            sorting={sorting}
            onSortingChange={setSorting}
            rowCount={filteredData.length}
          />
        </Stack>
      </Box>

    </Box>
  );
}