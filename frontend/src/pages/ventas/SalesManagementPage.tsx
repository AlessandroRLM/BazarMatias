import { useState } from "react";
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
import { fetchSales, updateSaleStatus, deleteSale } from "../../services/salesService";
import { Sale, Client, SaleStatus } from "../../types/sales.types";
import ConfirmDialog from "../../components/administracion/ConfirmDialog/ConfirmDialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface Filters {
  search?: string;
  status?: string;
  client?: string;
  date?: string;
  date__range_after?: string;
  date__range_before?: string;
}

interface SnackbarState {
  open: boolean;
  message: string;
  color: ColorPaletteProp;
}

interface SalesResponse {
  results: Sale[];
  info: {
    count: number;
  };
}

export default function SalesManagement() {
  const [filters, setFilters] = useState<Filters>({});
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState<Sale | null>(null);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    color: 'neutral'
  });
  const queryClient = useQueryClient();

  // Consulta para obtener las ventas
  const { data: salesData = { results: [], info: { count: 0 } }, isLoading, isError } = useQuery<SalesResponse>({
    queryKey: ['sales', pagination, filters, sorting],
    queryFn: () => fetchSales({
      page: pagination.pageIndex + 1,
      page_size: pagination.pageSize,
      search: filters.search,
      payment_method: filters.status === 'Pagado' ? 'EF' : undefined,
      ordering: sorting.length > 0 
        ? `${sorting[0].desc ? '-' : ''}${sorting[0].id}`
        : '-created_at'
    })
  });

  // Mutación para eliminar venta
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSale(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      setSnackbar({
        open: true,
        message: 'Venta eliminada correctamente',
        color: 'success'
      });
    },
    onError: () => {
      setSnackbar({
        open: true,
        message: 'Error al eliminar la venta',
        color: 'danger'
      });
    }
  });

  // Mutación para actualizar estado
  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      updateSaleStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales'] });
      setSnackbar({
        open: true,
        message: 'Estado de venta actualizado',
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

  const handleDeleteClick = (sale: Sale) => {
    setSaleToDelete(sale);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (saleToDelete) {
      deleteMutation.mutate(saleToDelete.id);
    }
    setDeleteDialogOpen(false);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSaleToDelete(null);
  };

  const handleStatusChange = (id: string, currentStatus: SaleStatus) => {
    const newStatus: SaleStatus = currentStatus === 'paid' ? 'pending' : 'paid';
    statusMutation.mutate({ id, status: newStatus });
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
        { value: "Debe", label: "Debe" },
        { value: "Pagado", label: "Pagado" },
      ] as SelectOption[],
    },
    {
      id: "client",
      placeholder: "Cliente",
      options: [
        { value: "", label: "Todos" },
        ...Array.from(
          new Set(
            salesData.results.map(item => 
              item.client ? `${item.client.first_name} ${item.client.last_name}` : null
            )
          )
        )
          .filter((client): client is string => client !== null)
          .map(client => ({
            value: client,
            label: client
          }))
      ] as SelectOption[],
    }
  ];

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const columns: ColumnDef<Sale>[] = [
    {
      accessorKey: "created_at",
      header: "Fecha",
      cell: info => dayjs(info.getValue<string>()).format('DD/MM/YYYY')
    },
    {
      accessorKey: "client",
      header: "Cliente",
      cell: info => {
        const client = info.getValue<Client | null>();
        return (
          <Typography fontWeight="md">
            {client ? `${client.first_name} ${client.last_name}` : 'Sin cliente'}
          </Typography>
        );
      }
    },
    {
      accessorKey: "total_amount",
      header: "Monto",
      cell: info => `$${info.getValue<number>().toLocaleString('es-ES')}`
    },
    {
    accessorKey: "status",
    header: "Estado",
    cell: info => {
      const status = info.getValue<SaleStatus>();
      const displayStatus = status === 'paid' ? 'Pagado' : 'Debe';
      const color = status === 'paid' ? 'success' : 'danger';
      return <Typography color={color}>{displayStatus}</Typography>;
    }
  },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const paymentMethod = row.original.payment_method;
        const status = paymentMethod === 'EF' ? 'Pagado' : 'Debe';
        
        return (
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              variant="plain"
              color="neutral"
              size="sm"
              aria-label="View"
              component={Link}
              to={`/ventas/gestiondeventas/ver-venta/${row.original.id}`}
            >
              <VisibilityIcon />
            </IconButton>

            {row.original.status !== 'paid' && (
              <>
                <IconButton
                  component={Link}
                  to={`/ventas/gestiondeventas/editar-venta/${row.original.id}`}
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
                  disabled={deleteMutation.isPending}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            )}

            <Checkbox
              checked={row.original.status === 'paid'}
              onChange={() => handleStatusChange(row.original.id, row.original.status)}
              color={row.original.status === 'paid' ? 'success' : 'neutral'}
              variant={row.original.status === 'paid' ? 'solid' : 'outlined'}
              disabled={statusMutation.isPending}
              sx={{ ml: 1 }}
            />
          </Stack>
        );
      },
    },
  ];

  if (isError) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <Typography color="danger">Error al cargar las ventas</Typography>
      </Box>
    );
  }

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
            <Typography level="h2">Gestión de Ventas</Typography>
            <Button
              component={Link}
              to="/ventas/gestiondeventas/añadir-venta"
              variant="solid"
              color="primary"
            >
              Nueva Venta
            </Button>
          </Stack>

          <FilterOptions<Filters>
            onChangeFilters={handleFilterChange}
            selects={selectConfigs}
            dateRangePicker={true}
            dateRangePickerValue={{
              start: filters.date__range_after ? new Date(filters.date__range_after) : null,
              end: filters.date__range_before ? new Date(filters.date__range_before) : null
            }}
          />

          <CustomTable<Sale>
            data={salesData.results}
            columns={columns}
            pagination={pagination}
            paginationOptions={{
              onPaginationChange: setPagination,
              rowCount: salesData.info.count
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
        content={`¿Estás seguro que deseas eliminar la venta #${saleToDelete?.folio}?`}
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