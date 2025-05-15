import { Card, CardContent, Typography } from "@mui/joy";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";

type LowStockItem = {
  product: string;
  stock: number;
};

const LowStockProductsChart = ({ data }: { data: LowStockItem[] }) => {
  if (!data?.length) return null;

  return (
    <Card sx={{ flex: 1, minWidth: 400, minHeight: 300 }}>
      <CardContent>
        <Typography level="title-md" mb={1}>
          Productos con Bajo Stock
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            layout="vertical"
            data={data}
            margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              dataKey="product"
              type="category"
              width={120}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) => [`${value} unidades`, "Stock"]}
              labelFormatter={(label) => `Producto: ${label}`}
            />
            <Bar dataKey="stock" fill="#f57c00">
              <LabelList dataKey="stock" position="right" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default LowStockProductsChart;
