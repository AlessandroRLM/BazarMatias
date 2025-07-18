import { createColumnHelper } from "@tanstack/react-table";
import { Product } from "../../types/inventory.types";
import { Typography, Stack, IconButton, Chip } from "@mui/joy";
import { Check, Delete, Edit, Error, RemoveRedEye, Warning } from "@mui/icons-material";
import { Link } from "@tanstack/react-router";

function stockChipMapper(stock: number, isLowStock: boolean) {

    return (
        <Chip
            size="sm"
            color={
                stock === 0 ? 'danger' :
                    isLowStock === true ? 'warning' :
                        'success'
            }
            endDecorator={
                stock === 0 ? <Error /> :
                    isLowStock === true ? <Warning /> :
                        <Check />
            }
        >
            {stock} unidades
        </Chip>
    );
}

const columnHelper = createColumnHelper<Product>()

export const INVENTORY_COLUMNS = (handleDelete: (id: string, name: string) => void) => [

    columnHelper.accessor('name', {
        header: "Producto",
        cell: info => <Typography fontWeight="md">{info.getValue<string>()}</Typography>
    }),
    columnHelper.accessor('category', {
        header: "Categoría",
        enableSorting: false
    }),
    columnHelper.accessor('price_clp', {
        header: "Precio",
        cell: info => `$${info.getValue<number>()}`
    }),
    columnHelper.accessor('stock', {
        header: "Stock",
        cell: info => {
            const product = info.row.original;
            return stockChipMapper(product.stock, product.is_below_min_stock);
        }
    }),
    columnHelper.accessor('id', {
        id: 'actions',
        header: 'Acciones',
        cell: info => {
            const product = info.row.original;

            return (
            <Stack direction="row" spacing={1}>
                <IconButton
                    variant="plain"
                    color="neutral"
                    size="sm"
                    aria-label="View"
                    component={Link}
                    to={`/inventario/productos/ver-producto/${product.id}`}
                >
                    <RemoveRedEye />
                </IconButton>
                <IconButton
                    component={Link}
                    to={`/inventario/productos/editar-producto/${product.id}`}
                    variant="plain"
                    color="neutral"
                    size="sm"
                    aria-label="Edit"
                >
                    <Edit />
                </IconButton>
                <IconButton
                    variant="plain"
                    color="danger"
                    size="sm"
                    aria-label="Delete"
                    onClick={() => handleDelete(product.id, product.name)}

                >
                    <Delete />
                </IconButton>
            </Stack>
        )},
        enableSorting: false
    }),
];