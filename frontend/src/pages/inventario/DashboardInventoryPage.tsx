import { Stack } from "@mui/joy"
import PageHeader from "../../components/core/PageHeader/PageHeader"
import DashboardCard from "../../components/core/DashboardCard/DashboardCard"
import MdiPackageVariantClosed from "../../assets/PackageOutlined"


const DashboardInventoryPage = () => {
  return (
    <>
        <PageHeader
            title="Dashboard de Administración"
            buttons={[{text: 'Reporte'}]}
        />
        <Stack direction={'row'}>
            <DashboardCard
                title="Total de Usuarios"
                amount="107"
                helperTitle="Mes Actual"
                helperText="+4 desde el mes anterior"
                icon={<MdiPackageVariantClosed width={32} height={32}/>}
            />
        </Stack>
    </>
  )
}

export default DashboardInventoryPage