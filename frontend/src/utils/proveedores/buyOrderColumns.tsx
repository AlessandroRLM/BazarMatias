import { createColumnHelper } from "@tanstack/table-core";
import { BuyOrder } from "../../types/proveedores.types";
import { Check, Delete, Edit, Error, RemoveRedEye, WarningOutlined } from "@mui/icons-material";
import { Chip, IconButton, Stack } from "@mui/joy";
import { ReactNode } from "react";
import IconLink from "../../components/administracion/IconLink/IconLink";

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

const columnHelper = createColumnHelper<BuyOrder>()

export const BUY_ORDER_COLUMNS = (handleDeleteClick: (id: string) => void) => [
    columnHelper.accessor('supplier', {
        id: 'supplier',
        header: () => 'Proveedor',
        cell: info => info.getValue(),
    }),

    columnHelper.accessor('total_amount', {
        id: 'total',
        header: () => 'Total',
        cell: info => info.getValue(),
        enableSorting: false
    }),
    columnHelper.accessor('status', {
        id: 'status',
        header: () => 'Estado',
        cell: info => statusMapper(info.getValue())
    }),
    columnHelper.accessor((row): string => `${row.created_at}`, {
        id: 'created_at',
        header: () => 'Fecha de Creación',
        cell: info => statusMapper(info.getValue())
    }),
    columnHelper.accessor('id', {
        id: 'actions',
        header: 'Acciones',
        cell: info => (
            <Stack direction="row" spacing={1}>
                <IconLink
                    size="sm"
                    color="neutral"
                    to='/proveedores/editar-ordenes-de-compra/$id'
                    params={{ id: info.getValue() }}
                >
                    <Edit />
                </IconLink>
                <IconLink
                    size="sm"
                    color="neutral"
                    to={'/proveedores/ver-ordenes-de-compra/$id'}
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
