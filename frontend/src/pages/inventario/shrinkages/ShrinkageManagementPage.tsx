import { useState, useEffect } from "react";
import { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
import { Button, Stack, Typography, Box } from "@mui/joy";
import CustomTable from "../../../components/core/CustomTable/CustomTable";
import Header from "../../../components/core/layout/components/Header";
import FilterOptions, { SelectConfig } from "../../../components/core/FilterOptions/FilterOptions";
import { Link as RouterLink } from '@tanstack/react-router';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/joy/IconButton';
import { Link } from "@tanstack/react-router";
import { fetchShrinkages, deleteShrinkage } from "../../../services/inventoryService";
import ConfirmDialog from "../../../components/administracion/ConfirmDialog/ConfirmDialog";

interface ShrinkageItem {
  id: string;
  product: string;
  price: number;
  quantity: number;
  category: string;
  observation?: string;
}

interface Filters {
  search?: string;
  category?: string;
  stockStatus?: string;
}

export default function ShrinkageManagementPage() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [data, setData] = useState<ShrinkageItem[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentDeleteId, setCurrentDeleteId] = useState<string | null>(null);
  const [currentDeleteProduct, setCurrentDeleteProduct] = useState<string>("");

  // Definición de columnas dentro del componente
  const columns: ColumnDef<ShrinkageItem>[] = [
    { 
      accessorKey: "product", 
      header: "Producto", 
      cell: info => <Typography fontWeight="md">{info.getValue<string>()}</Typography> 
    },
    { 
      accessorKey: "category", 
      header: "Categoría",
    },
    { 
      accessorKey: "price", 
      header: "Precio", 
      cell: info => <>${info.getValue<number>()}</>
    },
    { 
      accessorKey: "quantity", 
      header: "Cantidad", 
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
            to={`/inventario/mermas/ver-merma/${row.original.id}`}
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            component={RouterLink}
            to={`/inventario/mermas/editar-merma/${row.original.id}`}
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
            onClick={() => handleOpenDeleteDialog(row.original.id, row.original.product)}
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
      size: 150
    },
  ];

  const handleOpenDeleteDialog = (id: string, product: string) => {
    setCurrentDeleteId(id);
    setCurrentDeleteProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setCurrentDeleteId(null);
    setCurrentDeleteProduct("");
  };

  const handleConfirmDelete = async () => {
    if (!currentDeleteId) return;
    
    setDeleteLoading(true);
    try {
      await deleteShrinkage(currentDeleteId);
      // Refrescar los datos después de eliminar
      const res = await fetchShrinkages({
        page: pagination.pageIndex + 1,
        page_size: pagination.pageSize,
        search: filters.search || "",
        category: filters.category || "",
        ordering: sorting.length > 0 ? (sorting[0].desc ? `-${sorting[0].id}` : sorting[0].id) : "",
      });
      setData(res.results || []);
      setRowCount(res.count || 0);
    } catch (error) {
      console.error("Error al eliminar merma:", error);
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
        { value: "daño", label: "Daño físico" },
        { value: "deterioro", label: "Deterioro" },
        { value: "otros", label: "Otros" },
      ],
    },
    {
      id: "stockStatus",
      placeholder: "Cantidad",
      options: [
        { value: "", label: "Todas" },
        { value: "high", label: "Alto (>50)" },
        { value: "medium", label: "Medio (10-50)" },
        { value: "low", label: "Bajo (<10)" },
      ],
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      const ordering = sorting.length > 0 ? (sorting[0].desc ? `-${sorting[0].id}` : sorting[0].id) : "";
      const res = await fetchShrinkages({
        page: pagination.pageIndex + 1,
        page_size: pagination.pageSize,
        search: filters.search || "",
        category: filters.category || "",
        ordering,
      });
      let items = res.results || [];
      // Filtro de cantidad local
      if (filters.stockStatus) {
        items = items.filter((item: ShrinkageItem) => {
          switch (filters.stockStatus) {
            case "high": return item.quantity > 50;
            case "medium": return item.quantity >= 10 && item.quantity <= 50;
            case "low": return item.quantity < 10;
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
            <Typography level="h2">Gestión de Mermas</Typography>
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button 
                component={Link}
                to="/inventario/mermas/carga-masiva-mermas"
                variant="solid" 
                color="primary"
              >
                Carga masiva
              </Button>
              <Button 
                component={Link}
                to="/Inventario/mermas/crear-merma"
                variant="solid" 
                color="primary"
              >
                Añadir Merma
              </Button>
            </Stack>
          </Stack>
          
          <FilterOptions<Filters>
            onChangeFilters={handleFilterChange}
            selects={selectConfigs}
          />
          
          <CustomTable<ShrinkageItem>
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

      {/* Diálogo de confirmación para eliminar */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Confirmar eliminación"
        content={`¿Estás seguro que deseas eliminar la merma del producto "${currentDeleteProduct}"?`}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleConfirmDelete}
        isLoading={deleteLoading}
      />
    </Box>
  );
}