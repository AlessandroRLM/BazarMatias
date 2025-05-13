import { Stack, Card, CardContent, Typography } from "@mui/joy";
import { useEffect, useState } from "react";
import PageHeader from "../../components/core/PageHeader/PageHeader";
import DashboardCard from "../../components/core/DashboardCard/DashboardCard";
import MdiPackageVariantClosed from "../../assets/PackageOutlined";
import PeopleOutlined from "../../assets/PeopleOutlined";
import WorkOutlined from "../../assets/WorkOutlined";
import CloseOutlined from "../../assets/CloseOutlined";
import { fetchSuppliers, fetchReturnSuppliers } from "../../services/inventoryService";
import { useNavigate } from "@tanstack/react-router";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';

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

        const suppliersResponse = await fetchSuppliers({ page: 1, page_size: 1 });
        const totalSuppliers = suppliersResponse.info?.count || 0;

        const returnsResponse = await fetchReturnSuppliers({
          page: 1,
          page_size: 1,
          status: 'Pendiente'
        });
        const totalPendingReturns = returnsResponse.info?.count || 0;

        const totalActiveOrders = 5; // Temporal
        const totalCompletedOrders = 3; // Temporal también

        setStats({
          totalSuppliers,
          totalPendingReturns,
          totalActiveOrders,
          totalCompletedOrders
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

  const pieData = [
    { name: 'Órdenes Activas', value: stats.totalActiveOrders },
    { name: 'Órdenes Completadas', value: stats.totalCompletedOrders },
    { name: 'Devoluciones Pendientes', value: stats.totalPendingReturns }
  ];

  const barData = [
    { name: 'Proveedores', Total: stats.totalSuppliers },
    { name: 'Activas', Total: stats.totalActiveOrders },
    { name: 'Pendientes', Total: stats.totalPendingReturns },
    { name: 'Completadas', Total: stats.totalCompletedOrders },
  ];

  const COLORS = ['#1976d2', '#2e7d32', '#d32f2f'];

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
          icon={<PeopleOutlined width={32} height={32} />}
          helperText={`${stats.totalSuppliers} proveedores registrados`}
        />

        <DashboardCard
          title="Órdenes Activas"
          amount={stats.totalActiveOrders}
          icon={<WorkOutlined width={32} height={32} />}
          helperText={`${stats.totalActiveOrders} órdenes en proceso`}
        />

        <DashboardCard
          title="Devoluciones Pendientes"
          amount={stats.totalPendingReturns}
          icon={<CloseOutlined width={32} height={32} />}
          helperText={`${stats.totalPendingReturns} por resolver`}
          helperTextColor="danger"
        />

        <DashboardCard
          title="Órdenes Completadas"
          amount={stats.totalCompletedOrders}
          icon={<MdiPackageVariantClosed width={32} height={32} />}
          helperText={`${stats.totalCompletedOrders} finalizadas`}
          helperTextColor="success"
        />
      </Stack>

      <Stack direction="row" spacing={3}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography level="title-md" sx={{ mb: 2 }}>Resumen Visual (Pie)</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card sx={{ flex: 2 }}>
          <CardContent>
            <Typography level="title-md" sx={{ mb: 2 }}>Comparativa General (Barras)</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="Total" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Stack>
    </>
  );
};

export default DashboardSupplierPage;
