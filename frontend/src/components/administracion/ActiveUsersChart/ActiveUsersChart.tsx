import { PieChart } from '@mui/x-charts/PieChart';
import DashboardBox from "../../core/DashboardBox/DashboardBox"
import { administrationMetrics } from '../../../types/administracion.types';
import { Typography } from '@mui/joy';

type Props = {
    data: administrationMetrics
}

const ActiveUsersChart = (props: Props) => {
  return (
    <DashboardBox>
        <Typography level='h4'>
            Usuarios en la plataforma
        </Typography>
        <PieChart
            series={[
                {
                    data: [
                        {id: 0, value: props.data.active_users_count, label: 'Usuarios Activos', color: 'var(--joy-palette-success-500, #1F7A1F)'},
                        {id: 1, value: props.data.inactive_users_count, label: 'Usuarios Inactivos', color: 'var(--joy-palette-danger-500, #C41C1C)'}
                    ]
                }
            ]}
            height={430}
        />
    </DashboardBox>
  )
}

export default ActiveUsersChart