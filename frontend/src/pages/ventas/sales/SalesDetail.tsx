import { useCallback } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useQuery, useQueries } from '@tanstack/react-query'
import { ArrowBack } from '@mui/icons-material'
import {
    Stack,
    IconButton,
    Typography,
    Sheet,
    Table,
    Chip,
    Divider,
    Box,
    CircularProgress,
    Avatar,
    Card,
    CardContent,
    Grid,
} from '@mui/joy'
import dayjs from 'dayjs'

import { fetchSaleById } from '../../../services/salesService'
import { Sale, SaleDetail, Client } from '../../../types/sales.types'
import { Product } from '../../../types/inventory.types'
import { fetchProduct } from '../../../services/inventoryService'

const SalesDetail = () => {
    const navigate = useNavigate()
    const { id } = useParams({ from: '/_auth/ventas/gestiondeventas/ver-venta/$id' })

    const { data: sale, isLoading: isLoadingSale, error: saleError } = useQuery<Sale>({
        queryKey: ['sale', id],
        queryFn: () => fetchSaleById(id as string),
        enabled: !!id,
    })

    const productQueries = useQueries({
        queries: sale?.details.map((detail: SaleDetail) => ({
            queryKey: ['product', detail.product.id], // Use product.id from sale detail
            queryFn: () => fetchProduct(detail.product.id as string),
            enabled: !!sale && !!detail.product.id,
        })) || [],
    })

    const findProductById = useCallback((productId: string): Product | undefined => {
        const queryResult = productQueries.find(query => query.data?.id === productId)
        return queryResult?.data as Product | undefined
    }, [productQueries])

    const getStatusText = (status?: string) => {
        if (!status) return ''
        switch (status) {
            case 'PE': return 'Pendiente'
            case 'PA': return 'Pagada'
            case 'CA': return 'Cancelada'
            default: return status
        }
    }

    const getStatusColor = (status?: string): 'warning' | 'success' | 'danger' | 'neutral' => {
        if (!status) return 'neutral'
        switch (status) {
            case 'PE': return 'warning'
            case 'PA': return 'success'
            case 'CA': return 'danger'
            default: return 'neutral'
        }
    }

    const getDocumentTypeText = (docType?: string) => {
        if (!docType) return ''
        switch (docType) {
            case 'BOL': return 'Boleta'
            case 'FAC': return 'Factura'
            default: return docType
        }
    }

    const getPaymentMethodText = (method?: string) => {
        if (!method) return ''
        switch (method) {
            case 'EF': return 'Efectivo'
            case 'TC': return 'Tarjeta Crédito'
            case 'TD': return 'Tarjeta Débito'
            case 'TR': return 'Transferencia'
            case 'OT': return 'Otro'
            default: return method
        }
    }

    const getInitials = (firstName?: string, lastName?: string) => {
        if (!firstName || !lastName) return ''
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    }

    if (isLoadingSale) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />
    if (saleError) return <Typography color="danger">Error al cargar la venta: {saleError.message}</Typography>
    if (!sale) return <Typography>Venta no encontrada.</Typography>;

    const client: Client | null = sale.client;

    return (
        <>
            <Stack spacing={1} direction={'row'} justifyContent={'flex-start'} alignItems={'center'} mb={2}>
                <IconButton onClick={() => navigate({ to: '/ventas/gestiondeventas' })}>
                    <ArrowBack />
                </IconButton>
                <Typography level='h4'>Detalle de Venta {sale.folio ? `#${sale.folio}` : ''}</Typography>
                <Chip
                    color={getStatusColor(sale.status)}
                    size="sm"
                    sx={{ ml: 'auto' }}
                >
                    {getStatusText(sale.status)}
                </Chip>
            </Stack>

            <Grid container spacing={2}>
                <Grid xs={12} sm={8}>
                    <Sheet variant="outlined" sx={{ p: 2, borderRadius: "md", flex: 2 }}>
                        <Box sx={{ p: 2 }}>
                            <Stack spacing={2}>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography level="body-md">Nº Venta:</Typography>
                                    <Typography level="body-md" fontWeight="lg">{sale.folio || 'N/A'}</Typography>
                                </Stack>

                                <Stack direction="row" justifyContent="space-between">
                                    <Typography level="body-md">Fecha:</Typography>
                                    <Typography level="body-md" fontWeight="lg">
                                        {dayjs(sale.created_at).format('DD/MM/YYYY HH:mm')}
                                    </Typography>
                                </Stack>

                                <Stack direction="row" justifyContent="space-between">
                                    <Typography level="body-md">Documento:</Typography>
                                    <Typography level="body-md" fontWeight="lg">{getDocumentTypeText(sale.document_type)}</Typography>
                                </Stack>

                                <Stack direction="row" justifyContent="space-between">
                                    <Typography level="body-md">Método Pago:</Typography>
                                    <Typography level="body-md" fontWeight="lg">{getPaymentMethodText(sale.payment_method)}</Typography>
                                </Stack>
                            </Stack>
                        </Box>

                        {/* Detalles de los productos */}
                        <Sheet variant="outlined" sx={{ borderRadius: 'var(--joy-radius-md)', height: '23.77rem', overflow: 'auto', p: 2, mt: 2 }}>
                            <Typography level="title-md" mb={2}>Detalles de Productos</Typography>
                            <Table
                                stickyHeader
                                sx={{
                                    "& thead th": { fontWeight: "lg" },
                                    "& tr > *:not(:first-of-type)": { textAlign: "right" },
                                    "& td": { verticalAlign: "top", paddingTop: "12px", paddingBottom: "12px" },
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th style={{ width: "40%", textAlign: "left" }}>Producto</th>
                                        <th style={{ width: "20%" }}>Cantidad</th>
                                        <th style={{ width: "25%" }}>Precio Unit.</th>
                                        <th style={{ width: "15%", textAlign: "center" }}>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sale.details.map((detail, index) => {
                                        const product = findProductById(detail.product.id);
                                        const isLoadingProduct = productQueries[index]?.isLoading;
                                        const subtotal = detail.quantity * detail.unit_price;
                                        return (
                                            <tr key={detail.id || index}>
                                                <td style={{ textAlign: "left" }}>
                                                    {isLoadingProduct ? (
                                                        <CircularProgress size="sm" />
                                                    ) : product ? (
                                                        product.name
                                                    ) : (
                                                        'Producto no encontrado'
                                                    )}
                                                </td>
                                                <td>{detail.quantity}</td>
                                                <td>${detail.unit_price.toLocaleString()}</td>
                                                <td style={{ textAlign: "center" }}>${subtotal.toLocaleString()}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </Sheet>
                    </Sheet>
                </Grid>
                <Grid xs={12} sm={4} >
                    <Stack spacing={2} sx={{ height: '100%' }}>
                        {/* Resumen de montos */}
                        <Sheet
                            variant="outlined"
                            sx={{ p: 2, borderRadius: "md", flex: 1, display: "flex", flexDirection: "column" }}
                        >
                            <Stack spacing={2} sx={{ flexGrow: 1 }}>
                                <Typography level="title-md">Resumen</Typography>
                                <Stack justifyContent={"space-between"} flexDirection={"row"}>
                                    <Typography>Subtotal Neto:</Typography>
                                    <Typography level='title-md'>${sale.net_amount.toLocaleString()}</Typography>
                                </Stack>
                                <Stack justifyContent={"space-between"} flexDirection={"row"}>
                                    <Typography>IVA (19%):</Typography>
                                    <Typography level='title-md'>${sale.iva.toLocaleString()}</Typography>
                                </Stack>
                                <Divider />
                                <Stack justifyContent={"space-between"} flexDirection={"row"}>
                                    <Typography>Total:</Typography>
                                    <Typography level='title-md'>${sale.total_amount.toLocaleString()}</Typography>
                                </Stack>
                            </Stack>
                        </Sheet>

                        <Sheet
                            variant='outlined'
                            sx={{ p: 2, borderRadius: 'md' }}
                        >
                            {client ? (
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
                                                {getInitials(client.first_name, client.last_name)}
                                            </Avatar>
                                            <Stack spacing={1} alignItems={'flex-start'} justifyContent={'center'}>
                                                <Typography level='title-sm' textAlign='center' overflow={'clip'}>
                                                    {client.first_name} {client.last_name}
                                                </Typography>
                                                <Typography level='body-sm' textAlign='center' overflow={'clip'}>
                                                    {client.national_id}
                                                </Typography>
                                                <Typography level='body-sm' textAlign='center' overflow={'clip'}>
                                                    {client.email}
                                                </Typography>
                                                <Typography level='body-sm' textAlign='center' overflow={'clip'}>
                                                    {client.phone_number}
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Typography level='body-sm' textAlign='center'>
                                    Venta sin cliente asociado.
                                </Typography>
                            )}
                        </Sheet>
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
};

export default SalesDetail