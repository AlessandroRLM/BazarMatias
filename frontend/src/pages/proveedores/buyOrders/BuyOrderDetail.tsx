import { ArrowBack } from '@mui/icons-material'
import { Chip, IconButton, Stack, Typography, Table, CircularProgress, Sheet, Divider, Box } from '@mui/joy'
import { useQuery, useQueries } from '@tanstack/react-query'
import { fetchBuyOrderById } from '../../../services/supplierService'
import { useNavigate, useParams } from '@tanstack/react-router'
import { BuyOrder } from '../../../types/proveedores.types'
import dayjs from 'dayjs'
import { fetchProduct } from '../../../services/inventoryService'
import { Product } from '../../../types/inventory.types'

const BuyOrderDetail = () => {
  const { id } = useParams({ from: '/_auth/proveedores/ver-ordenes-de-compra/$id' })
  const navigate = useNavigate()

  const { data: buyOrder, isError } = useQuery<BuyOrder>({
    queryKey: ['buyOrder', id],
    queryFn: () => fetchBuyOrderById(id)
  })

  // Usar useQueries para crear una consulta independiente para cada detalle de producto
  const productQueries = useQueries({
    queries: buyOrder?.details.map((detail) => ({
      queryKey: ['product', detail.product],
      queryFn: () => fetchProduct(detail.product),
      enabled: !!buyOrder,
    })) || [],
  })

  // Función para encontrar un producto por su ID usando los resultados de las consultas
  const findProductById = (productId: string): Product | undefined => {

    let foundIndex = -1;
    buyOrder?.details.forEach((detail, idx) => {
      if (detail.product === productId) {
        foundIndex = idx;
      }
    });

    if (foundIndex !== -1 && productQueries[foundIndex]?.data) {
      console.log(`productQueries[${foundIndex}].data`, productQueries[foundIndex].data)
      return productQueries[foundIndex].data
    }

    if (foundIndex === -1) {
      buyOrder?.details.forEach((detail, idx) => {
        if (detail.product.trim() === productId.trim()) {
          foundIndex = idx;
        }
      });

      if (foundIndex !== -1 && productQueries[foundIndex]?.data) {
        return productQueries[foundIndex].data
      }
    }

    return undefined
  }

  if (isError) return <div>Error al cargar la orden de compra</div>
  if (!buyOrder) return <div>Orden no encontrada</div>

  // Función para obtener el texto del estado
  const getStatusText = (status: string) => {
    switch (status) {
      case 'PE': return 'Pendiente'
      case 'AP': return 'Aprobado'
      case 'RE': return 'Rechazado'
      default: return status
    }
  }

  // Función para obtener el color del chip según el estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PE': return 'warning'
      case 'AP': return 'success'
      case 'RE': return 'danger'
      default: return 'neutral'
    }
  }

  return (
    <>
      <Stack spacing={1} direction={'row'} justifyContent={'flex-start'} alignItems={'center'}>
        <IconButton onClick={() => navigate({ to: '/proveedores/ordenes-de-compra' })}>
          <ArrowBack />
        </IconButton>
        <Typography level="h4">Detalle de Orden de Compra</Typography>
        <Chip
          color={getStatusColor(buyOrder.status)}
          size="sm"
          sx={{ ml: 'auto' }}
        >
          {getStatusText(buyOrder.status)}
        </Chip>
      </Stack>

      <Stack spacing={2} direction={{ xs: "column", md: "row" }}>
        <Sheet variant="outlined" sx={{ p: 2, borderRadius: "md", flex: 2 }}>
          <Box sx={{p: 2}}>
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between">
                <Typography level="body-md">Proveedor:</Typography>
                <Typography level="body-md" fontWeight="lg">{buyOrder.supplier}</Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography level="body-md">Fecha de creación:</Typography>
                <Typography level="body-md" fontWeight="lg">
                  {dayjs(buyOrder.created_at).format('DD/MM/YYYY - HH:mm:ss')}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography level="body-md">Número de orden:</Typography>
                <Typography level="body-md" fontWeight="lg">{id}</Typography>
              </Stack>
            </Stack>
          </Box>

          {/* Detalles de los productos */}
          <Sheet variant="outlined" sx={{ borderRadius: 'var(--joy-radius-md)', height: '23.77rem', overflow: 'auto', p: 2, mt: 2 }}>
            <Typography level="title-md" mb={2}>Detalles de la Orden</Typography>
            <Table stickyHeader sx={{
              "& thead th": { fontWeight: "lg" },
              "& tr > *:not(:first-of-type)": { textAlign: "right" },
              "& td": { verticalAlign: "top", paddingTop: "12px", paddingBottom: "12px" },
            }}>
              <thead>
                <tr>
                  <th style={{ width: "40%", textAlign: "left" }}>Producto</th>
                  <th style={{ width: "20%" }}>Cantidad</th>
                  <th style={{ width: "25%" }}>Precio Unitario</th>
                  <th style={{ width: "15%", textAlign: "center" }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {buyOrder.details.map((detail, index) => {
                  const product = findProductById(detail.product)
                  const isLoading = productQueries[index]?.isLoading
                  return (
                    <tr key={index}>
                      <td>
                        {isLoading ? (
                          <CircularProgress size="sm" />
                        ) : product ? (
                          product.name
                        ) : (
                          'Producto no encontrado'
                        )}
                      </td>
                      <td>{detail.quantity}</td>
                      <td>${detail.unit_price.toLocaleString()}</td>
                      <td style={{ textAlign: "center" }}>${(detail.quantity * detail.unit_price).toLocaleString()}</td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          </Sheet>
        </Sheet>
          {/* Resumen de montos */}
          <Sheet
            variant="outlined"
            sx={{ p: 2, borderRadius: "md", flex: 1, display: "flex", flexDirection: "column" }}
          >
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
              <Typography level="title-md">Resumen</Typography>
              <Stack justifyContent={"space-between"} flexDirection={"row"}>
                <Typography>Total Neto:</Typography>
                <Typography level='title-md'>${buyOrder.net_amount.toLocaleString()}</Typography>
              </Stack>
              <Stack justifyContent={"space-between"} flexDirection={"row"}>
                <Typography>IVA (19%):</Typography>
                <Typography level='title-md'>${buyOrder.iva.toLocaleString()}</Typography>
              </Stack>
              <Divider />
              <Stack justifyContent={"space-between"} flexDirection={"row"}>
                <Typography>Total:</Typography>
                <Typography level='title-md'>${buyOrder.total_amount.toLocaleString()}</Typography>
              </Stack>
            </Stack>
          </Sheet>
      </Stack>
    </>
  )
}

export default BuyOrderDetail