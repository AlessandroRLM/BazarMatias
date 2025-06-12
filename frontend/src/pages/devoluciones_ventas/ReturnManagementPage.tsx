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
  updateReturnStatus,
} from "../../services/salesService";
import { Return } from "../../types/sales.types";

interface Filters {
  search?: string;
  status?: 'pending' | 'completed';
  sale_folio?: string;
  product_name?: string;
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
      queryClient.invalidateQueries({ queryKey: ['returns'] });
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
      updateReturnStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['returns'] });
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

  const handleStatusChange = (id: string, currentStatus: 'pending' | 'completed' | 'refused' | null) => {
    // Solo permitir cambiar estado si es 'pending' o 'completed'
    if (currentStatus === 'pending' || currentStatus === 'completed') {
      statusMutation.mutate({
        id,
        status: currentStatus === 'completed' ? 'pending' : 'completed'
      });
    }
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
        return (
          <Typography fontWeight="md">
            {row.original.cliente_nombre || 'Cliente no disponible'}
          </Typography>
        );
      }
    },
    {
      accessorKey: "product",
      header: "Producto",
      cell: ({ row }) => {
        return (
          <Stack>
            <Typography>{row.original.producto_nombre || 'Producto no disponible'}</Typography>
          </Stack>
        );
      }
    },
    {
      accessorKey: "sale",
      header: "Venta",
      cell: ({ row }) => {
        return (
          <Stack>
            <Typography>#{row.original.sale.folio || 'N/A'}</Typography>
            <Typography level="body-sm">
              {row.original.fecha_venta ? dayjs(row.original.fecha_venta).format('DD/MM/YYYY') : 'Fecha no disponible'}
            </Typography>
          </Stack>
        );
      }
    },
    {
      accessorKey: "quantity",
      header: "Cantidad",
      cell: info => info.getValue<number>()
    },
    {
      accessorKey: "created_at",
      header: "Fecha Devolución",
      cell: info => dayjs(info.getValue<string>()).format('DD/MM/YYYY')
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: info => {
        const status = info.getValue<'pending' | 'completed' | 'refused' | null>();
        const color = status === 'completed' ? 'success' : 
                    status === 'refused' ? 'danger' : 'warning';
        const statusText = status === 'completed' ? 'Completado' : 
                          status === 'refused' ? 'Rechazado' : 
                          status === 'pending' ? 'Pendiente' : 'Sin estado';
        return <Typography color={color}>{statusText}</Typography>;
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
              disabled={statusMutation.isPending || !(row.original.status === 'pending' || row.original.status === 'completed')}
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