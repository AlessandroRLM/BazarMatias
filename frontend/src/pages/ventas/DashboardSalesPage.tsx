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
  fetchSales,
  fetchQuotes
} from "../../services/salesService";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { es } from "date-fns/locale";
import toast from "react-hot-toast";
import { downloadSalesReportPDF } from "../../services/reportsService";
// Importar iconos de Material-UI
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import PeopleIcon from '@mui/icons-material/People';

export interface DashboardStats {
  monthly_profit: number;
  previous_month_profit: number;
  total_sales: number;
  paid_sales: number;
  due_sales: number;
  approved_quotes: number;
  pending_quotes: number;
  rejected_quotes: number;
  top_clients: { name: string; value: number }[];
}

interface MonthlyProfitData {
  name: string;
  value: number;
  previousValue?: number;
}

interface TopProductsData {
  name: string;
  value: number;
  percentage?: number;
}

const CURRENT_MONTH = format(new Date(), "MMMM", { locale: es });
const PREVIOUS_MONTH = format(subMonths(new Date(), 1), "MMMM", { locale: es });

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    minimumFractionDigits: 0,
  }).format(amount);
};

const DashboardSalesPage = () => {
  const queryClient = useQueryClient();
  const currentDate = new Date();
  const currentMonthStart = startOfMonth(currentDate).toISOString().split("T")[0];
  const currentMonthEnd = endOfMonth(currentDate).toISOString().split("T")[0];

  const { data: stats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
  });

  const { data: monthlyData, isLoading: monthlyDataLoading } = useQuery<MonthlyProfitData[]>({
    queryKey: ["monthly-profit-data"],
    queryFn: fetchMonthlyProfitData,
  });

  const { data: productsData, isLoading: productsDataLoading } = useQuery<TopProductsData[]>({
    queryKey: ["top-products-data"],
    queryFn: fetchTopProductsData,
  });

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

const handleGenerateReport = async () => {
  try {
    const blob = await downloadSalesReportPDF();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Reporte-Ventas-${new Date().toISOString().split('T')[0]}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Reporte de ventas descargado correctamente');
  } catch (error) {
    console.error('Error al descargar el reporte de ventas:', error);
    toast.error('Hubo un error al generar el reporte de ventas');
  }
};

  const isLoading = statsLoading || monthlyDataLoading || productsDataLoading;

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
        buttons={[
          { 
            text: "Descargar Reporte", 
            onClick: handleGenerateReport,
          }
        ]}
      />

      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <DashboardCard
          title="Ganancia Mensual"
          amount={stats?.monthly_profit || 0}
          helperText={`${CURRENT_MONTH} vs ${PREVIOUS_MONTH}: ${stats ? (stats.monthly_profit - stats.previous_month_profit > 0 ? "+" : "") + 
            formatMoney(stats.monthly_profit - stats.previous_month_profit) : ""}`}
          icon={<TrendingUpIcon />}
        />
        <DashboardCard
          title="Total Ventas"
          amount={stats?.total_sales || 0}
          helperText="Mes actual"
          icon={<ShoppingCartIcon />}
        />
        <DashboardCard
          title="Ventas Pagadas"
          amount={stats?.paid_sales || 0}
          helperText={`${stats ? Math.round((stats.paid_sales / stats.total_sales) * 100) : 0}% del total`}
          icon={<PaymentIcon />}
        />
        <DashboardCard
          title="Ventas Debidas"
          amount={stats?.due_sales || 0}
          helperText={`${stats ? Math.round((stats.due_sales / stats.total_sales) * 100) : 0}% del total`}
          icon={<ErrorOutlineIcon />}
        />
      </Stack>

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
                  formatter={(value: number) => [formatMoney(value), "Valor"]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#1976d2"
                  fill="#1976d2"
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
                />
                <Tooltip 
                  formatter={(value: number) => [`${value} unidades`, "Ventas"]}
                />
                <Bar dataKey="value" fill="#1976d2" radius={[0, 4, 4, 0]}>
                  {productsData?.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(210, 70%, ${70 - index * 10}%)`} />
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
          amount={stats?.approved_quotes || 0}
          icon={<CheckCircleOutlineIcon />}
        />
        <DashboardCard
          title="Cotizaciones Pendientes"
          amount={stats?.pending_quotes || 0}
          icon={<AccessTimeIcon />}
        />
        <DashboardCard
          title="Cotizaciones Rechazadas"
          amount={stats?.rejected_quotes || 0}
          icon={<CancelOutlinedIcon />}
        />
        <DashboardCard
          title="Clientes Destacados"
          amount={stats?.top_clients?.length || 0}
          helperText={stats?.top_clients?.map(c => c.name).join(", ") || ""}
          icon={<PeopleIcon />}
        />
      </Stack>
    </Stack>
  );
};

export default DashboardSalesPage;