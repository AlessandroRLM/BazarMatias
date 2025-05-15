import { Table } from "@mui/joy"

type Shrinkage = {
  product_name: string
  quantity: number
  reason: string
  created_at: string | null
}

const RecentShrinkagesTable = ({
  shrinkages,
}: {
  shrinkages: Shrinkage[]
}) => {
  if (!shrinkages?.length) return null

  return (
    <Table
      size="sm"
      variant="outlined"
      sx={{ minWidth: 300, maxHeight: 300, overflow: "auto" }}
    >
      <thead>
        <tr>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Motivo</th>
          <th>Fecha</th>
        </tr>
      </thead>
      <tbody>
        {shrinkages.map((s, i) => (
          <tr key={i}>
            <td>{s.product_name}</td>
            <td>{s.quantity}</td>
            <td>{s.reason}</td>
            <td>
              {s.created_at
                ? new Date(s.created_at).toLocaleDateString()
                : "–"}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default RecentShrinkagesTable
