import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { QuoteCreationFormValues, quoteCreationSchema } from '../../../schemas/ventas/cotizaciones/quoteCreationSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useMutation, useQueries, useQuery } from '@tanstack/react-query'
import { createQuote, fetchClientsForSelect, sendQuoteEmail } from '../../../services/saleService'
import { Client } from '../../../types/sales.types'
import AutocompleteFormField, { SelectOption } from '../../../components/core/AutocompleteFormField/AutocompleteFormField'
import { Product } from '../../../types/inventory.types'
import { fetchProducts } from '../../../services/supplierService'
import { Button, Divider, Grid, IconButton, Sheet, Stack, Table, Typography, Avatar, Card, CardContent } from '@mui/joy'
import { Add, ArrowBack, Delete, Send } from '@mui/icons-material'
import FormField from '../../../components/core/FormField/FormField'


const QuoteCreationPage = () => {
    const navigate = useNavigate()

    const {
        handleSubmit,
        control,
        formState: { errors },
        watch,
        setValue,
    } = useForm<QuoteCreationFormValues>({
        resolver: zodResolver(quoteCreationSchema),
        defaultValues: {
            client: '',
            status: 'PE' as const,
            details: [{ product: '', quantity: 0, unit_price: 0 }],
        }
    })

    const { data: clients, isLoading: isLoadingClients } = useQuery({
        queryKey: ['clients'],
        queryFn: ({ queryKey }: { queryKey: unknown[] }) => {
            const searchTerm = queryKey[1] as string | undefined
            if (searchTerm) {
                return fetchClientsForSelect(searchTerm)
            }
            return fetchClientsForSelect('')
        },
        staleTime: Infinity,
    })


    const clientsToOptions = (clients?: Client[]): SelectOption[] => {
        return (
            clients?.map((client) => ({
                value: client.id,
                label: client.first_name + ' ' + client.last_name,
            })) ?? []
        )
    }

    const clientsOptions = clientsToOptions(clients?.results)

    const selectedClient = clients?.results.find((client: Client) => client.id === watch('client'))

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    }

    const details = watch('details') || []

    // Estado para almacenar los términos de búsqueda de productos para cada detalle
    const [productSearchTerms, setProductSearchTerms] = useState<string[]>(Array(details.length).fill(''))
    
    // Actualizar el array de términos de búsqueda cuando cambia el número de detalles
    useEffect(() => {
        if (productSearchTerms.length !== details.length) {
            setProductSearchTerms(prev => {
                if (prev.length < details.length) {
                    // Agregar términos vacíos para los nuevos detalles
                    return [...prev, ...Array(details.length - prev.length).fill('')]
                } else {
                    // Eliminar términos para los detalles eliminados
                    return prev.slice(0, details.length)
                }
            })
        }
    }, [details.length, productSearchTerms.length])

    const productQueries = useQueries({
        queries: details.map((_, index) => ({
            queryKey: ['products', index, productSearchTerms[index]],
            queryFn: ({ queryKey }: { queryKey: unknown[] }) => {
                // Usar el término de búsqueda almacenado en el estado
                return fetchProducts(productSearchTerms[index] || '')
            },
            staleTime: 1000 * 60 * 2,
        })),
    })

    const productsToOptions = (productss?: Product[]): SelectOption[] => {
        return (
            productss?.map((products) => ({
                value: products.id,
                label: products.name,
            })) ?? []
        )
    }

    // Función para encontrar un producto por su ID usando los resultados de las consultas
    const findProductById = (productId: string): Product | undefined => {
        for (const query of productQueries) {
            if (query.data?.results) {
                const product = query.data.results.find((product) => product.id === productId)
                if (product) return product
            }
        }
        return undefined
    }

    // Efecto para actualizar precios cuando cambian los productos seleccionados
    useEffect(() => {
        const currentFindProductById = findProductById
        details.forEach((detail, index) => {
            if (detail.product) {
                const selectedProduct = currentFindProductById(detail.product)
                if (selectedProduct && selectedProduct.price_clp) {
                    // Actualizar el precio unitario con el precio del producto
                    // Check if the current unit_price is different before setting to avoid infinite loops if not careful
                    if (watch(`details.${index}.unit_price`) !== selectedProduct.price_clp) {
                        setValue(`details.${index}.unit_price`, selectedProduct.price_clp)
                    }
                }
            } else {

                setValue(`details.${index}.unit_price`, 0)
            }
        })
    }, [details, setValue, watch, findProductById]) // Adjusted dependencies for robustness

    const mutation = useMutation({
        mutationFn: createQuote,
        onSuccess: () => {
            alert('Cotización creada con éxito!')
            navigate({ to: '/ventas/cotizaciones' })
        },
        onError: (error) => {
            console.error(error)
            alert(`Error: ${error instanceof Error ? error.message : 'Ocurrió un error'}`)
        },
    })

    const sendEmailMutation = useMutation({
        mutationFn: sendQuoteEmail,
        onSuccess: () => {
            alert('Cotización creada y enviada con éxito!')
            navigate({ to: '/ventas/cotizaciones' })
        },
        onError: (error) => {
            console.error(error)
            alert(`Error al enviar el email: ${error instanceof Error ? error.message : 'Ocurrió un error'}`)
        },
    })

    const onSubmit: SubmitHandler<QuoteCreationFormValues> = (data) => {
        console.log(data)
        mutation.mutate(data)
    }

    const handleSaveAndSend: SubmitHandler<QuoteCreationFormValues> = (data) => {
        console.log(data)
        mutation.mutate(data, {
            onSuccess: (newQuote) => {
                // Enviar email después de crear la cotización
                sendEmailMutation.mutate(newQuote.id)
            }
        })
    }
    
    // Agregar nuevo detalle
    const addDetail = () => {
        setValue('details', [...watch('details'), { product: '', quantity: 1, unit_price: 0 }])
        // Agregar un término de búsqueda vacío para el nuevo detalle
        setProductSearchTerms([...productSearchTerms, ''])
    }

    // Eliminar detalle
    const removeDetail = (index: number) => {
        const currentDetails = [...watch('details')]
        currentDetails.splice(index, 1)
        setValue('details', currentDetails)
        
        // Eliminar el término de búsqueda correspondiente
        const newSearchTerms = [...productSearchTerms]
        newSearchTerms.splice(index, 1)
        setProductSearchTerms(newSearchTerms)
    }

    // Manejar cambio de producto
    const handleProductChange = (index: number, productId: string | null) => {
        // Allow null for type safety
        if (productId) {
            const selectedProduct = findProductById(productId)
            if (selectedProduct && typeof selectedProduct.price_clp === 'number') {
                setValue(`details.${index}.unit_price`, selectedProduct.price_clp)
            } else {
                setValue(`details.${index}.unit_price`, 0) // Reset if product has no price
            }
        } else {
            setValue(`details.${index}.unit_price`, 0) // Reset if product is deselected
        }
    }

    const totalAmount = details.reduce((sum, item) => {
        return sum + Number(item.quantity) * Number(item.unit_price)
    }, 0)

    const iva = Math.round(totalAmount * 0.19)
    const netAmount = totalAmount - iva


    return (
        <>
            <Stack spacing={1} direction={'row'} justifyContent={'flex-start'} alignItems={'center'}>
                <IconButton onClick={() => navigate({ to: '/ventas/cotizaciones' })}>
                    <ArrowBack />
                </IconButton>
                <Typography level='h4'>Nueva Cotización</Typography>
            </Stack>

            <form onSubmit={handleSubmit(onSubmit)}>

                <Grid container spacing={2}>
                    <Grid xs={12} sm={8}>
                        <Sheet variant='outlined' sx={{ p: 2, borderRadius: 'md', flex: 2 }}>
                            <Stack spacing={3}>
                                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                    <AutocompleteFormField
                                        label='Cliente'
                                        placeholder='Buscar cliente'
                                        control={control}
                                        name='client'
                                        fullWidth={true}
                                        options={clientsOptions}
                                        loading={isLoadingClients}
                                        error={errors?.client}
                                        freeSolo={false}
                                    />
                                    <AutocompleteFormField
                                        name='status'
                                        control={control}
                                        label='Estado'
                                        options={[
                                            { value: 'PE', label: 'Pendiente' },
                                            { value: 'AP', label: 'Aprobado' },
                                            { value: 'RE', label: 'Rechazado' },
                                        ]}
                                        error={errors.status}
                                        fullWidth={true}
                                    />
                                </Stack>
                                <Grid container sx={{ flexGrow: 1 }}>
                                    {/* Columna Izquierda: Detalles de la orden (Tabla) */}
                                    <Grid xs={12}>
                                        <Stack spacing={2}>
                                            <Typography level='title-md'>Detalles de la Orden</Typography>
                                            <Sheet variant='outlined' sx={{
                                                borderRadius: 'var(--joy-radius-md)',
                                                height: '23.77rem',
                                                overflow: 'auto',
                                            }}
                                            >
                                                <Table
                                                    stickyHeader // Makes header sticky if table scrolls
                                                    sx={{
                                                        '& thead th': { fontWeight: 'lg' },
                                                        '& tr > *:not(:first-of-type)': { textAlign: 'right' },
                                                        '& td': { verticalAlign: 'top', paddingTop: '12px', paddingBottom: '12px' }, // Adjust padding for FormControls
                                                    }}
                                                >
                                                    <thead>
                                                        <tr>
                                                            <th style={{ width: '40%', textAlign: 'left' }}>Producto</th>
                                                            <th style={{ width: '20%' }}>Cantidad</th>
                                                            <th style={{ width: '25%' }}>Precio Unitario</th>
                                                            <th style={{ width: '15%', textAlign: 'center' }}>Acciones</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody >
                                                        {details.map((_, index) => {
                                                            // Obtener el estado de la consulta para este índice
                                                            const productQuery = productQueries[index] || {}
                                                            const { data: productsData, isLoading: isProductsLoading } = productQuery

                                                            // Convertir productos a opciones para este autocomplete específico
                                                            const currentProductOptions = productsToOptions(productsData?.results)

                                                            return (
                                                                <tr key={index}>
                                                                    <td>
                                                                        <AutocompleteFormField
                                                                            name={`details.${index}.product`}
                                                                            control={control}
                                                                            options={currentProductOptions}
                                                                            error={errors.details?.[index]?.product}
                                                                            onChange={(value) => handleProductChange(index, value as string)}
                                                                            placeholder='Buscar producto'
                                                                            size='sm'
                                                                            loading={isProductsLoading}
                                                                            freeSolo={false}
                                                                            onInputChange={(_, value) => {
                                                                                // Actualizar el término de búsqueda para este índice
                                                                                const newSearchTerms = [...productSearchTerms]
                                                                                newSearchTerms[index] = value
                                                                                setProductSearchTerms(newSearchTerms)
                                                                                
                                                                                if (value && value.length > 2) {
                                                                                    // Refetch con el término de búsqueda
                                                                                    productQueries[index].refetch()
                                                                                }
                                                                            }}
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <FormField
                                                                            name={`details.${index}.quantity`}
                                                                            control={control}
                                                                            type='number'
                                                                            error={errors.details?.[index]?.quantity}
                                                                            transform={Number}
                                                                            size='sm'
                                                                        />
                                                                    </td>
                                                                    <td>
                                                                        <FormField
                                                                            name={`details.${index}.unit_price`}
                                                                            control={control}
                                                                            type='number'
                                                                            error={errors.details?.[index]?.unit_price}
                                                                            transform={Number}
                                                                            disabled={!!watch(`details.${index}.product`)} // Disable if product is selected
                                                                            size='sm'
                                                                        />
                                                                    </td>
                                                                    <td style={{ textAlign: 'center' }}>
                                                                        <IconButton
                                                                            variant='plain'
                                                                            color='danger'
                                                                            size='sm'
                                                                            onClick={() => removeDetail(index)}
                                                                            disabled={details.length <= 1} // Disable if only one item
                                                                        >
                                                                            <Delete />
                                                                        </IconButton>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </Table>
                                            </Sheet>
                                            <Button
                                                variant='soft'
                                                color='primary'
                                                onClick={addDetail}
                                                startDecorator={<Add />}
                                                sx={{ alignSelf: 'flex-start', mt: 1 }}
                                            >
                                                Agregar Item
                                            </Button>

                                            {errors.details?.root && (
                                                <Typography color='danger' level='body-sm' sx={{ mt: 1 }}>
                                                    {errors.details.root.message}
                                                </Typography>
                                            )}
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Stack>
                        </Sheet>
                    </Grid>
                    <Grid xs={12} sm={4} >
                        <Stack spacing={2} sx={{ height: '100%' }}>
                            {/* Sheet de Resumen */}
                            <Sheet
                                variant='outlined'
                                sx={{
                                    p: 2,
                                    borderRadius: 'md',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    flexGrow: 1, // Permite que crezca para ocupar el espacio disponible
                                    height: '100%'
                                }}
                            >
                                <Stack spacing={2} sx={{ flexGrow: 1 }}>
                                    <Typography level='title-md'>Resumen</Typography>
                                    <Stack justifyContent={'space-between'} flexDirection={'row'}>
                                        <Typography>Total Neto:</Typography>
                                        <Typography level='title-md'>{netAmount.toLocaleString('es-CL')}</Typography>
                                    </Stack>
                                    <Stack justifyContent={'space-between'} flexDirection={'row'}>
                                        <Typography>IVA (19%):</Typography>
                                        <Typography level='title-md'>{iva.toLocaleString('es-CL')}</Typography>
                                    </Stack>
                                    <Divider />
                                    <Stack justifyContent={'space-between'} flexDirection={'row'}>
                                        <Typography>Total:</Typography>
                                        <Typography level='title-md'>{totalAmount.toLocaleString('es-CL')}</Typography>
                                    </Stack>
                                </Stack>
                                <Stack
                                    spacing={1}
                                    direction={'column'}
                                    sx={{
                                        mt: 'auto',
                                    }}
                                >
                                    <Button
                                        onClick={handleSubmit(handleSaveAndSend)}
                                        fullWidth
                                        size='md'
                                        sx={{ mt: 'auto' }}
                                        startDecorator={<Send />}
                                        loading={mutation.isPending || sendEmailMutation.isPending}
                                        disabled={mutation.isPending || sendEmailMutation.isPending}
                                    >
                                        Guardar y Enviar Cotización
                                    </Button>
                                    <Button
                                        type='submit'
                                        fullWidth
                                        size='md'
                                        color='neutral'
                                        variant='outlined'
                                        sx={{ mt: 'auto' }}
                                        loading={mutation.isPending}
                                        disabled={mutation.isPending || sendEmailMutation.isPending}
                                    >
                                        Guardar Cotización
                                    </Button>
                                </Stack>
                            </Sheet>
                            <Sheet
                                variant='outlined'
                                sx={{ p: 2, borderRadius: 'md' }}
                            >
                                <Typography level='title-md' sx={{ mb: 2 }}>Cliente</Typography>
                                {selectedClient ? (
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
                                                    {getInitials(selectedClient.first_name, selectedClient.last_name)}
                                                </Avatar>
                                                <Stack spacing={1} alignItems={'flex-start'} justifyContent={'center'}>
                                                    <Typography level='title-sm' textAlign='center' overflow={'clip'}>
                                                        {selectedClient.first_name} {selectedClient.last_name}
                                                    </Typography>
                                                    <Typography level='body-sm' textAlign='center' overflow={'clip'}>
                                                        {selectedClient.national_id}
                                                    </Typography>
                                                    <Typography level='body-sm' textAlign='center' overflow={'clip'}>
                                                        {selectedClient.email}
                                                    </Typography>
                                                    <Typography level='body-sm' textAlign='center' overflow={'clip'}>
                                                        {selectedClient.phone_number}
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <Typography level='body-sm' textAlign='center'>
                                        Seleccione un cliente para ver sus datos
                                    </Typography>
                                )}
                            </Sheet>
                        </Stack>
                    </Grid>
                </Grid>
            </form>
        </>
    )
}

export default QuoteCreationPage