import { Stack, Card, CardContent, Typography, Divider } from "@mui/joy";
import { useEffect, useState } from "react";
import PageHeader from "../../components/core/PageHeader/PageHeader";
import DashboardCard from "../../components/core/DashboardCard/DashboardCard";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";

const DashboardSalesPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    monthlyProfit: 0,
    totalSales: 0,
    paidSales: 0,
    dueSales: 0,
    approvedQuotes: 0,
    pendingQuotes: 0,
    rejectedQuotes: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setTimeout(() => {
          setStats({
            monthlyProfit: 36400,
            totalSales: 14,
            paidSales: 12,
            dueSales: 2,
            approvedQuotes: 2,
            pendingQuotes: 1,
            rejectedQuotes: 1,
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const monthlyData = [
    { name: "Enero", value: 32000 },
    { name: "Febrero", value: 48000 },
    { name: "Marzo", value: 40000 },
    { name: "Abril", value: 56000 },
    { name: "Mayo", value: 64000 },
    { name: "Junio", value: 80000 },
  ];

  const productsData = [
    { name: "Cuaderno-Cuaderno", value: 35 },
    { name: "Post y Auditorios", value: 28 },
    { name: "Trasa", value: 22 },
    { name: "Para Zudito", value: 18 },
    { name: "Puede mejorar", value: 15 },
    { name: "Señora en Bena", value: 12 },
    { name: "Cuaderno Universitario", value: 10 },
    { name: "Auditorios General", value: 8 },
    { name: "SUSY TV", value: 5 },
    { name: "Salzado", value: 3 },
  ];

  if (loading) {
    return (
      <Stack spacing={2}>
        <PageHeader title="Dashboard de Ventas" />
        <Stack direction="row" spacing={2} flexWrap="wrap">
          {[...Array(7)].map((_, i) => (
            <Card key={i} sx={{ width: 200, height: 120 }}>
              <CardContent>
                <Typography level="body-sm">Cargando...</Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Stack>
    );
  }

  function handleGenerateReport(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <Stack spacing={2}>
      <PageHeader
        title="Dashboard de Ventas"
        buttons={[{ text: "Reporte", onClick: handleGenerateReport }]}
      />
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <DashboardCard
          title="Ganancia Mensual"
          amount={stats.monthlyProfit}
          helperText={"Mes actual"}
          icon={undefined}
        />
        <DashboardCard
          title="Total Ventas"
          amount={stats.totalSales}
          helperText="Mes actual"
          icon={undefined}
        />
        <DashboardCard
          title="Ventas Pagadas"
          amount={stats.paidSales}
          helperText="Mes actual"
          icon={undefined}
        />
        <DashboardCard
          title="Ventas Debidas"
          amount={stats.dueSales}
          helperText="Mes actual"
          icon={undefined}
        />
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Card sx={{ flex: 1, minWidth: 300 }}>
          <CardContent>
            <Typography level="title-md" sx={{ mb: 1 }}>
              Ganancia Mensual
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart
                data={monthlyData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`SCLP${value}`, "Ganancia"]} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#1976d2"
                  fill="#1976d2"
                  fillOpacity={0.2}
                  dot={{ r: 4, fill: "#1976d2", strokeWidth: 2 }}
                  activeDot={{
                    r: 6,
                    fill: "#1976d2",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: 300 }}>
        <CardContent>
            <Typography level="title-md" sx={{ mb: 1 }}>
            Productos Más Vendidos
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <ResponsiveContainer width="100%" height={300}>
            <BarChart
                data={productsData}
                margin={{ top: 20, right: 30, left: 0, bottom: 50 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" type="category" angle={-45} textAnchor="end" interval={0} height={60} />
                <YAxis type="number" />
                <Tooltip />
                <Bar dataKey="value" fill="#1976d2">
                {productsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} />
                ))}
                </Bar>
            </BarChart>
            </ResponsiveContainer>
        </CardContent>
        </Card>
      </Stack>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <DashboardCard
          title="Cotizaciones Aprobadas"
          amount={stats.approvedQuotes}
          icon={undefined}
        />
        <DashboardCard
          title="Cotizaciones Pendientes"
          amount={stats.pendingQuotes}
          icon={undefined}
        />
        <DashboardCard
          title="Cotizaciones Rechazadas"
          amount={stats.rejectedQuotes}
          icon={undefined}
        />
      </Stack>
    </Stack>
  );
};

export default DashboardSalesPage;
