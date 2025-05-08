import { Stack } from "@mui/joy";
import PageHeader from "../../components/core/PageHeader/PageHeader";
import DashboardCard from "../../components/core/DashboardCard/DashboardCard";
import MdiPackageVariantClosed from "../../assets/PackageOutlined";
import PeopleOutlined from "../../assets/PeopleOutlined";
import WorkOutlined from "../../assets/WorkOutlined";
import CloseOutlined from "../../assets/CloseOutlined";

const DashboardSupplierPage = () => {
  return (
    <>
      <PageHeader
        title="Dashboard de Proveedores"
        buttons={[{text: 'Reporte'}]}
      />
      
      <Stack direction={'row'} spacing={2} sx={{ mb: 3 }}>
        <DashboardCard
          title="Total de Proveedores"
          amount={3}
          icon={<PeopleOutlined width={32} height={32}/>}
        />
        
        <DashboardCard
          title="Órdenes Activas"
          amount={5}
          icon={<WorkOutlined width={32} height={32}/>}
        />
        
        <DashboardCard
          title="Devoluciones"
          amount={2}
          icon={<CloseOutlined width={32} height={32}/>}
          helperTextColor="danger"
        />
        
        <DashboardCard
          title="Órdenes Activas"
          amount={8}
          icon={<MdiPackageVariantClosed width={32} height={32}/>}
        />
      </Stack>
    </>
  );
};

export default DashboardSupplierPage;