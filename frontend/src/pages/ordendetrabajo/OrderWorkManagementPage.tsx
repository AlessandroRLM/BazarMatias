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
import CustomTable from "../../components/core/CustomTable/CustomTable";
import Header from "../../components/core/layout/components/Header";
import FilterOptions, { SelectConfig } from "../../components/core/FilterOptions/FilterOptions";
import { Link } from "@tanstack/react-router";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchWorkOrders, deleteWorkOrder } from "../../services/salesService";
import { WorkOrder, WorkOrderStatus } from "../../types/sales.types";
import ConfirmDialog from "../../components/administracion/ConfirmDialog/ConfirmDialog";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Filters {
  search?: string;
  status?: WorkOrderStatus;
}

interface SnackbarState {
  open: boolean;
  message: string;
  color: ColorPaletteProp;
}

export default function OrderManagementPage() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workOrderToDelete, setWorkOrderToDelete] = useState<WorkOrder | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    color: 'neutral'
  });
  const queryClient = useQueryClient();

  const { data: workOrdersData, isLoading } = useQuery({
    queryKey: ['workOrders', pagination, sorting, filters],
    queryFn: () => fetchWorkOrders({
      page: pagination.pageIndex + 1,
      page_size: pagination.pageSize,
      search: filters.search,
      status: filters.status,
      ordering: sorting.map(sort => `${sort.desc ? '-' : ''}${sort.id}`).join(',')
    }),
    placeholderData: (previousData) => previousData
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteWorkOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workOrders'] });
      setDeleteDialogOpen(false);
      setSnackbar({
        open: true,
        message: 'Orden de trabajo eliminada correctamente',
        color: 'success'
      });
    },
    onError: (error) => {
      console.error("Error deleting work order:", error);
      setSnackbar({
        open: true,
        message: 'Error al eliminar la orden de trabajo',
        color: 'danger'
      });
    }
  });

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleDeleteClick = (workOrder: WorkOrder) => {
    setWorkOrderToDelete(workOrder);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (workOrderToDelete) {
      deleteMutation.mutate(workOrderToDelete.id);
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setWorkOrderToDelete(null);
  };

  const closeSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const selectConfigs: SelectConfig[] = [
    {
      id: "status",
      placeholder: "Estado",
      options: [
        { value: "", label: "Todos" },
        { value: "pendiente", label: "Pendiente" },
        { value: "en_proceso", label: "En Proceso" },
        { value: "completada", label: "Completada" },
        { value: "cancelada", label: "Cancelada" },
      ],
    }
  ];

  const columns: ColumnDef<WorkOrder>[] = [
    {
      accessorKey: "numero_orden",
      header: "Número de Orden",
      cell: info => <Typography fontWeight="md">{info.getValue<string>()}</Typography>
    },
    {
      accessorKey: "trabajador_nombre",
      header: "Trabajador"
    },
    {
      accessorKey: "tipo_tarea",
      header: "Tipo de Tarea"
    },
    {
      accessorKey: "descripcion",
      header: "Descripción",
      cell: info => (
        <Typography noWrap sx={{ maxWidth: 200 }}>
          {info.getValue<string>()}
        </Typography>
      )
    },
    {
      accessorKey: "prioridad",
      header: "Prioridad",
      cell: info => {
        const priority = info.getValue<string>();
        return (
          <Typography color={
            priority === 'alta' ? 'danger' :
              priority === 'media' ? 'warning' : 'success'
          }>
            {priority === 'alta' ? 'Alta' :
              priority === 'media' ? 'Media' : 'Baja'}
          </Typography>
        );
      }
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: info => {
        const status = info.getValue<string>();
        let color: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

        switch (status) {
          case 'pendiente':
            color = 'warning';
            break;
          case 'en_proceso':
            color = 'primary';
            break;
          case 'completada':
            color = 'success';
            break;
          case 'cancelada':
            color = 'danger';
            break;
          default:
            color = 'neutral';
        }

        return (
          <Typography color={color}>
            {status === 'pendiente' ? 'Pendiente' :
              status === 'en_proceso' ? 'En Proceso' :
                status === 'completada' ? 'Completada' : 'Cancelada'}
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
            component={Link}
            to={`/ventas/ordenesdetrabajo/ver-orden-trabajo/${row.original.id}`}
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            component={Link}
            to={`/ventas/ordenesdetrabajo/editar-orden-trabajo/${row.original.id}`}
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
            onClick={() => handleDeleteClick(row.original)}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

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
            <Typography level="h2">Lista Ordenes de Trabajo</Typography>
            <Button
              component={Link}
              to="/ventas/ordenesdetrabajo/crear-orden-trabajo"
              variant="solid"
              color="primary"
            >
              Crear Orden
            </Button>
          </Stack>

          <FilterOptions<Filters>
            onChangeFilters={handleFilterChange}
            selects={selectConfigs}
          />

          <CustomTable<WorkOrder>
            data={workOrdersData?.results || []}
            columns={columns}
            pagination={pagination}
            paginationOptions={{
              onPaginationChange: setPagination,
              rowCount: workOrdersData?.info.count || 0
            }}
            sorting={sorting}
            onSortingChange={setSorting}
          />
        </Stack>
      </Box>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Confirmar eliminación"
        content={`¿Estás seguro que deseas eliminar la orden de trabajo #${workOrderToDelete?.numero_orden}?`}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        isLoading={deleteMutation.isPending}
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