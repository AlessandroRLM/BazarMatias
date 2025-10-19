import { createColumnHelper } from "@tanstack/react-table";
import { Supplier } from "../../types/suppliers.types";
import { Edit, RemoveRedEye, Delete } from "@mui/icons-material";
import { Stack, IconButton } from "@mui/joy";
import IconLink from "../../components/administracion/IconLink/IconLink";

const columnHelper = createColumnHelper<Supplier>()

export const SUPPLIERS_COLUMNS = (handleDeleteClick: (id: string) => void) => [
    columnHelper.accessor('name', {
        id: 'name',
        header: () => 'Nombre',
        cell: info => info.getValue<string>(),
    }),
    columnHelper.accessor('address', {
        id: 'address',
        header: () => 'Dirección',
        cell: info => info.getValue<string>(),
    }),
    columnHelper.accessor('phone', {
        id: 'phone',
        header: () => 'Teléfono',
        cell: info => info.getValue<string>(),
    }),
    columnHelper.accessor('category', {
        id: 'category',
        header: () => 'Categoría',
        cell: info => info.getValue<string>(),
    }),
    columnHelper.accessor('id', {
        id: 'actions',
        header: () => 'Acciones',
        cell: info => (
            <Stack direction="row" spacing={1}>
                <IconLink
                    size="sm"
                    color="neutral"
                    to='/proveedores/devoluciones/editar-devolucion/$id'
                    params={{ id: info.getValue() }}
                >
                    <Edit />
                </IconLink>
                <IconLink
                    size="sm"
                    color="neutral"
                    to={'/proveedores/devoluciones/ver-devolucion/$id'}
                    params={{ id: info.getValue() }}
                >
                    <RemoveRedEye />
                </IconLink>
                <IconButton
                    variant="plain"
                    color="danger"
                    size="sm"
                    aria-label="Delete"
                    onClick={() => handleDeleteClick(info.getValue())}
                >
                    <Delete />
                </IconButton>
            </Stack>
        ),
        enableSorting: false
    })
]