import { createColumnHelper } from "@tanstack/react-table"
import { UserActivity } from "../../types/administracion.types"
import { Chip } from "@mui/joy"
import { ReactNode } from "@tanstack/react-router"
import { Check, Error, RemoveRedEye } from "@mui/icons-material"
import IconLink from "../../components/administracion/IconLink/IconLink"


function statusTypeMapper(statusType: string): ReactNode {
    switch (statusType) {
        case 'success':
            return <Chip color="success" endDecorator={<Check/>}>{'Éxito'}</Chip>
        case 'error':
            return <Chip color="danger" endDecorator={<Error/>}>{'Error'}</Chip>
        default:
            return statusType
    }
}

function actionTypeMapper(actionType: string): ReactNode {
    switch (actionType) {
        case 'LOGIN':
            return <Chip color="primary">{'Inicio de Sesión'}</Chip>
        case 'LOGOUT':
            return <Chip color="primary">{'Cierre de Sesión'}</Chip>
        case 'VIEW':
            return <Chip color="primary">{'Visualización'}</Chip>
        case 'CREATE':
            return <Chip color="success">{'Creación'}</Chip>
        case 'UPDATE':
            return <Chip color="warning">{'Actualización'}</Chip>
        case 'DELETE':
            return <Chip color="danger">{'Eliminación'}</Chip>
        default:
            return actionType
    }
}

const columnHelper = createColumnHelper<UserActivity>()
    
export const USER_ACTIVITY_COLUMNS = [
    columnHelper.accessor((row): string => `${row.user.first_name} ${row.user.last_name}`, {
        id: 'user',
        cell: info => info.getValue(),
        header: 'Nombre',
    }),
    columnHelper.accessor('action_type', {
        id: 'action_type',
        header: 'Tipo de Acción',
        cell: info => actionTypeMapper(info.getValue()),
    }),
    columnHelper.accessor('description', {
        id: 'description',
        header: () => 'Descripción',
        cell: info => info.getValue(),
        enableSorting: false
    }),
    columnHelper.accessor('data.status_type', {
        id: 'status_type',
        header: 'Tipo de Estado',
        cell: info => statusTypeMapper(info.getValue()),
        enableSorting: false,
        size: 50
    }),
    columnHelper.accessor((row): string => `${row.date} - ${row.time?.slice(0,8)}`, {
        id: 'timestamp',
        header: 'Fecha',
        cell: info => info.getValue(),
    }),
    columnHelper.accessor('id',{
        id: 'actions',
        header: 'Acciones',
        cell: info => <IconLink color="neutral" to={'/administracion/usuarios/actividad-de-usuario/$id'} params={{id: info.getValue()}}><RemoveRedEye/></IconLink>,
        enableSorting: false
    })
]