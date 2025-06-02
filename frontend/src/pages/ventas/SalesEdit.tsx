import { useCallback, useEffect, useMemo } from "react"
import { useNavigate, useParams } from "@tanstack/react-router" 
import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { useMutation, useQueries, useQuery } from "@tanstack/react-query"
import { ArrowBack, Delete, Add, Edit } from "@mui/icons-material" 
import { Stack, IconButton, Typography, Grid, Sheet, Table, Button, Divider, Card, CardContent, Avatar, Input, FormControl, FormLabel, CircularProgress } from "@mui/joy"
import dayjs from "dayjs"

import { SaleCreationFormValues, saleCreationSchema } from "../../schemas/ventas/ventas/saleCreationSchema" 
import { fetchClientsForSelect } from "../../services/saleService"
import { Client, Sale, SaleDetail } from "../../types/sales.types" 
import AutocompleteFormField, { SelectOption } from "../../components/core/AutocompleteFormField/AutocompleteFormField"
import { Product } from "../../types/inventory.types"
import { fetchProducts } from "../../services/supplierService"
import { fetchSaleById, updateSale } from "../../services/salesService" 
import FormField from "../../components/core/FormField/FormField"
import FormSelect from "../../components/core/FormSelect/FormSelect"

const SalesEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams({ from: '/_auth/ventas/gestiondeventas/editar-venta/$id' }) 

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    reset, 
  } = useForm<SaleCreationFormValues>({
    resolver: zodResolver(saleCreationSchema), 
    defaultValues: {
      client_id: '',
      document_type: 'BOL' as const,
      payment_method: undefined,
      status: undefined,
      details: [{ product_id: '', quantity: 1, unit_price: 0 }],
      // folio: undefined, // Add folio to defaultValues if it's part of the form
    }
  })

  // Fetch existing sale data
  const { data: existingSale, isLoading: isLoadingSale, error: saleError } = useQuery<Sale>({
    queryKey: ['sale', id],
    queryFn: () => fetchSaleById(id as string),
    enabled: !!id, 
  })

  useEffect(() => {
    if (existingSale) {
      reset({
        client_id: existingSale?.client?.id, // Correctly access client ID
        document_type: existingSale.document_type as 'BOL' | 'FAC',
        payment_method: existingSale.payment_method,
        status: existingSale.status as 'PE' | 'PA' | 'CA', // Add type assertion for status
        details: existingSale.details.map((d: SaleDetail) => ({ // Use SaleDetail type
          product_id: d.product.id, // Correctly access product ID from nested product object
          quantity: d.quantity,
          unit_price: d.unit_price,
        })),
      });
    }
  }, [existingSale, reset])

  // const folio = watch('folio') // If folio is managed by react-hook-form
  // If folio is not part of the form state, you can get it directly from existingSale for display

  const { data: clients, isLoading: isLoadingClients } = useQuery({
    queryKey: ['clients'],
    queryFn: ({ queryKey }: { queryKey: unknown[] }) => {
      const searchTerm = queryKey[1] as string | undefined
      if (searchTerm) {
        return fetchClientsForSelect(searchTerm)
      }
      return fetchClientsForSelect('')
    },
    staleTime: 1000 * 60 * 2,
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

  const selectedClient = clients?.results.find((client: Client) => client.id === watch('client_id'))

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const details = watch('details') || []


  const queriesForUseQueries = useMemo(() => {
    return details.map((_, index) => ({
      queryKey: ['products', index], 
      queryFn: () => fetchProducts(''), 
      staleTime: 1000 * 60 * 2,
    }))

  }, [details.length])

  const productQueries = useQueries({
    queries: queriesForUseQueries, // Use the memoized configuration
  })

  const findProductById = useCallback((productId: string): Product | undefined => {

    for (const query of productQueries) {
      if (query.data?.results) {
        const product = query.data.results.find((product) => product.id === productId)
        if (product) return product
      }
    }
    return undefined
  }, [productQueries])


  useEffect(() => {
    details.forEach((detail, index) => {
      const unitPricePath = `details.${index}.unit_price` as const
      const currentUnitPrice = watch(unitPricePath)

      if (detail.product_id) {
        const selectedProduct = findProductById(detail.product_id)
        if (selectedProduct && typeof selectedProduct.price_clp === 'number') {
          if (currentUnitPrice !== selectedProduct.price_clp) {
            setValue(unitPricePath, selectedProduct.price_clp)
          }
        }
              
      } else {
        if (currentUnitPrice !== 0) {
          setValue(unitPricePath, 0)
        }
      }
    })

  }, [details, setValue, watch, findProductById])

  const mutation = useMutation({
    mutationFn: (data: SaleCreationFormValues) => {
      // Construct the payload for updateSale according to your backend's expected format
      // This might involve transforming the data if SaleCreationFormValues doesn't exactly match
      // what your updateSale endpoint expects, especially regarding client and product IDs.
      const payload = {
        ...data,
        // Ensure client_id is just the ID string if your backend expects that
        client_id: data.client_id, 
        details: data.details.map(detail => ({
          product_id: detail.product_id,
          quantity: detail.quantity,
          unit_price: detail.unit_price,
          // id: detail.id, // If your backend needs the detail ID for updates, include it here
        })),
      };
      return updateSale(id as string, payload as any); // Use 'as any' if payload type is complex or use a specific update type
    },
    onSuccess: () => {
      alert('Venta actualizada con éxito!')
      navigate({ to: '/ventas/gestiondeventas' }) // Or to the specific sale view page
    },
    onError: (error) => {
      console.error(error)
      alert(`Error: ${error instanceof Error ? error.message : 'Ocurrió un error al actualizar'}`)
    },
  })

  const onSubmit: SubmitHandler<SaleCreationFormValues> = (data) => {
    console.log('Updating sale:', data)
    mutation.mutate(data)
  }

  // Agregar nuevo detalle
  const addDetail = () => {
    setValue('details', [...watch('details'), { product_id: '', quantity: 1, unit_price: 0 }])
  }

  // Eliminar detalle
  const removeDetail = (index: number) => {
    const currentDetails = [...watch('details')]
    currentDetails.splice(index, 1)
    setValue('details', currentDetails)
  }

  // Manejar cambio de producto
  const handleProductChange = (index: number, productId: string | null) => {
    if (productId) {
      const selectedProduct = findProductById(productId)
      if (selectedProduct && typeof selectedProduct.price_clp === 'number') {
        setValue(`details.${index}.unit_price`, selectedProduct.price_clp)
      } else {
        setValue(`details.${index}.unit_price`, 0) 
      }
    } else {
      setValue(`details.${index}.unit_price`, 0) 
    }
  }

  const totalAmount = details.reduce((sum, item) => {
    return sum + Number(item.quantity) * Number(item.unit_price)
  }, 0)

  const iva = Math.round(totalAmount * 0.19)
  const netAmount = totalAmount - iva

  if (isLoadingSale) return <CircularProgress />;
  if (saleError) return <Typography color="danger">Error al cargar la venta: {saleError.message}</Typography>;
  // Make sure existingSale is checked before trying to access its properties
  if (!existingSale) return <Typography>Cargando datos de la venta...</Typography>; 

  return (
    <>
      <Stack spacing={1} direction={'row'} justifyContent={'flex-start'} alignItems={'center'}>
        <IconButton onClick={() => navigate({ to: '/ventas/gestiondeventas' })}> 
          <ArrowBack />
        </IconButton>
        <Typography level='h4'>Editar Venta {existingSale?.folio ? ` #${existingSale.folio}` : ''}</Typography> {/* Display folio in title */}
      </Stack>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid xs={12} sm={8}>
            <Sheet variant='outlined' sx={{ p: 2, borderRadius: 'md', flex: 2 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormSelect
                    name='document_type'
                    control={control}
                    label='Tipo de Documento'
                    options={[
                      { value: 'FAC', label: 'Factura' },
                      { value: 'BOL', label: 'Boleta' },
                    ]}
                    error={errors.document_type} 
                    fullWidth={true}
                  />
                  <FormControl>
                    <FormLabel>Número de Venta</FormLabel>
                    <Input
                      value={existingSale.folio} // Display existing folio directly
                      readOnly
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Fecha de Venta</FormLabel>
                    <Input
                      value={dayjs(existingSale.created_at).format('DD/MM/YYYY')} // Use created_at for date
                      readOnly
                    />
                  </FormControl>

                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <AutocompleteFormField
                    label='Cliente'
                    placeholder='Buscar cliente'
                    control={control}
                    name='client_id'
                    fullWidth={true}
                    options={clientsOptions}
                    loading={isLoadingClients}
                    error={errors?.client_id}
                    freeSolo={false}
                  />
                  <FormSelect
                    name='payment_method'
                    control={control}
                    label='Metodo de pago'
                    options={[
                      { value: 'EF', label: 'Efectivo' },
                      { value: 'TC', label: 'Tarjeta Crédito' },
                      { value: 'TD', label: 'Tarjeta Débito' },
                      { value: 'TR', label: 'Transferencia' },
                      { value: 'OT', label: 'Otro' },
                    ]}
                    error={errors?.payment_method}
                    fullWidth={true}
                  />
                  <FormSelect
                    name='status'
                    control={control}
                    label='Estado'
                    options={[
                      { value: 'PE', label: 'Pendiente' },
                      { value: 'PA', label: 'Pagada' },
                      { value: 'CA', label: 'Cancelada' },
                    ]}
                    error={errors?.status}
                    fullWidth={true}
                  />

                </Stack>
                <Grid container sx={{ flexGrow: 1 }}>
                  <Grid xs={12}>
                    <Stack spacing={2}>
                      <Typography level='title-md'>Detalles de la Orden</Typography>
                      <Sheet variant='outlined' sx={{
                        borderRadius: 'var(--joy-radius-md)',
                        height: '15.9rem',
                        overflow: 'auto',
                      }}
                      >
                        <Table
                          stickyHeader 
                          sx={{
                            '& thead th': { fontWeight: 'lg' },
                            '& tr > *:not(:first-of-type)': { textAlign: 'right' },
                            '& td': { verticalAlign: 'top', paddingTop: '12px', paddingBottom: '12px' }, 
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
                              const productQuery = productQueries[index] || {}
                              const { data: productsData, isLoading: isProductsLoading } = productQuery

                              const currentProductOptions = productsData?.results?.map(product => ({
                                value: product.id,
                                label: product.name
                              })) ?? []

                              return (
                                <tr key={index}>
                                  <td>
                                    <AutocompleteFormField
                                      name={`details.${index}.product_id`}
                                      control={control}
                                      options={currentProductOptions}
                                      error={errors.details?.[index]?.product_id}
                                      onChange={(value) => handleProductChange(index, value as string)}
                                      placeholder='Buscar producto'
                                      size='sm'
                                      loading={isProductsLoading}
                                      freeSolo={false}
                                      onInputChange={(_, value) => {
                                        if (value && value.length > 2) {
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
                                      disabled={!!watch(`details.${index}.product_id`)} 
                                      size='sm'
                                    />
                                  </td>
                                  <td style={{ textAlign: 'center' }}>
                                    <IconButton
                                      variant='plain'
                                      color='danger'
                                      size='sm'
                                      onClick={() => removeDetail(index)}
                                      disabled={details.length <= 1} 
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
                    type='submit'
                    fullWidth
                    size='md'
                    sx={{ mt: 'auto' }}
                    startDecorator={<Edit />} // Changed icon to Edit
                    loading={mutation.isPending}
                    disabled={mutation.isPending || isLoadingSale} // Disable if loading sale data
                  >
                    Guardar Cambios {/* Changed button text */}
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

export default SalesEdit // Changed export name