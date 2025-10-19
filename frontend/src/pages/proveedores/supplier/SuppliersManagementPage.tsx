import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import CustomTable from "../../../components/core/CustomTable/CustomTable";
import FilterOptions from "../../../components/core/FilterOptions/FilterOptions";
import { useLoaderDeps, useNavigate } from "@tanstack/react-router";
import ConfirmDialog from "../../../components/administracion/ConfirmDialog/ConfirmDialog";
import { useSnackbar } from "../../../hooks/core/useSnackbar";
import { useSuspenseQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "../../../App";
import PageHeader from "../../../components/core/PageHeader/PageHeader";
import AxiosInstance from "../../../helpers/AxiosInstance";
import useFilters from "../../../hooks/core/useFilters";
import { Supplier } from "../../../types/suppliers.types";
import { tablePaginationAdapter } from "../../../utils/core/tablePaginationAdapter";
import { sortByToState, stateToSortBy } from "../../../utils/core/tableSortMapper";
import { suppliersQueryOptions } from "../../../utils/proveedores/suppliersQueryOptions";
import { SUPPLIERS_COLUMNS } from "../../../utils/proveedores/supplierColumns";


const SuppliersManagementPage = () => {
  const navigate = useNavigate()
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const { filters, setFilters } = useFilters('/_auth/proveedores/')
  const loaderDeps = useLoaderDeps({ from: '/_auth/proveedores/' })
  const supplierQuery = useSuspenseQuery(suppliersQueryOptions(loaderDeps))
  const supplierResponse = supplierQuery?.data
  const sortingState = sortByToState(filters?.ordering)
  const paginationState = tablePaginationAdapter.apiToTable({
    current_page: supplierResponse?.data?.info.current_page ?? 1,
    page_size: loaderDeps?.page_size
  })

  const { showSnackbar } = useSnackbar()

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await AxiosInstance.delete(`/api/suppliers/suppliers/${id}/`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setDeleteModalOpen(false);
      setUserToDelete(null);
      showSnackbar('Usuario eliminado con éxito', 'danger');
    },
    onError: () => {
      showSnackbar('Error al eliminar el usuario', 'danger');
    }
  });

  const handleOpenDeleteModal = (id: string) => {
    setUserToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete);
    }
  };

  return (
    <>
      <ConfirmDialog
        open={deleteModalOpen}
        title="Eliminar Proveedor"
        content={`¿Estás seguro de que deseas eliminar el proveedor"?`}
        onConfirm={handleDelete}
        onClose={() => {
          setDeleteModalOpen(false);
          setUserToDelete(null);
        }}
      />
      <PageHeader
        title="Gestión de Usuarios"
        buttons={[
          {
            onClick: () => navigate({ to: '/proveedores/crear-proveedor' }),
            text: 'Crear Proveedor'
          }
        ]}
      />
      <FilterOptions
        onChangeFilters={(filters) => setFilters(filters)}
        selects={[
          {
            id: "category",
            placeholder: "Categoría",
            options: [
              { value: "", label: "Todas" },
              { value: "Electrónicos", label: "Electrónica" },
              { value: "Papelería", label: "Papelería" },
              { value: "Cotillón", label: "Cotillón" },
            ],
          },
        ]}
      />
      <CustomTable
        data={supplierResponse?.data?.results ?? []}
        columns={SUPPLIERS_COLUMNS(handleOpenDeleteModal) as ColumnDef<Supplier>[]}
        pagination={paginationState}
        paginationOptions={{
          onPaginationChange: (pagination) => {
            const newPaginationState = typeof pagination === 'function'
              ? pagination(paginationState)
              : pagination;

            const mappedPagination = tablePaginationAdapter.tableToApi(newPaginationState)

            setFilters({
              ...mappedPagination
            })
          },
          rowCount: supplierResponse?.data?.info.count ?? 0
        }}
        sorting={sortingState}
        onSortingChange={(sorting) => {
          const newSortingState = typeof sorting === 'function'
            ? sorting(sortingState)
            : sortingState
          return setFilters({ ordering: stateToSortBy(newSortingState) })
        }}
      />
    </>
  )
}

export default SuppliersManagementPage
