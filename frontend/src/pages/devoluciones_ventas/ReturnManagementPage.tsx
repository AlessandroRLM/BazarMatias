import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
import { 
  Button, 
  Stack, 
  Typography, 
  Box, 
  Checkbox, 
  IconButton,
  Snackbar,
  Alert,
  ColorPaletteProp
} from "@mui/joy";
import CustomTable from "../../components/core/CustomTable/CustomTable";
import Header from "../../components/core/layout/components/Header";
import FilterOptions, { SelectConfig, SelectOption } from "../../components/core/FilterOptions/FilterOptions";
import { Link } from "@tanstack/react-router";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from "dayjs";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ConfirmDialog from "../../components/administracion/ConfirmDialog/ConfirmDialog";
import { 
  fetchReturns, 
  deleteReturn, 
  updateReturn,
  Return
} from "../../services/returnService";

interface Filters {
  search?: string;
  status?: string;
}

interface SnackbarState {
  open: boolean;
  message: string;
  color: ColorPaletteProp;
}

export default function ReturnManagementPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<Filters>({});
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    color: 'neutral'
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [returnToDelete, setReturnToDelete] = useState<Return | null>(null);

  // Fetch returns data
  const { data: returnsData, isLoading } = useQuery({
    queryKey: ['returns', pagination, filters],
    queryFn: () => fetchReturns(
      pagination.pageIndex + 1,
      pagination.pageSize,
      filters
    ),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteReturn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['return'] });
      setSnackbar({
        open: true,
        message: 'Devolución eliminada correctamente',
        color: 'success'
      });
    },
    onError: () => {
      setSnackbar({
        open: true,
        message: 'Error al eliminar la devolución',
        color: 'danger'
      });
    }
  });

  // Status change mutation
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: 'pending' | 'completed' }) => 
      updateReturn(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['return'] });
      setSnackbar({
        open: true,
        message: 'Estado actualizado',
        color: 'success'
      });
    },
    onError: () => {
      setSnackbar({
        open: true,
        message: 'Error al actualizar el estado',
        color: 'danger'
      });
    }
  });

  const handleStatusChange = (id: string, currentStatus: 'pending' | 'completed') => {
    statusMutation.mutate({
      id,
      status: currentStatus === 'completed' ? 'pending' : 'completed'
    });
  };

  const handleDeleteClick = (returnItem: Return) => {
    setReturnToDelete(returnItem);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (returnToDelete) {
      deleteMutation.mutate(returnToDelete.id);
    }
    setDeleteDialogOpen(false);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setReturnToDelete(null);
  };

  const closeSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Filter configuration
  const selectConfigs: SelectConfig[] = [
    {
      id: "status",
      placeholder: "Estado",
      options: [
        { value: "", label: "Todos" },
        { value: "pending", label: "Pendiente" },
        { value: "completed", label: "Completado" },
      ] as SelectOption[],
    }
  ];

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Table columns
  const columns: ColumnDef<Return>[] = [
  {
    accessorKey: "client",
    header: "Cliente",
    cell: ({ row }) => {
      // Acceder directamente a los datos de la fila
      const client = row.original.client;
      return (
        <Typography fontWeight="md">
          {client ? `${client.first_name} ${client.last_name}` : 'Cliente no disponible'}
        </Typography>
      );
    }
  },
  {
    accessorKey: "product",
    header: "Producto",
    cell: ({ row }) => {
      const product = row.original.product;
      return (
        <Stack>
          <Typography>{product?.name || 'Producto no disponible'}</Typography>
          {product?.sku && <Typography level="body-sm">SKU: {product.sku}</Typography>}
        </Stack>
      );
    }
  },
    {
      accessorKey: "created_at",
      header: "Fecha",
      cell: info => dayjs(info.getValue<string>()).format('DD/MM/YYYY')
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: info => {
        const status = info.getValue<'pending' | 'completed'>();
        const color = status === 'completed' ? 'success' : 'warning';
        return <Typography color={color}>{status === 'completed' ? 'Completado' : 'Pendiente'}</Typography>;
      }
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const returnItem = row.original;
        return (
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              variant="plain"
              color="neutral"
              size="sm"
              aria-label="View"
              component={Link}
              to={`/ventas/gestiondedevoluciones/ver-devolucion/${row.original.id}`}
            >
              <VisibilityIcon />
            </IconButton>

            <IconButton
              component={Link}
              to={`/ventas/gestiondedevoluciones/editar-devolucion/${row.original.id}`}
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
              onClick={() => handleDeleteClick(returnItem)}
              disabled={deleteMutation.isPending}
            >
              <DeleteIcon />
            </IconButton>

            <Checkbox
              checked={row.original.status === 'completed'}
              onChange={() => handleStatusChange(row.original.id, row.original.status)}
              color={row.original.status === 'completed' ? 'success' : 'neutral'}
              variant={row.original.status === 'completed' ? 'solid' : 'outlined'}
              sx={{ ml: 1 }}
              disabled={statusMutation.isPending}
            />
          </Stack>
        );
      },
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box
        component="main"
        sx={{
          flex: 1,
          p: 3,
          pt: { xs: 'calc(var(--Header-height) + 16px)', md: 3 },
          maxWidth: '1600px',
          mx: 'auto',
          width: '100%'
        }}
      >
        <Stack spacing={3}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography level="h2">Gestión de Devoluciones</Typography>
            <Button
              component={Link}
              to="/ventas/gestiondedevoluciones/añadir-devolucion"
              variant="solid"
              color="primary"
            >
              Nueva Devolución
            </Button>
          </Stack>

          <FilterOptions<Filters>
            onChangeFilters={handleFilterChange}
            selects={selectConfigs}
          />

          <CustomTable<Return>
            data={returnsData?.results || []}
            columns={columns}
            pagination={pagination}
            paginationOptions={{
              onPaginationChange: setPagination,
              rowCount: returnsData?.info.count || 0
            }}
            sorting={sorting}
            onSortingChange={setSorting}
            isLoading={isLoading}
          />
        </Stack>
      </Box>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Confirmar eliminación"
        content={`¿Estás seguro que deseas eliminar la devolución de ${returnToDelete?.product.name}?`}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
      />

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