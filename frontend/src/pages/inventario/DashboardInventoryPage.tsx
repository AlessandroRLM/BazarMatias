import PageHeader from "../../components/core/PageHeader/PageHeader"
import DashboardCard from "../../components/core/DashboardCard/DashboardCard"
import PackageOutlined from "../../assets/PackageOutlined"
import DashboardResponsiveDiv from "../../components/core/DashboardResponsiveDiv/DashboardResponsiveDiv"


const DashboardInventoryPage = () => {
  return (
    <>
      <PageHeader
        title="Dashboard de Administración"
        buttons={[{ text: 'Reporte' }]}
      />
      <DashboardResponsiveDiv>
        <DashboardCard
          title="Total de Usuarios"
          amount={107}
          helperTitle="Mes Actual"
          helperText="+4 desde el mes anterior"
          icon={<PackageOutlined width={32} height={32} />}
        />
      </DashboardResponsiveDiv>
      <DashboardResponsiveDiv>
        hola
      </DashboardResponsiveDiv>
    </>
  )
}

export default DashboardInventoryPage