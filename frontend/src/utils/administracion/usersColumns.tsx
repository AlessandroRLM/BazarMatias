import { createColumnHelper } from "@tanstack/table-core";
import { Delete, Edit, RemoveRedEye } from "@mui/icons-material";
import { Chip, IconButton, Stack } from "@mui/joy";
import { ReactNode } from "react";
import IconLink from "../../components/administracion/IconLink/IconLink";
import dayjs from "dayjs";
import { User } from "../../types/auth.types";

function statusMapper(isActive: boolean): ReactNode {
    return isActive 
        ? <Chip size="sm" color="success">Activo</Chip>
        : <Chip size="sm" color="danger">Inactivo</Chip>
}

const columnHelper = createColumnHelper<User>()

export const USER_COLUMNS = (handleDeleteClick: (id: string) => void) => [
    columnHelper.accessor('formatted_national_id', {
        id: 'national_id',
        header: () => 'RUT',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor(row => `${row.first_name} ${row.last_name}`, {
        id: 'last_name',
        header: () => 'Nombre Completo',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('email', {
        id: 'email',
        header: () => 'Email',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('last_login', {
        id: 'last_login',
        header: () => 'Último Acceso',
        cell: info => {
            const value = info.getValue();
            return value ? dayjs(value).format('DD/MM/YYYY HH:mm') : 'Nunca';
        },
    }),
    columnHelper.accessor('is_active', {
        id: 'is_active',
        header: () => 'Estado',
        cell: info => statusMapper(info.getValue()),
        enableSorting: false
    }),
    columnHelper.accessor('national_id', {
        id: 'actions',
        header: 'Acciones',
        cell: info => (
            <Stack direction="row" spacing={1}>
                <IconLink
                    size="sm"
                    color="neutral"
                    to='/administracion/usuarios/editar-usuario/$rut'
                    params={{ rut: info.getValue() }}
                >
                    <Edit />
                </IconLink>
                <IconLink
                    size="sm"
                    color="neutral"
                    to={'/administracion/usuarios/ver-usuario/$rut'}
                    params={{ rut: info.getValue() }}
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