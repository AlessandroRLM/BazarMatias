import { createColumnHelper } from "@tanstack/react-table"

import { Check, Delete, Edit, Error, RemoveRedEye, WarningOutlined } from "@mui/icons-material"
import { Chip, IconButton, Stack } from "@mui/joy"
import { ReactNode } from "react"

import { Quote } from "../../../types/sales.types"
import IconLink from "../../../components/administracion/IconLink/IconLink"

function statusMapper(statusType: string): ReactNode {
    switch (statusType) {
        case 'AP':
            return <Chip size="sm" color="success" endDecorator={<Check />}>{'Aprobada'}</Chip>
        case 'RE':
            return <Chip size="sm" color="danger" endDecorator={<Error />}>{'Rechazada'}</Chip>
        case 'PE':
            return <Chip size="sm" color="warning" endDecorator={<WarningOutlined />}>{'Pendiente'}</Chip>
        default:
            return statusType
    }
}
const columnHelper = createColumnHelper<Quote>()

export const QUOTE_COLUMNS = (handleDeleteClick: (id: string) => void) => [
    columnHelper.accessor('client', {
        id: 'client',
        header: 'Cliente',
        cell: (info) => info.getValue(),
    }),

    columnHelper.accessor('created_at', {
        id: 'created_at',
        header: 'Fecha de Creación',
        cell: (info) => info.getValue(),
    }),

    columnHelper.accessor('total', {
        id: 'total',
        header: 'Total',
        cell: (info) => info.getValue(),
    }),

    columnHelper.accessor('status', {
        id: 'status',
        header: 'Estado',
        cell: (info) => statusMapper(info.getValue()),
    }),

    columnHelper.accessor('id', {
        id: 'actions',
        header: 'Acciones',
        cell: (info) => (
            <Stack direction="row" spacing={1}>
                <IconLink
                    size="sm"
                    color="neutral"
                    to='/ventas/cotizaciones/editar-cotizacion/$id'
                    params={{ id: info.getValue() }}
                >
                    <Edit />
                </IconLink>
                <IconLink
                    size="sm"
                    color="neutral"
                    to={'/ventas/cotizaciones/ver-cotizacion/$id'}
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
        enableSorting: false,
    })
]