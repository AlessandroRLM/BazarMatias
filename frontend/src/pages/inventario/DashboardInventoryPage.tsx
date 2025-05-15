<<<<<<< HEAD
import PageHeader from "../../components/core/PageHeader/PageHeader"
import DashboardCard from "../../components/core/DashboardCard/DashboardCard"
import PackageOutlined from "../../assets/PackageOutlined"
import DashboardResponsiveDiv from "../../components/core/DashboardResponsiveDiv/DashboardResponsiveDiv"

=======
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
>>>>>>> cadc7547b88a97efd15709e6e5c7fbec1830b295

const DashboardInventoryPage = () => {
  const { data } = useSuspenseQuery(inventoryMetricsQueryOptions())

  return (
    <>
      <PageHeader
<<<<<<< HEAD
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
=======
        title="Dashboard de Inventario"
        buttons={[{ text: "Reporte" }]}
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
>>>>>>> cadc7547b88a97efd15709e6e5c7fbec1830b295
    </>
  )
}
export default DashboardInventoryPage
