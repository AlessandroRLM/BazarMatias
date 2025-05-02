import { Stack } from "@mui/joy"
import PageHeader from "../../components/core/PageHeader/PageHeader"
import DashboardCard from "../../components/core/DashboardCard/DashboardCard"
import { PersonOutlined, SupervisorAccountOutlined } from "@mui/icons-material"
import { useSuspenseQuery } from "@tanstack/react-query"
import { administrationMetricsQueryOptions } from "../../utils/administracion/administracionQueryOptions"
import ActiveUsersChart from "../../components/administracion/ActiveUsersChart/ActiveUsersChart"
import RecentUserTable from "../../components/administracion/RecentUserTable/RecentUserTable"

const DashboardAdministrationPage = () => {

  const query = useSuspenseQuery(administrationMetricsQueryOptions())
  const queryResponse = query.data

  return (
    <>
        <PageHeader
            title="Dashboard de Administración"
            buttons={[{text: 'Reporte'}]}
        />
        <Stack direction={'row'} alignItems={'center'}
          sx={(theme) => ({
            gap: 1,
            flexWrap: 'wrap',
            [theme.breakpoints.up('sm')]: {
              flexWrap: 'nowrap',
            }
          })}
        >
            <DashboardCard
                title="Total de Usuarios"
                amount={queryResponse?.data.amount_users}
                icon={<PersonOutlined/>}
            />
            <DashboardCard
              title="Total de Administradores"
              amount={queryResponse?.data.amount_admins}
              icon={<SupervisorAccountOutlined/>}
            />
        </Stack>

        <Stack direction={'row'} alignItems={'center'}
          sx={(theme) => ({
            gap: 1,
            flexWrap: 'wrap',
            [theme.breakpoints.up('sm')]: {
              flexWrap: 'nowrap',
            }
          })}
        >
          <RecentUserTable recentUsers={query?.data.data.recent_users}/>
          <ActiveUsersChart data={query?.data.data}/>
        </Stack>
    </>
  )
}

export default DashboardAdministrationPage