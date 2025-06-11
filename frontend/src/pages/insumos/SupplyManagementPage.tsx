import { useState, useEffect } from "react";
import { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
import { Button, Stack, Typography, Box } from "@mui/joy";
import CustomTable from "../../components/core/CustomTable/CustomTable";
import Header from "../../components/core/layout/components/Header";
import FilterOptions, { SelectConfig } from "../../components/core/FilterOptions/FilterOptions";
import { Link as RouterLink } from '@tanstack/react-router';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/joy/IconButton';
import { Link } from "@tanstack/react-router";
import { fetchSupplies, deleteSupply } from "../../services/inventoryService";
import ConfirmDialog from "../../components/administracion/ConfirmDialog/ConfirmDialog";

interface SupplyItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit?: string;
}

interface Filters {
  search?: string;
  category?: string;
  stockStatus?: string;
}

export default function SupplyManagementPage() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [data, setData] = useState<SupplyItem[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentDeleteId, setCurrentDeleteId] = useState<string | null>(null);
  const [currentDeleteName, setCurrentDeleteName] = useState<string>("");

  // Definición de columnas dentro del componente para acceder a las funciones
  const columns: ColumnDef<SupplyItem>[] = [
    { 
      accessorKey: "name", 
      header: "Nombre", 
      cell: info => <Typography fontWeight="md">{info.getValue<string>()}</Typography> 
    },
    { 
      accessorKey: "category", 
      header: "Categoría" 
    },
    { 
      accessorKey: "stock", 
      header: "Stock", 
      cell: info => {
        const stock = info.getValue<number>();
        const unit = info.row.original.unit;
        return (
          <Typography color={stock > 50 ? 'success' : stock > 10 ? 'warning' : 'danger'}>
            {stock} {unit}
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
            component={RouterLink}
            to={`/inventario/insumos/ver-insumo/${row.original.id}`}
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            component={RouterLink}
            to={`/inventario/insumos/editar-insumo/${row.original.id}`}
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
            onClick={() => handleOpenDeleteDialog(row.original.id, row.original.name)}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  const handleOpenDeleteDialog = (id: string, name: string) => {
    setCurrentDeleteId(id);
    setCurrentDeleteName(name);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setCurrentDeleteId(null);
    setCurrentDeleteName("");
  };

  const handleConfirmDelete = async () => {
    if (!currentDeleteId) return;
    
    setDeleteLoading(true);
    try {
      await deleteSupply(currentDeleteId);
      // Refrescar los datos después de eliminar
      const res = await fetchSupplies({
        page: pagination.pageIndex + 1,
        page_size: pagination.pageSize,
        search: filters.search || "",
        category: filters.category || "",
        ordering: sorting.length > 0 ? (sorting[0].desc ? `-${sorting[0].id}` : sorting[0].id) : "",
      });
      setData(res.results || []);
      setRowCount(res.count || 0);
    } catch (error) {
      console.error("Error al eliminar insumo:", error);
    } finally {
      setDeleteLoading(false);
      setDeleteDialogOpen(false);
    }
  };

  // Configuración de los selects de filtro
  const selectConfigs: SelectConfig[] = [
    {
      id: "category",
      placeholder: "Categoría",
      options: [
        { value: "", label: "Todas" },
        { value: "Oficina", label: "Oficina" },
        { value: "Impresión", label: "Impresión" },
        { value: "Organización", label: "Organización" },
      ],
    },
    {
      id: "stockStatus",
      placeholder: "Stock",
      options: [
        { value: "", label: "Todos" },
        { value: "high", label: "Alto (>50)" },
        { value: "medium", label: "Medio (10-50)" },
        { value: "low", label: "Bajo (<10)" },
      ],
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const ordering = sorting.length > 0 ? (sorting[0].desc ? `-${sorting[0].id}` : sorting[0].id) : "";
      const res = await fetchSupplies({
        page: pagination.pageIndex + 1,
        page_size: pagination.pageSize,
        search: filters.search || "",
        category: filters.category || "",
        ordering,
      });
      let items = res.results || [];
      // Filtro de stock local
      if (filters.stockStatus) {
        items = items.filter((item: SupplyItem) => {
          switch (filters.stockStatus) {
            case "high": return item.stock > 50;
            case "medium": return item.stock >= 10 && item.stock <= 50;
            case "low": return item.stock < 10;
            default: return true;
          }
        });
      }
      setData(items);
      setRowCount(res.count || items.length);
    };
    fetchData();
  }, [pagination, sorting, filters]);

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

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
            <Typography level="h2">Gestión de Insumos</Typography>
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button 
                component={Link}
                to="/inventario/insumos/carga-masiva-insumos"
                variant="solid" 
                color="primary"
              >
                Carga masiva
              </Button>
              <Button 
                component={Link}
                to="/Inventario/insumos/crear-insumo"
                variant="solid" 
                color="primary"
              >
                Añadir Insumo
              </Button>
            </Stack>
          </Stack>
          
          <FilterOptions<Filters>
            onChangeFilters={handleFilterChange}
            selects={selectConfigs}
          />
          
          <CustomTable<SupplyItem>
            data={data}
            columns={columns}
            pagination={pagination}
            paginationOptions={{ 
              onPaginationChange: setPagination, 
              rowCount: rowCount 
            }}
            sorting={sorting}
            onSortingChange={setSorting}
          />
        </Stack>
      </Box>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Confirmar eliminación"
        content={`¿Estás seguro que deseas eliminar el insumo "${currentDeleteName}"?`}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        isLoading={deleteLoading}
      />
    </Box>
  );
}