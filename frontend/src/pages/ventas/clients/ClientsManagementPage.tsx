import { useState } from "react";
import { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
import { 
  Button, 
  Stack, 
  Typography, 
  Box, 
  IconButton, 
  CircularProgress,
  Snackbar,
  Alert,
  ColorPaletteProp
} from "@mui/joy";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CustomTable from "../../../components/core/CustomTable/CustomTable";
import Header from "../../../components/core/layout/components/Header";
import FilterOptions from "../../../components/core/FilterOptions/FilterOptions";
import { Link } from "@tanstack/react-router";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchClients, deleteClient } from "../../../services/salesService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Client, CustomPagination } from "../../../types/sales.types";
import ConfirmDialog from "../../../components/administracion/ConfirmDialog/ConfirmDialog";

interface Filters {
  search?: string;
}

interface SnackbarState {
  open: boolean;
  message: string;
  color: ColorPaletteProp;
}

export default function ClientsManagement() {
  const [filters, setFilters] = useState<Filters>({});
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    color: 'neutral'
  });
  const queryClient = useQueryClient();

  const { data: clientsData, isLoading } = useQuery<CustomPagination<Client>>({
    queryKey: ['clients', pagination, sorting, filters],
    queryFn: () => fetchClients({
      page: pagination.pageIndex + 1,
      page_size: pagination.pageSize,
      search: filters.search,
      ordering: sorting.map(sort => `${sort.desc ? '-' : ''}${sort.id}`).join(',')
    }),
    placeholderData: (previousData) => previousData
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      setDeleteDialogOpen(false);
      setSnackbar({
        open: true,
        message: 'Cliente eliminado correctamente',
        color: 'success'
      });
    },
    onError: (error) => {
      console.error("Error deleting client:", error);
      setSnackbar({
        open: true,
        message: 'Error al eliminar el cliente',
        color: 'danger'
      });
    }
  });

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleDeleteClick = (client: Client) => {
    setClientToDelete(client);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (clientToDelete) {
      deleteMutation.mutate(clientToDelete.id);
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setClientToDelete(null);
  };

  const closeSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const columns: ColumnDef<Client>[] = [
    { 
      accessorKey: "national_id", 
      header: "RUT",
      cell: info => <Typography fontWeight="md">{info.getValue<string>()}</Typography>
    },
    { 
      accessorKey: "first_name", 
      header: "Nombre",
      cell: info => `${info.row.original.first_name} ${info.row.original.last_name}`
    },
    { 
      accessorKey: "email", 
      header: "Correo",
      cell: info => info.getValue<string>() || '-'
    },
    { 
      accessorKey: "phone_number", 
      header: "Teléfono",
      cell: info => info.getValue<string>() || '-'
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
            to={`/ventas/gestiondeclientes/ver-cliente/${row.original.id}`}
          >
            <VisibilityIcon />
          </IconButton>
          
          <IconButton
            variant="plain"
            color="neutral"
            size="sm"
            aria-label="Edit"
            component={Link}
            to={`/ventas/gestiondeclientes/editar-cliente/${row.original.id}`}
          >
            <EditIcon />
          </IconButton>
          
          <IconButton
            variant="plain"
            color="danger"
            size="sm"
            aria-label="Delete"
            onClick={() => handleDeleteClick(row.original)}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  if (isLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      <CircularProgress />
    </Box>
  );

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
            selects={[]}
          />
          
          <CustomTable<Client>
            data={clientsData?.results || []}
            columns={columns}
            pagination={pagination}
            paginationOptions={{
              onPaginationChange: setPagination,
              rowCount: clientsData?.info.count || 0
            }}
            sorting={sorting}
            onSortingChange={setSorting}
          />
        </Stack>
      </Box>

      {/* Diálogo de confirmación para eliminar */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Confirmar eliminación"
        content={`¿Estás seguro que deseas eliminar al cliente ${clientToDelete?.first_name} ${clientToDelete?.last_name}?`}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
      />

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          color={snackbar.color}
          variant="soft"
          startDecorator={
            snackbar.color === 'success' ? (
              <CheckCircleOutlineIcon />
            ) : (
              <ErrorOutlineIcon />
            )
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}