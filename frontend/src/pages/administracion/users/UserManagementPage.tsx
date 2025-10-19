import { useLoaderDeps, useNavigate } from "@tanstack/react-router"
import useFilters from "../../../hooks/core/useFilters"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import PageHeader from "../../../components/core/PageHeader/PageHeader"
import FilterOptions from "../../../components/core/FilterOptions/FilterOptions"
import CustomTable from "../../../components/core/CustomTable/CustomTable"
import { useState } from "react"
import { USER_COLUMNS } from "../../../utils/administracion/usersColumns"
import { ColumnDef } from "@tanstack/react-table"
import { tablePaginationAdapter } from "../../../utils/core/tablePaginationAdapter"
import { sortByToState, stateToSortBy } from "../../../utils/core/tableSortMapper"
import { queryClient } from "../../../App"
import ConfirmDialog from "../../../components/administracion/ConfirmDialog/ConfirmDialog"
import { usersQueryOptions } from "../../../utils/administracion/administracionQueryOptions"
import { User } from "../../../types/auth.types"
import { useSnackbar } from "../../../hooks/core/useSnackbar"
import AxiosInstance from "../../../helpers/AxiosInstance"

const UserManagementPage = () => {
    const navigate = useNavigate()
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [userToDelete, setUserToDelete] = useState<string | null>(null)
    const { filters, setFilters } = useFilters('/_auth/administracion/usuarios/')
    const loaderDeps = useLoaderDeps({ from: '/_auth/administracion/usuarios/' })
    const userQuery = useSuspenseQuery(usersQueryOptions(loaderDeps))
    const userResponse = userQuery?.data
    const sortingState = sortByToState(filters?.ordering)
    const paginationState = tablePaginationAdapter.apiToTable({
        current_page: userResponse?.data?.info.current_page ?? 1,
        page_size: loaderDeps?.page_size
    })

    const { showSnackbar } = useSnackbar()

    const deleteMutation = useMutation({
        mutationFn: async (nationalId: string) => {
            await AxiosInstance.delete(`/api/users/users/${nationalId}/`)
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

    const handleOpenDeleteModal = (nationalId: string) => {
        setUserToDelete(nationalId);
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
                title="Eliminar Usuario"
                content={`¿Estás seguro de que deseas eliminar el usuario con RUT: "${userToDelete}"?`}
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
                        onClick: () => navigate({ to: '/administracion/usuarios/crear-usuario' }), 
                        text: 'Crear Usuario' 
                    }
                ]}
            />
            <FilterOptions
                onChangeFilters={(filters) => setFilters(filters)}
                selects={[
                    {
                        id: 'is_active',
                        placeholder: 'Estado',
                        options: [
                            { value: null, label: 'Todos' },
                            { value: true, label: 'Activos' },
                            { value: false, label: 'Inactivos' }
                        ]
                    },
                ]}
            />
            <CustomTable
                data={userResponse?.data?.results ?? []}
                columns={USER_COLUMNS(handleOpenDeleteModal) as ColumnDef<User>[]}
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
                    rowCount: userResponse?.data?.info.count ?? 0
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

export default UserManagementPage