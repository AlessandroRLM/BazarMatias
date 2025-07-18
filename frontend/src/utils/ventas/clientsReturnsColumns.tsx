import { Delete, Edit, RemoveRedEye } from "@mui/icons-material";
import { Chip, IconButton, Stack } from "@mui/joy";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { ClientsReturn } from "../../types/sales.types";
import dayjs from "dayjs";
import { Link } from "@tanstack/react-router";

const statusTypeMapper = (status: string) => {
    switch (status) {
        case 'pending':
            return <Chip color="warning" size="sm" variant="soft">Pendiente</Chip>;
        case 'completed':
            return <Chip color="success" size="sm" variant="soft">Resuelto</Chip>;
        case 'refused':
            return <Chip color="danger" size="sm" variant="soft">Denegado</Chip>;
        default:
            return status;
    }
}

const columnHelper = createColumnHelper<ClientsReturn>()

export const CLIENTS_RETURNS_COLUMNS = (handleDelete: (id: string) => void) =>  [
    columnHelper.accessor(row => `${row.client.first_name} ${row.client.last_name}`, {
        header: 'Cliente',
        cell: info => info.getValue<string>()
    }),
    columnHelper.accessor('sale.date', {
      header: "Fecha de Venta",
      cell: info => dayjs(info.getValue()).format('DD/MM/YYYY - HH:mm')
    }),
    columnHelper.accessor('status' ,{
      header: "Estado",
      cell: info => statusTypeMapper(info.getValue<string>())
    }),
    columnHelper.accessor('id', {
      id: "actions",
      header: "Acciones",
      cell: info => {
        return (
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              variant="plain"
              color="neutral"
              size="sm"
              aria-label="View"
              component={Link}
              to={`/proveedores/devoluciones/ver-devolucion/${info.getValue()}`}
            >
              <RemoveRedEye />
            </IconButton>

            {(info.row.original.status === 'pending') && (
              <>
                <IconButton
                  component={Link}
                  to={`/proveedores/devoluciones/editar-devolucion/${info.getValue()}`}
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
                  onClick={() => handleDelete(info.getValue())}
                >
                  <Delete />
                </IconButton>
              </>
            )}
          </Stack>
        );
      },
    }),
  ] as ColumnDef<ClientsReturn>[];