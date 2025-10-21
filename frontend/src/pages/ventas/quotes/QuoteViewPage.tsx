import { useNavigate, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Button, Divider, Grid, IconButton, Sheet, Stack, Table, Typography, Avatar, Card, CardContent, CircularProgress, Chip, Box } from '@mui/joy'
import { ArrowBack } from '@mui/icons-material'
import AxiosInstance from '../../../helpers/AxiosInstance'
import dayjs from 'dayjs'
import { Quote } from '../../../types/sales.types'

const QuoteViewPage = () => {
    const navigate = useNavigate()
    const { id } = useParams({ from: '/_auth/ventas/cotizaciones/ver-cotizacion/$id' })

    // Consulta para obtener la cotización existente
    const { data: quote, isLoading: isLoadingQuote, isError: isErrorQuote } = useQuery<Quote>({
        queryKey: ['quote?', id],
        queryFn: async () => {
            const response = await AxiosInstance.get(`/api/sales/quotes/${id}/`)
            return response.data
        },
        enabled: !!id,
    })


    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    }

    const totalAmount = quote?.details.reduce((sum, item) => {
        return sum + Number(item.quantity) * Number(item.unit_price)
    }, 0) || 0

    const iva = Math.round(totalAmount * 0.19)
    const netAmount = totalAmount - iva

    // Mostrar carga mientras se obtienen los datos
    if (isLoadingQuote ) {
        return (
            <Stack direction="row" justifyContent="center" alignItems="center" sx={{ height: '50vh' }}>
                <CircularProgress />
            </Stack>
        )
    }

    // Mostrar error si hay problemas al cargar la cotización
    if (isErrorQuote) {
        return (
            <Stack spacing={2} alignItems="center" sx={{ height: '50vh' }}>
                <Typography level="h4" color="danger">Error al cargar la cotización</Typography>
                <Button onClick={() => navigate({ to: '/ventas/cotizaciones' })}>
                    Volver al listado
                </Button>
            </Stack>
        )
    }

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
                <IconButton onClick={() => navigate({ to: '/ventas/cotizaciones' })}>
                    <ArrowBack />
                </IconButton>
                <Typography level='h4'>Ver Cotización</Typography>
                <Chip
                    color={getStatusColor(quote?.status || 'PE')}
                    size="sm"
                    sx={{ ml: 'auto' }}
                >
                    {getStatusText(quote?.status || 'PE')}
                </Chip>
            </Stack>

            <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid xs={12} sm={8}>
                    <Sheet variant='outlined' sx={{ p: 2, borderRadius: 'md', flex: 2 }}>
                        <Stack spacing={3}>
                            <Box sx={{ p: 2 }}>
                                <Stack spacing={2}>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography level="body-md">Cliente:</Typography>
                                        <Typography level="body-md" fontWeight='lg'>
                                            {quote?.client ? `${quote?.client.first_name} ${quote?.client.last_name}` : 'Cargando...'}
                                        </Typography>
                                    </Stack>

                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography level="body-md">Fecha de creación:</Typography>
                                        <Typography level="body-md" fontWeight="lg">
                                            {dayjs(quote?.created_at).format('DD/MM/YYYY - HH:mm:ss')}
                                        </Typography>
                                    </Stack>

                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography level="body-md">Número de cotización:</Typography>
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
                                        {quote?.details.map((detail, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{detail.product.name}</td>
                                                    <td>{detail.quantity}</td>
                                                    <td>${detail.unit_price.toLocaleString()}</td>
                                                    <td style={{ textAlign: "center" }}>${(detail.quantity * detail.unit_price).toLocaleString()}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            </Sheet>
                        </Stack>
                    </Sheet>
                </Grid >
                <Grid xs={12} sm={4}>
                    <Stack spacing={2} sx={{ height: '100%' }}>
                        <Sheet
                            variant='outlined'
                            sx={{
                                p: 2,
                                borderRadius: 'md',
                                display: 'flex',
                                flexDirection: 'column',
                                flexGrow: 1,
                                height: '100%'
                            }}
                        >
                            <Stack spacing={2} sx={{ flexGrow: 1 }}>
                                <Typography level='title-md'>Resumen</Typography>
                                <Stack justifyContent={'space-between'} flexDirection={'row'}>
                                    <Typography>Total Neto:</Typography>
                                    <Typography level='title-md'>${netAmount.toLocaleString('es-CL')}</Typography>
                                </Stack>
                                <Stack justifyContent={'space-between'} flexDirection={'row'}>
                                    <Typography>IVA (19%):</Typography>
                                    <Typography level='title-md'>${iva.toLocaleString('es-CL')}</Typography>
                                </Stack>
                                <Divider />
                                <Stack justifyContent={'space-between'} flexDirection={'row'}>
                                    <Typography>Total:</Typography>
                                    <Typography level='title-md'>${totalAmount.toLocaleString('es-CL')}</Typography>
                                </Stack>
                            </Stack>
                        </Sheet>
                        <Sheet
                            variant='outlined'
                            sx={{ p: 2, borderRadius: 'md' }}
                        >
                            <Typography level='title-md' sx={{ mb: 2 }}>Cliente</Typography>
                            {quote?.client ? (
                                <Card variant='outlined' sx={{ p: 2 }}>
                                    <CardContent>
                                        <Stack spacing={2} alignItems='center' direction={'row'}>
                                            <Avatar
                                                size='lg'
                                                variant='soft'
                                                color='primary'
                                                sx={{
                                                    fontSize: '1.2rem',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {getInitials(quote?.client.first_name, quote?.client.last_name)}
                                            </Avatar>
                                            <Stack spacing={1} alignItems={'flex-start'} justifyContent={'center'}>
                                                <Typography level='title-sm' textAlign='center' overflow={'clip'}>
                                                    {quote?.client.first_name} {quote?.client.last_name}
                                                </Typography>
                                                <Typography level='body-sm' textAlign='center' overflow={'clip'}>
                                                    {quote?.client.national_id}
                                                </Typography>
                                                <Typography level='body-sm' textAlign='center' overflow={'clip'}>
                                                    {quote?.client.email}
                                                </Typography>
                                                <Typography level='body-sm' textAlign='center' overflow={'clip'}>
                                                    {quote?.client.phone_number}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Typography level='body-sm' textAlign='center'>
                                    Cargando datos del cliente...
                                </Typography>
                            )}
                        </Sheet>
                    </Stack>
                </Grid>
            </Grid >
        </>
    )
}

export default QuoteViewPage