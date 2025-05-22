import { zodResolver } from '@hookform/resolvers/zod'
import { Add, ArrowBack, Delete } from '@mui/icons-material'
import { Button, Card, IconButton, Stack, Typography, Sheet, Table, Grid, Divider } from '@mui/joy' // Added Sheet, Table, Grid
import { SubmitHandler, useForm } from 'react-hook-form'
import { BuyOrderCreationFormValues, buyOrderCreationSchema } from '../../schemas/proveedores/buyOrderSchema'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createBuyOrder, fetchProducts, fetchSuppliers } from '../../services/supplierService'
import FormSelect, { SelectOption } from '../../components/core/FormSelect/FormSelect'
import { Supplier } from '../../types/proveedores.types'
import FormField from '../../components/core/FormField/FormField'
import { Product } from '../../types/inventory.types'
import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

const BuyOrderCreation = () => {
  const navigate = useNavigate()

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  })
  const { data: suppliers } = useQuery({
    queryKey: ['suppliers'],
    queryFn: fetchSuppliers
  })

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm<BuyOrderCreationFormValues>({
    resolver: zodResolver(buyOrderCreationSchema),
    defaultValues: {
      status: 'PE' as const,
      supplier: '',
      details: [{ product: '', quantity: 1, unit_price: 0 }], // Initialize with one detail item
    },
    mode: 'onBlur'
  })

  const supplierToOptions = (suppliers?: Supplier[]): SelectOption[] => {
    return suppliers?.map(supplier => ({
      value: supplier.name,
      label: supplier.name
    })) ?? []
  }

  const supplierOptions = supplierToOptions(suppliers?.results)

  const productsToOptions = (productss?: Product[]): SelectOption[] => {
    return productss?.map(products => ({
      value: products.id,
      label: products.name
    })) ?? []
  }

  const productsOptions = productsToOptions(products?.results)

  // Función para encontrar un producto por su ID
  const findProductById = (productId: string): Product | undefined => {
    return products?.results?.find(product => product.id === productId)
  }

  // Observar cambios en los productos seleccionados
  const details = watch('details') || []

  // Efecto para actualizar precios cuando cambian los productos seleccionados
  useEffect(() => {
    details.forEach((detail, index) => {
      if (detail.product) {
        const selectedProduct = findProductById(detail.product)
        if (selectedProduct && selectedProduct.price_clp) {
          // Actualizar el precio unitario con el precio del producto
          // Check if the current unit_price is different before setting to avoid infinite loops if not careful
          if (watch(`details.${index}.unit_price`) !== selectedProduct.price_clp) {
            setValue(`details.${index}.unit_price`, selectedProduct.price_clp)
          }
        }
      } else {
        // Optionally, clear unit price if product is removed
        // setValue(`details.${index}.unit_price`, 0)
      }
    })
  }, [details, setValue, watch, findProductById]) // Adjusted dependencies for robustness

  const mutation = useMutation({
    mutationFn: createBuyOrder,
    onSuccess: () => {
      alert('Orden creada con éxito!')
      navigate({ to: '/proveedores/ordenes-de-compra' })
    },
    onError: (error) => {
      console.error(error)
      alert(`Error: ${error instanceof Error ? error.message : 'Ocurrió un error'}`)
    }
  })

  const onSubmit: SubmitHandler<BuyOrderCreationFormValues> = (data) => {
    console.log(data)
    mutation.mutate(data)
  }

  // Agregar nuevo detalle
  const addDetail = () => {
    setValue('details', [
      ...watch('details'),
      { product: '', quantity: 1, unit_price: 0 }
    ])
  }

  // Eliminar detalle
  const removeDetail = (index: number) => {
    const currentDetails = [...watch('details')]
    currentDetails.splice(index, 1)
    setValue('details', currentDetails)
  }

  // Manejar cambio de producto
  const handleProductChange = (index: number, productId: string | null) => { // Allow null for type safety
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
    return sum + (Number(item.quantity) * Number(item.unit_price))
  }, 0)

  const iva = Math.round(totalAmount * 0.19)
  const netAmount = totalAmount - iva

  return (
    <>
      <Stack spacing={1} direction={'row'} justifyContent={'flex-start'} alignItems={'center'}>
        <IconButton onClick={() => navigate({ to: '/proveedores/ordenes-de-compra' })}>
          <ArrowBack />
        </IconButton>
        <Typography level="h4">Nueva Orden de Compra</Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
          <Sheet variant="outlined" sx={{ p: 2, borderRadius: 'md', flex: 2 }}>
            <Stack spacing={3}>
              {/* Proveedor y Estado */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormSelect
                  name="supplier"
                  control={control}
                  label="Proveedor"
                  options={supplierOptions}
                  error={errors.supplier}
                  fullWidth
                  placeholder="Seleccionar proveedor"
                />
                <FormSelect
                  name="status"
                  control={control}
                  label="Estado"
                  options={[
                    { value: 'PE', label: 'Pendiente' },
                    { value: 'AP', label: 'Aprobado' },
                    { value: 'RE', label: 'Rechazado' }
                  ]}
                  error={errors.status}
                  fullWidth
                />
              </Stack>

              {/* Grid para Detalles y Resumen */}
              <Grid container spacing={3} sx={{ flexGrow: 1 }}>
                {/* Columna Izquierda: Detalles de la orden (Tabla) */}
                <Grid xs={12}>
                  <Stack spacing={2}>
                    <Typography level="title-md">Detalles de la Orden</Typography>
                    <Table
                      stickyHeader // Makes header sticky if table scrolls
                      sx={{
                        '& thead th': { fontWeight: 'lg' },
                        '& tr > *:not(:first-child)': { textAlign: 'right' },
                        '& td': { verticalAlign: 'top', paddingTop: '12px', paddingBottom: '12px' } // Adjust padding for FormControls
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
                      <tbody>
                        {details.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <FormSelect
                                name={`details.${index}.product`}
                                control={control}
                                options={productsOptions}
                                error={errors.details?.[index]?.product}
                                onChange={(value) => handleProductChange(index, value as string)}
                                placeholder="Seleccionar producto"
                                size="sm"
                              />
                            </td>
                            <td>
                              <FormField
                                name={`details.${index}.quantity`}
                                control={control}
                                type="number"
                                error={errors.details?.[index]?.quantity}
                                transform={Number}
                                size="sm"
                              />
                            </td>
                            <td>
                              <FormField
                                name={`details.${index}.unit_price`}
                                control={control}
                                type="number"
                                error={errors.details?.[index]?.unit_price}
                                transform={Number}
                                disabled={!!watch(`details.${index}.product`)} // Disable if product is selected
                                size="sm"
                              />
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <IconButton
                                variant="plain"
                                color="danger"
                                size="sm"
                                onClick={() => removeDetail(index)}
                                disabled={details.length <= 1} // Disable if only one item
                              >
                                <Delete />
                              </IconButton>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>

                    <Button
                      variant="soft"
                      color="primary"
                      onClick={addDetail}
                      startDecorator={<Add />}
                      sx={{ alignSelf: 'flex-start', mt: 1 }}
                    >
                      Agregar Item
                    </Button>

                    {errors.details?.root && (
                      <Typography color="danger" level="body-sm" sx={{ mt: 1 }}>
                        {errors.details.root.message}
                      </Typography>
                    )}
                  </Stack>
                </Grid>
              </Grid>
            </Stack>
          </Sheet>
          <Sheet variant='outlined' sx={{ p: 2, borderRadius: 'md', flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
              <Typography level="title-md">Resumen</Typography>
              <Stack justifyContent={'space-between'} flexDirection={'row'}>
                <Typography>Total:</Typography>
                <Typography>{totalAmount.toLocaleString('es-CL')}</Typography>
              </Stack>
              <Stack justifyContent={'space-between'} flexDirection={'row'}>
                <Typography>IVA (19%):</Typography>
                <Typography>{iva.toLocaleString('es-CL')}</Typography>
              </Stack>
              <Divider />
              <Stack justifyContent={'space-between'} flexDirection={'row'}>
                <Typography>Total Neto:</Typography>
                <Typography>{netAmount.toLocaleString('es-CL')}</Typography>
              </Stack>
            </Stack>
            <Button
              type="submit"
              fullWidth
              size="md"
              sx={{ mt: 'auto', pt: 2 }}
              loading={mutation.isPending}
              disabled={mutation.isPending}
            >
              Crear Orden
            </Button>
          </Sheet>
        </Stack>
      </form>
    </>
  )
}

export default BuyOrderCreation