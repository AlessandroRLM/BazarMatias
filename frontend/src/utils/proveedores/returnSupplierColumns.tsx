import { createColumnHelper } from "@tanstack/table-core";
import { ReturnSupplierList } from "../../types/suppliers.types";
import { Check, Delete, Edit, Error, RemoveRedEye, WarningOutlined } from "@mui/icons-material";
import { Chip, IconButton, Stack } from "@mui/joy";
import { ReactNode } from "react";
import IconLink from "../../components/administracion/IconLink/IconLink";
import dayjs from "dayjs";

function statusMapper(statusType: string): ReactNode {
    switch (statusType) {
        case 'AP':
            return <Chip size="sm" color="success" endDecorator={<Check />}>Aprobado</Chip>
        case 'RE':
            return <Chip size="sm" color="danger" endDecorator={<Error />}>Rechazado</Chip>
        case 'PE':
            return <Chip size="sm" color="warning" endDecorator={<WarningOutlined />}>Pendiente</Chip>
        default:
            return statusType
    }
}

const columnHelper = createColumnHelper<ReturnSupplierList>()

export const RETURN_SUPPLIER_COLUMNS = (handleDeleteClick: (id: string) => void) => [
    columnHelper.accessor('supplier_name', {
        id: 'supplier__name',
        header: () => 'Proveedor',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('purchase_number', {
        id: 'purchase_number',
        header: () => 'Nº de Compra',
        cell: info => info.getValue(),
        enableSorting: false
    }),
    columnHelper.accessor('return_date', {
        id: 'return_date',
        header: () => 'Fecha de Devolución',
        cell: info => dayjs(info.getValue()).format('DD/MM/YYYY'),
    }),
    columnHelper.accessor('total_products', {
        id: 'total_products',
        header: () => 'Total Productos',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('total_items', {
        id: 'total_items',
        header: () => 'Total Items',
        cell: info => info.getValue(),
        enableSorting: false
    }),
    columnHelper.accessor('status', {
        id: 'status',
        header: () => 'Estado',
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