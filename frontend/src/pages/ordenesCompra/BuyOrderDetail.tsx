import { ArrowBack } from '@mui/icons-material'
import { Button, Card, Chip, IconButton, Stack, Typography, Table } from '@mui/joy'
import { useQuery } from '@tanstack/react-query'
import { fetchBuyOrderById } from '../../services/supplierService'
import { useNavigate, useParams } from '@tanstack/react-router'
import { BuyOrder } from '../../types/proveedores.types'
import dayjs from 'dayjs'


const BuyOrderDetail = () => {
  const { id } = useParams({ from: '/_auth/proveedores/ver-ordenes-de-compra/$id' })
  const navigate = useNavigate()

  const { data: buyOrder, isLoading, isError } = useQuery<BuyOrder>({
    queryKey: ['buyOrder', id],
    queryFn: () => fetchBuyOrderById(id)
  })

  if (isLoading) return <div>Cargando...</div>
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

      <Stack spacing={3} mt={3}>
        {/* Información general de la orden */}
        <Card variant="outlined">
          <Stack spacing={2}>
            <Stack direction="row" justifyContent="space-between">
              <Typography level="body-sm">Proveedor:</Typography>
              <Typography level="body-sm" fontWeight="lg">{buyOrder.supplier}</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography level="body-sm">Fecha de creación:</Typography>
              <Typography level="body-sm" fontWeight="lg">
                {dayjs(buyOrder.created_at).format('DD/MM/YYYY - HH:mm:ss')}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography level="body-sm">Número de orden:</Typography>
              <Typography level="body-sm" fontWeight="lg">{id}</Typography>
            </Stack>
          </Stack>
        </Card>

        {/* Detalles de los productos */}
        <Card variant="outlined">
          <Typography level="title-sm" mb={2}>Productos</Typography>
          
          <Table hoverRow>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {buyOrder.details.map((detail, index: number) => (
                <tr key={index}>
                  <td>{detail.product}</td>
                  <td>{detail.quantity}</td>
                  <td>${detail.unit_price.toLocaleString()}</td>
                  <td>${(detail.quantity * detail.unit_price).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>

        {/* Resumen de montos */}
        <Card variant="soft">
          <Typography level="title-sm" mb={1}>Resumen</Typography>
          <Stack direction="row" spacing={3}>
            <Stack>
              <Typography level="body-sm">Neto:</Typography>
              <Typography level="title-lg">${buyOrder.net_amount.toLocaleString()}</Typography>
            </Stack>
            <Stack>
              <Typography level="body-sm">IVA (19%):</Typography>
              <Typography level="title-lg">${buyOrder.iva.toLocaleString()}</Typography>
            </Stack>
            <Stack>
              <Typography level="body-sm">Total:</Typography>
              <Typography level="title-lg">${buyOrder.total_amount.toLocaleString()}</Typography>
            </Stack>
          </Stack>
        </Card>

        {/* Acciones */}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={() => navigate({ to: '/proveedores/ordenes-de-compra' })}
          >
            Volver
          </Button>
          {buyOrder.status === 'PE' && (
            <>
              <Button color="success">Aprobar</Button>
              <Button color="danger">Rechazar</Button>
            </>
          )}
        </Stack>
      </Stack>
    </>
  )
}

export default BuyOrderDetail