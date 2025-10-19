import PageHeader from "../../components/core/PageHeader/PageHeader"
import DashboardCard from "../../components/core/DashboardCard/DashboardCard"
import { PersonOutlined, SupervisorAccountOutlined } from "@mui/icons-material"
import { useSuspenseQuery } from "@tanstack/react-query"
import { administrationMetricsQueryOptions } from "../../utils/administracion/administracionQueryOptions"
import ActiveUsersChart from "../../components/administracion/ActiveUsersChart/ActiveUsersChart"
import RecentUserTable from "../../components/administracion/RecentUserTable/RecentUserTable"
import DashboardResponsiveDiv from "../../components/core/DashboardResponsiveDiv/DashboardResponsiveDiv"
import { downloadUserReportPDF } from "../../services/reportsService"
import { useSnackbar } from "../../hooks/core/useSnackbar"

const DashboardAdministrationPage = () => {
  const query = useSuspenseQuery(administrationMetricsQueryOptions())
  const queryResponse = query.data

  const { showSnackbar } = useSnackbar()

  // Función para descargar el PDF y lanzar descarga en navegador
  const handleDownloadReport = async () => {
    try {
      const pdfBlob = await downloadUserReportPDF()
      const url = window.URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'reporte_usuarios.pdf')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      showSnackbar('Reporte descargado exitosamente.', 'success')
    } catch (error) {
      showSnackbar('Error al descargar el reporte.', 'danger')
    }
  }

  return (
    <>
      <PageHeader
        title="Dashboard de Administración"
        buttons={[{ text: 'Reporte', onClick: handleDownloadReport }]}  // aquí
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