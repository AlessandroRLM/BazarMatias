import { Stack, Card, CardContent, Typography, Divider, Skeleton } from "@mui/joy";
import { useEffect } from "react";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  fetchDashboardStats,
  fetchMonthlyProfitData,
  fetchTopProductsData, 
} from "../../services/salesService";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { es } from "date-fns/locale";

// Tipos de datos
interface DashboardStats {
  monthlyProfit: number;
  previousMonthProfit: number;
  totalSales: number;
  paidSales: number;
  dueSales: number;
  approvedQuotes: number;
  pendingQuotes: number;
  rejectedQuotes: number;
  topClients: { name: string; value: number }[];
}

// Constantes
const CURRENT_MONTH = format(new Date(), "MMMM", { locale: es });
const PREVIOUS_MONTH = format(subMonths(new Date(), 1), "MMMM", { locale: es });

// Función para formatear dinero
const formatMoney = (amount: number) => {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Componente principal
const DashboardSalesPage = () => {
  const queryClient = useQueryClient();
  const currentDate = new Date();
  const currentMonthStart = startOfMonth(currentDate).toISOString().split("T")[0];
  const currentMonthEnd = endOfMonth(currentDate).toISOString().split("T")[0];

  // Queries para obtener datos reales del backend
  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
  });

  const { data: monthlyData, isLoading: monthlyDataLoading } = useQuery({
    queryKey: ["monthly-profit-data"],
    queryFn: fetchMonthlyProfitData,
  });

  const { data: productsData, isLoading: productsDataLoading } = useQuery({
    queryKey: ["top-products-data"],
    queryFn: fetchTopProductsData,
  });

  // Prefetch de datos para mejor experiencia de usuario
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ["sales-data", currentMonthStart, currentMonthEnd],
      queryFn: () => fetchSales({
        created_at_after: currentMonthStart,
        created_at_before: currentMonthEnd,
        page_size: 100,
      }),
    });

    queryClient.prefetchQuery({
      queryKey: ["quotes-data", currentMonthStart, currentMonthEnd],
      queryFn: () => fetchQuotes({
        created_at_after: currentMonthStart,
        created_at_before: currentMonthEnd,
        page_size: 100,
      }),
    });
  }, [queryClient, currentMonthStart, currentMonthEnd]);

  const handleGenerateReport = () => {
    console.log("Función de generación de reporte clickeada, pero aún no implementada");
  };

  const isLoading = statsLoading || monthlyDataLoading || productsDataLoading;

  // Componente de carga esqueleto
  const renderSkeletonCards = (count: number) => (
    <Stack direction="row" spacing={2} flexWrap="wrap">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} variant="rectangular" width={200} height={120} />
      ))}
    </Stack>
  );

  if (isLoading) {
    return (
      <Stack spacing={2}>
        <PageHeader title="Dashboard de Ventas" />
        {renderSkeletonCards(7)}
      </Stack>
    );
  }

  return (
    <Stack spacing={2}>
      <PageHeader
        title="Dashboard de Ventas"
        buttons={[{ text: "Reporte", onClick: handleGenerateReport }]}
      />

      {/* Sección de métricas principales */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <DashboardCard
          title="Ganancia Mensual"
          amount={stats?.monthlyProfit || 0}
          helperText={`${CURRENT_MONTH} vs ${PREVIOUS_MONTH}: ${stats ? (stats.monthlyProfit - stats.previousMonthProfit > 0 ? "+" : "") + 
            formatMoney(stats.monthlyProfit - stats.previousMonthProfit) : ""}`}
          trend={stats && stats.monthlyProfit > stats.previousMonthProfit ? "up" : "down"}
        />
        <DashboardCard
          title="Total Ventas"
          amount={stats?.totalSales || 0}
          helperText="Mes actual"
        />
        <DashboardCard
          title="Ventas Pagadas"
          amount={stats?.paidSales || 0}
          helperText={`${stats ? Math.round((stats.paidSales / stats.totalSales) * 100) : 0}% del total`}
        />
        <DashboardCard
          title="Ventas Debidas"
          amount={stats?.dueSales || 0}
          helperText={`${stats ? Math.round((stats.dueSales / stats.totalSales) * 100) : 0}% del total`}
          trend="warning"
        />
      </Stack>

      {/* Sección de gráficos */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <Card sx={{ flex: 1, minWidth: 300 }}>
          <CardContent>
            <Typography level="title-md" sx={{ mb: 1 }}>
              Tendencia de Ganancias (últimos 6 meses)
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart
                data={monthlyData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    formatMoney(value), 
                    name === "value" ? "Este año" : "Año anterior"
                  ]}
                />
                <Area
                  name="Este año"
                  type="monotone"
                  dataKey="value"
                  stroke="#1976d2"
                  fill="#1976d2"
                  fillOpacity={0.2}
                />
                <Area
                  name="Año anterior"
                  type="monotone"
                  dataKey="previousValue"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.2}
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
                layout="vertical"
                margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={120} 
                  tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
                />
                <Tooltip 
                  formatter={(value: number, name: string, props: any) => [
                    `${value} unidades (${props.payload.percentage}%)`,
                    "Ventas"
                  ]}
                />
                <Bar dataKey="value" fill="#1976d2" radius={[0, 4, 4, 0]}>
                  {productsData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(210, 70%, ${70 - index * 10}%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Stack>

      {/* Sección de métricas secundarias */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <DashboardCard
          title="Cotizaciones Aprobadas"
          amount={stats?.approvedQuotes || 0}
          trend="up"
        />
        <DashboardCard
          title="Cotizaciones Pendientes"
          amount={stats?.pendingQuotes || 0}
          trend="warning"
        />
        <DashboardCard
          title="Cotizaciones Rechazadas"
          amount={stats?.rejectedQuotes || 0}
          trend="down"
        />
        <DashboardCard
          title="Clientes Destacados"
          amount={stats?.topClients?.length || 0}
          helperText={stats?.topClients?.map(c => c.name).join(", ") || ""}
        />
      </Stack>
    </Stack>
  );
};

export default DashboardSalesPage;