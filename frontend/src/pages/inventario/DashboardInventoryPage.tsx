import { Stack, Box } from "@mui/joy"
import PageHeader from "../../components/core/PageHeader/PageHeader"
import DashboardCard from "../../components/core/DashboardCard/DashboardCard"
import {
  Inventory2Outlined,
  ShoppingBagOutlined,
  WarningAmberOutlined,
} from "@mui/icons-material"
import { useSuspenseQuery } from "@tanstack/react-query"
import { inventoryMetricsQueryOptions } from "../../utils/inventory/inventoryQueryOptions"
import LowStockProductsChart from "../../components/inventory/LowStockProductsChart"
import RecentShrinkagesTable from "../../components/inventory/RecentShrinkagesTable"
import { downloadInventoryReportPDF } from "../../services/reportsService";

const handleDownloadInventoryReport = async () => {
  try {
    const blob = await downloadInventoryReportPDF();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Reporte-Inventario.pdf";
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error al descargar el reporte de inventario:", error);
  }
};

const DashboardInventoryPage = () => {
  const { data } = useSuspenseQuery(inventoryMetricsQueryOptions())

  return (
    <>
      <PageHeader
        title="Dashboard de Inventario"
        buttons={[{ text: "Reporte", onClick: handleDownloadInventoryReport }]}
      />

      <Stack
        direction="row"
        alignItems="center"
        sx={(theme) => ({
          gap: 1,
          flexWrap: "wrap",
          [theme.breakpoints.up("sm")]: {
            flexWrap: "nowrap",
          },
        })}
      >
        <DashboardCard
          title="Total de Productos"
          amount={data?.amount_products}
          icon={<ShoppingBagOutlined />}
        />
        <DashboardCard
          title="Total de Insumos"
          amount={data?.amount_supplies}
          icon={<Inventory2Outlined />}
        />
        <DashboardCard
          title="Total de Mermas"
          amount={data?.amount_shrinkages}
          icon={<WarningAmberOutlined />}
        />
        <DashboardCard
          title="Productos con Bajo Stock"
          amount={data?.low_stock_products_count}
          icon={<WarningAmberOutlined color="warning" />}
        />
      </Stack>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems="stretch"
        spacing={2}
        sx={{ mt: 2 }}
      >
        <Box sx={{ flex: 1, minWidth: 400 }}>
          <RecentShrinkagesTable shrinkages={data?.recent_shrinkages} />
        </Box>
        <Box sx={{ flex: 1, minWidth: 400 }}>
          <LowStockProductsChart data={data?.low_stock_chart_data} />
        </Box>
      </Stack>
    </>
  )
}
export default DashboardInventoryPage
