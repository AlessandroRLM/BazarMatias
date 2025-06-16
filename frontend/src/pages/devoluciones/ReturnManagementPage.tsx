import { useState, useEffect } from "react";
import { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
import { Button, Stack, Typography, Box, Checkbox } from "@mui/joy";
import CustomTable from "../../components/core/CustomTable/CustomTable";
import Header from "../../components/core/layout/components/Header";
import FilterOptions, { SelectConfig } from "../../components/core/FilterOptions/FilterOptions";
import { Link as RouterLink } from '@tanstack/react-router';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/joy/IconButton';
import { Link } from "@tanstack/react-router";
import { fetchReturnSuppliers, resolveReturn, deleteReturnSupplier } from "../../services/inventoryService";
import ConfirmDialog from "../../components/administracion/ConfirmDialog/ConfirmDialog";
import CloseIcon from '@mui/icons-material/Close';

interface Return {
  id?: string;
  provider?: string;
  product?: string;
  date?: string;
  status?: 'Pendiente' | 'Resuelto';
}

interface Filters {
  search?: string;
  productType?: string;
}

export default function ReturnManagementPage() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [filters, setFilters] = useState<Filters>({});
  const [filteredData, setFilteredData] = useState<Return[]>([]);
  const [data, setData] = useState<Return[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [resolving, setResolving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [returnToDelete, setReturnToDelete] = useState<{ id: string; provider: string } | null>(null);

  useEffect(() => {
    fetchReturnSuppliers({ page: pagination.pageIndex + 1, page_size: pagination.pageSize, search: filters.search })
      .then(apiData => {
        // Mapear los datos para mostrar los nombres en vez de los IDs
        const mappedResults = (apiData.results || []).map((item: any) => ({
          ...item,
          provider: item.supplier_name || item.provider,
          product: item.product_name || item.product,
          date: item.return_date || item.date,
        }));
        setData(mappedResults);
        setFilteredData(mappedResults);
      });
  }, [pagination, filters]);

  const handleCheckboxClick = (id: string) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const handleConfirmResolve = async () => {
    if (!selectedId) return;
    setResolving(true);
    try {
      await resolveReturn(selectedId);
      setData(prevData =>
        prevData.map(item =>
          item.id === selectedId ? { ...item, status: 'Resuelto' } : item
        )
      );
    } catch (e) {
      alert("Error al actualizar el estado");
    } finally {
      setResolving(false);
      setConfirmOpen(false);
      setSelectedId(null);
    }
  };

  const handleDeleteClick = (item: Return) => {
    setReturnToDelete({ id: item.id!, provider: item.provider || "" });
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (returnToDelete) {
      await deleteReturnSupplier(returnToDelete.id);
      setData(prev => prev.filter(r => r.id !== returnToDelete.id));
      setFilteredData(prev => prev.filter(r => r.id !== returnToDelete.id));
      setDeleteDialogOpen(false);
      setReturnToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
    setReturnToDelete(null);
  };

  const columns: ColumnDef<Return>[] = [
    { 
      accessorKey: "provider", 
      header: "Proveedor", 
      cell: info => <Typography fontWeight="md">{info.getValue<string>()}</Typography> 
    },
    { 
      accessorKey: "product", 
      header: "Producto" 
    },
    { 
      accessorKey: "date", 
      header: "Fecha" 
    },
    {
      accessorKey: "status", 
      header: "Estado", 
      cell: info => {
        const status = info.getValue<string>();
        let color: 'success' | 'warning' | 'danger' | 'neutral';

        switch(status) {
          case 'Pendiente':
            color = 'warning';
            break;
          case 'Resuelto':
            color = 'success';
            break;
          case 'Denegado':
            color = 'danger';
            break;
          default:
            color = 'neutral';
        }

        return (
          <Typography color={color}>
            {status}
          </Typography>
        );
      } 
    },
    {
      id: "actions",
      header: "Acciones",
      cell: ({ row }) => {
        const status = row.original.status;
        const isPending = status === 'Pendiente';
        const isLoading = resolving && selectedId === row.original.id;

        return (
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              variant="plain"
              color="neutral"
              size="sm"
              aria-label="View"
              component={RouterLink}
              to={`/proveedores/devoluciones/ver-devolucion/${row.original.id}`}
            >
              <VisibilityIcon />
            </IconButton>
            <Checkbox
              size="sm"
              color={status === 'Denegado' ? 'danger' : 'primary'}
              checked={status === 'Resuelto' || status === 'Denegado'}
              icon={status === 'Denegado' ? <CloseIcon /> : undefined}
              checkedIcon={status === 'Denegado' ? <CloseIcon /> : undefined}
              onChange={isPending ? () => handleCheckboxClick(row.original.id!) : undefined}
              disabled={status === 'Resuelto' || status === 'Denegado' || isLoading}
              sx={{ ml: 1 }}
              {...(isLoading && { loading: true })}
            />
            {(status === 'Pendiente') && (
              <>
                <IconButton
                  component={RouterLink}
                  to={`/proveedores/devoluciones/editar-devolucion/${row.original.id}`}
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
              </>
            )}
          </Stack>
        );
      },
    },
  ];

  // Configuración de los selects de filtro
  const selectConfigs: SelectConfig[] = [
    {
      id: "productType",
      placeholder: "Tipo de Producto",
      options: [
        { value: "", label: "Todos" },
        { value: "Electrónica", label: "Electrónica" },
        { value: "Muebles", label: "Muebles" },
        { value: "Ropa", label: "Ropa" },
      ],
    }
  ];

  // Efecto para aplicar los filtros
  useEffect(() => {
    let result = [...data];
  
    // Filtro por tipo de producto
    if (filters.productType) {
      result = result.filter(item => (item.product ?? '').includes(filters.productType!));
    }
  
    // Filtro por búsqueda mejorado (insensible a mayúsculas/minúsculas)
    if (filters.search) {
      const searchTerm = filters.search.trim().toLowerCase();
      const searchWords = searchTerm.split(/\s+/).filter(Boolean);
  
      result = result.filter(item => {
        const provider = (item.provider ?? '').toLowerCase();
        const product = (item.product ?? '').toLowerCase();
        const date = (item.date ?? '').toLowerCase();
        const status = (item.status ?? '').toLowerCase();
  
        // Coincidencia por frase completa o por palabras individuales
        const fullMatch =
          provider.includes(searchTerm) ||
          product.includes(searchTerm) ||
          date.includes(searchTerm) ||
          status.includes(searchTerm);
  
        const wordMatch = searchWords.every(word =>
          provider.includes(word) ||
          product.includes(word) ||
          date.includes(word) ||
          status.includes(word)
        );
  
        return fullMatch || wordMatch;
      });
    }
  
    setFilteredData(result);
  }, [filters, data]);

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
            <Typography level="h2">Gestión de Devoluciones</Typography>
            <Button 
              component={Link}
              to="/proveedores/devoluciones/crear-devolucion"
              variant="solid" 
              color="primary"
            >
              Añadir
            </Button>
          </Stack>
          
          {/* Componente de filtros */}
          <FilterOptions<Filters>
            onChangeFilters={handleFilterChange}
            selects={selectConfigs}
            searchPlaceholder="Buscar devoluciones..."
          />
          
          <CustomTable<Return>
            data={filteredData}
            columns={columns}
            pagination={pagination}
            paginationOptions={{ 
              onPaginationChange: setPagination, 
              rowCount: filteredData.length 
            }}
            sorting={sorting}
            onSortingChange={setSorting}
          />
        </Stack>
      </Box>
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmResolve}
        userName={data.find(d => d.id === selectedId)?.provider || ""}
        title="Confirmar resolución"
        content="¿Estás seguro que quieres marcar esta devolución como resuelta? Esta acción no se puede deshacer."
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        userName={returnToDelete?.provider || ""}
        title="Eliminar Devolución"
        content={`¿Estás seguro que quieres eliminar la devolución de "${returnToDelete?.provider}"? Esta acción no se puede deshacer.`}
      />
    </Box>
  );
}