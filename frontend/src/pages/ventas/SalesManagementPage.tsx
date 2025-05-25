import { useState } from "react";
import { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
import { Button, Stack, Typography, Box, Checkbox, IconButton } from "@mui/joy";
import CustomTable from "../../components/core/CustomTable/CustomTable";
import Header from "../../components/core/layout/components/Header";
import FilterOptions, { SelectConfig } from "../../components/core/FilterOptions/FilterOptions";
import { Link } from "@tanstack/react-router";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import dayjs from "dayjs";

interface Sale {
  id: string;
  date: string;
  client: string;
  status: 'Debe' | 'Pagado';
  amount: number;
}

interface Filters {
  search?: string;
  status?: string;
  client?: string;
  date?: string;
  date__range_after?: string;
  date__range_before?: string;
}

export default function SalesManagement() {
  const [filters, setFilters] = useState<Filters>({});
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [data, setData] = useState<Sale[]>([
    { id: '1', date: '2023-05-15', client: 'Juan Pérez', status: 'Debe', amount: 1200 },
    { id: '2', date: '2023-05-16', client: 'María García', status: 'Pagado', amount: 850 },
    { id: '3', date: '2023-05-17', client: 'Carlos López', status: 'Debe', amount: 450 },
    { id: '4', date: '2023-05-18', client: 'Ana Martínez', status: 'Pagado', amount: 620 },
    { id: '5', date: '2023-05-19', client: 'Luis Rodríguez', status: 'Debe', amount: 350 },
  ]);

  const selectConfigs: SelectConfig[] = [
    {
      id: "status",
      placeholder: "Estado",
      options: [
        { value: "", label: "Todos" },
        { value: "Debe", label: "Debe" },
        { value: "Pagado", label: "Pagado" },
      ],
    },
    {
      id: "client",
      placeholder: "Cliente",
      options: [
        { value: "", label: "Todos" },
        ...Array.from(new Set(data.map(item => item.client))).map(client => ({
          value: client,
          label: client
        }))
      ],
    }
  ];

  const filteredData = data.filter(item => {
    const saleDate = dayjs(item.date);
    if (filters.status && item.status !== filters.status) return false;
    if (filters.client && item.client !== filters.client) return false;
    if (filters.date && !saleDate.isSame(filters.date, 'day')) return false;

    if (filters.date__range_after || filters.date__range_before) {
      const startDate = filters.date__range_after ? dayjs(filters.date__range_after) : null;
      const endDate = filters.date__range_before ? dayjs(filters.date__range_before) : null;
      if (startDate && saleDate.isBefore(startDate, 'day')) return false;
      if (endDate && saleDate.isAfter(endDate, 'day')) return false;
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        item.client.toLowerCase().includes(searchTerm) ||
        item.date.toLowerCase().includes(searchTerm) ||
        item.amount.toString().includes(searchTerm) ||
        item.status.toLowerCase().includes(searchTerm)
      );
    }

    return true;
  });

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleStatusChange = (id: string) => {
    setData(prevData =>
      prevData.map(item =>
        item.id === id
          ? { ...item, status: item.status === 'Debe' ? 'Pagado' : 'Debe' }
          : item
      )
    );
  };

  const columns: ColumnDef<Sale>[] = [
    {
      accessorKey: "date",
      header: "Fecha",
      cell: info => dayjs(info.getValue<string>()).format('DD/MM/YYYY')
    },
    {
      accessorKey: "client",
      header: "Cliente",
      cell: info => <Typography fontWeight="md">{info.getValue<string>()}</Typography>
    },
    {
      accessorKey: "amount",
      header: "Monto",
      cell: info => `$${info.getValue<number>().toLocaleString('es-ES')}`
    },
    {
      accessorKey: "status",
      header: "Estado",
      cell: info => {
        const status = info.getValue<'Debe' | 'Pagado'>();
        const color = status === 'Pagado' ? 'success' : 'danger';
        return <Typography color={color}>{status}</Typography>;
      }
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
            to={`/ventas/gestiondeventas/ver-venta`}
          >
            <VisibilityIcon />
          </IconButton>

          <IconButton
            component={Link}
            to={`/ventas/gestiondeventas/editar-venta`}
            variant="plain"
            color="neutral"
            size="sm"
            aria-label="Edit"
          >
            <EditIcon />
          </IconButton>

          <Checkbox
            checked={row.original.status === 'Pagado'}
            onChange={() => handleStatusChange(row.original.id)}
            color={row.original.status === 'Pagado' ? 'success' : 'neutral'}
            variant={row.original.status === 'Pagado' ? 'solid' : 'outlined'}
            sx={{ ml: 1 }}
          />
        </Stack>
      ),
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
