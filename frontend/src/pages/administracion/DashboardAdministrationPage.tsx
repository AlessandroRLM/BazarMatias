import PageHeader from "../../components/core/PageHeader/PageHeader"
import DashboardCard from "../../components/core/DashboardCard/DashboardCard"
import { PersonOutlined, SupervisorAccountOutlined } from "@mui/icons-material"
import { useSuspenseQuery } from "@tanstack/react-query"
import { administrationMetricsQueryOptions } from "../../utils/administracion/administracionQueryOptions"
import ActiveUsersChart from "../../components/administracion/ActiveUsersChart/ActiveUsersChart"
import RecentUserTable from "../../components/administracion/RecentUserTable/RecentUserTable"
import DashboardResponsiveDiv from "../../components/core/DashboardResponsiveDiv/DashboardResponsiveDiv"

const DashboardAdministrationPage = () => {

  const query = useSuspenseQuery(administrationMetricsQueryOptions())
  const queryResponse = query.data

  return (
    <>
      <PageHeader
        title="Dashboard de Administración"
        buttons={[{ text: 'Reporte' }]}
      />
      <DashboardResponsiveDiv>
        <DashboardCard
          title="Total de Usuarios"
          amount={queryResponse?.data.amount_users}
          icon={<PersonOutlined />}
        />
        <DashboardCard
          title="Total de Administradores"
          amount={queryResponse?.data.amount_admins}
          icon={<SupervisorAccountOutlined />}
        />
      </DashboardResponsiveDiv>

      <DashboardResponsiveDiv>
        <RecentUserTable
          recentUsers={query?.data.data.recent_users}
        />
        <ActiveUsersChart
          data={query?.data.data}
        />
      </DashboardResponsiveDiv>
    </>
  )
}

export default DashboardAdministrationPage