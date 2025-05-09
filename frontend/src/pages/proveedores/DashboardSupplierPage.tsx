import { Stack } from "@mui/joy";
import { useEffect, useState } from "react";
import PageHeader from "../../components/core/PageHeader/PageHeader";
import DashboardCard from "../../components/core/DashboardCard/DashboardCard";
import MdiPackageVariantClosed from "../../assets/PackageOutlined";
import PeopleOutlined from "../../assets/PeopleOutlined";
import WorkOutlined from "../../assets/WorkOutlined";
import CloseOutlined from "../../assets/CloseOutlined";
import { fetchSuppliers, fetchReturnSuppliers } from "../../services/inventoryService";
import { useNavigate } from "@tanstack/react-router";

const DashboardSupplierPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSuppliers: 0,
    totalActiveOrders: 0,
    totalPendingReturns: 0,
    totalCompletedOrders: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch suppliers data
        const suppliersResponse = await fetchSuppliers({ page: 1, page_size: 1 });
        const totalSuppliers = suppliersResponse.info?.count || 0;
        
        // Fetch returns data (filtering by pending status)
        const returnsResponse = await fetchReturnSuppliers({ 
          page: 1, 
          page_size: 1,
          status: 'Pendiente'
        });
        const totalPendingReturns = returnsResponse.info?.count || 0;
        
        // For active orders, you'll need to implement this endpoint
        // This is just a placeholder - replace with actual API call
        const totalActiveOrders = 5; // Temporal hasta que implementes fetchPurchaseOrders
        
        setStats({
          totalSuppliers,
          totalPendingReturns,
          totalActiveOrders,
          totalCompletedOrders: 0 // Temporal hasta que implementes el endpoint
        });

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleGenerateReport = () => {
    navigate({ to: "/proveedores/reportes" });
  };

  if (loading) {
    return (
      <Stack spacing={3}>
        <PageHeader
          title="Dashboard de Proveedores"
          buttons={[{ text: 'Reporte', onClick: handleGenerateReport }]}
        />
        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
          {[...Array(4)].map((_, i) => (
            <DashboardCard key={i} loading />
          ))}
        </Stack>
      </Stack>
    );
  }

  return (
    <>
      <PageHeader
        title="Dashboard de Proveedores"
        buttons={[{ text: 'Reporte', onClick: handleGenerateReport }]}
      />
      
      <Stack direction={'row'} spacing={2} sx={{ mb: 3 }}>
        <DashboardCard
          title="Total de Proveedores"
          amount={stats.totalSuppliers}
          icon={<PeopleOutlined width={32} height={32}/>}
          helperText={`${stats.totalSuppliers} proveedores registrados`}
        />
        
        <DashboardCard
          title="Órdenes Activas"
          amount={stats.totalActiveOrders}
          icon={<WorkOutlined width={32} height={32}/>}
          helperText={`${stats.totalActiveOrders} órdenes en proceso`}
        />
        
        <DashboardCard
          title="Devoluciones Pendientes"
          amount={stats.totalPendingReturns}
          icon={<CloseOutlined width={32} height={32}/>}
          helperText={`${stats.totalPendingReturns} por resolver`}
          helperTextColor="danger"
        />
        
        <DashboardCard
          title="Órdenes Completadas"
          amount={stats.totalCompletedOrders}
          icon={<MdiPackageVariantClosed width={32} height={32}/>}
          helperText={`${stats.totalCompletedOrders} finalizadas`}
          helperTextColor="success"
        />
      </Stack>
    </>
  );
};

export default DashboardSupplierPage;