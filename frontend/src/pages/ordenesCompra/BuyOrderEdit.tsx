import { zodResolver } from '@hookform/resolvers/zod'
import { Add, ArrowBack, Delete } from '@mui/icons-material'
import { Button, Card, CircularProgress, IconButton, Stack, Typography } from '@mui/joy'
import { SubmitHandler, useForm } from 'react-hook-form'
import { BuyOrderCreationFormValues, buyOrderCreationSchema } from '../../schemas/proveedores/buyOrderSchema'
import { useMutation, useQuery } from '@tanstack/react-query'
import { fetchBuyOrderById, editBuyOrder, fetchProducts, fetchSuppliers } from '../../services/supplierService'
import FormSelect, { SelectOption } from '../../components/core/FormSelect/FormSelect'
import { Supplier } from '../../types/proveedores.types'
import FormField from '../../components/core/FormField/FormField'
import { Product } from '../../types/inventory.types'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useEffect } from 'react'

const BuyOrderEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams({ from: '/_auth/proveedores/editar-ordenes-de-compra/$id' })

  // Obtener datos de la orden de compra
  const { data: buyOrder, isLoading: isLoadingOrder, isError: isErrorOrder } = useQuery({
    queryKey: ['buyOrder', id],
    queryFn: () => fetchBuyOrderById(id),
    enabled: !!id,
  })

  // Obtener productos y proveedores
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
    reset,
  } = useForm<BuyOrderCreationFormValues>({
    resolver: zodResolver(buyOrderCreationSchema),
    defaultValues: {
      status: 'PE' as const,
      supplier: '',
      details: [],
    },
    mode: 'onBlur'
  })

  // Cargar datos de la orden cuando estén disponibles
  useEffect(() => {
    if (buyOrder) {
      reset({
        status: buyOrder.status as 'PE' | 'AP' | 'RE',
        supplier: String(buyOrder.supplier),
        details: buyOrder.details.map(detail => ({
          product: String(detail.product),
          quantity: detail.quantity,
          unit_price: detail.unit_price
        }))
      })
    }
  }, [buyOrder, reset])

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
          setValue(`details.${index}.unit_price`, selectedProduct.price_clp)
        }
      }
    })
  }, [details.map(d => d.product).join(',')])  // Dependencia: solo los IDs de productos

  const mutation = useMutation({
    mutationFn: (data: BuyOrderCreationFormValues) => editBuyOrder(id, data),
    onSuccess: () => {
      alert('Orden actualizada con éxito!')
      navigate({to:'/proveedores/ordenes-de-compra'})
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
    const details = [...watch('details')]
    details.splice(index, 1)
    setValue('details', details)
  }

  // Manejar cambio de producto
  const handleProductChange = (index: number, productId: string) => {
    const selectedProduct = findProductById(productId)
    if (selectedProduct && selectedProduct.price_clp) {
      // Actualizar el precio unitario con el precio del producto
      setValue(`details.${index}.unit_price`, selectedProduct.price_clp)
    }
  }

  const totalAmount = details.reduce((sum, item) => {
    return sum + (Number(item.quantity) * Number(item.unit_price))
  }, 0)

  const iva = Math.round(totalAmount * 0.19)
  const netAmount = totalAmount - iva

  // Mostrar carga mientras se obtienen los datos
  if (isLoadingOrder) {
    return (
      <Stack direction="row" justifyContent="center" alignItems="center" sx={{ height: '50vh' }}>
        <CircularProgress />
      </Stack>
    )
  }

  // Mostrar error si hay problemas al cargar la orden
  if (isErrorOrder) {
    return (
      <Stack spacing={2} alignItems="center" sx={{ height: '50vh' }}>
        <Typography level="h4" color="danger">Error al cargar la orden</Typography>
        <Button onClick={() => navigate({to:'/proveedores/ordenes-de-compra'})}>
          Volver al listado
        </Button>
      </Stack>
    )
  }

  return (
    <>
      <Stack spacing={1} direction={'row'} justifyContent={'flex-start'} alignItems={'center'}>
        <IconButton onClick={() => navigate({to:'/proveedores/ordenes-de-compra'})}>
          <ArrowBack/>
        </IconButton>
        <Typography level="h4">Editar Orden de Compra</Typography>
      </Stack>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>

          <Card variant="outlined">
            <Stack spacing={2}>
              {/* Campo Proveedor */}
              <FormSelect
                name="supplier"
                control={control}
                label="Proveedor"
                options={supplierOptions}
                error={errors.supplier}
                fullWidht
              />

              {/* Campo Estado */}
              <FormSelect
                name="status"
                control={control}
                label="Estado"
                options={[
                  { value: 'PE', label: 'Pendiente' },
                  { value: 'AP', label: 'Aprobado' },
                  { value: 'RE', label: 'Rechazado' }
                ]}
                fullWidht
              />

              {/* Detalles de la orden */}
              <Typography level="title-sm">Detalles</Typography>

              {details.map((_, index) => (
                <Card key={index} variant="soft" sx={{ p: 2 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography level="body-sm">Item #{index + 1}</Typography>
                    <Button
                      variant="plain"
                      color="danger"
                      size="sm"
                      onClick={() => removeDetail(index)}
                      startDecorator={<Delete />}
                    >
                      Eliminar
                    </Button>
                  </Stack>

                  <Stack spacing={2}>
                    <FormSelect
                      name={`details.${index}.product`}
                      control={control}
                      label="Producto"
                      options={productsOptions}
                      error={errors.details?.[index]?.product}
                      fullWidht
                      onChange={(value) => handleProductChange(index, value)}
                    />

                    <Stack direction="row" spacing={2}>
                      <FormField
                        name={`details.${index}.quantity`}
                        control={control}
                        label="Cantidad"
                        type="number"
                        error={errors.details?.[index]?.quantity}
                        transform={Number}
                        fullWidht
                      />

                      <FormField
                        name={`details.${index}.unit_price`}
                        control={control}
                        label="Precio Unitario"
                        type="number"
                        error={errors.details?.[index]?.unit_price}
                        transform={Number}
                        fullWidht
                        disabled={!!watch(`details.${index}.product`)}
                      />
                    </Stack>
                  </Stack>
                </Card>
              ))}

              <Button
                variant="outlined"
                onClick={addDetail}
                startDecorator={<Add />}
                fullWidth
              >
                Agregar Detalle
              </Button>

              {errors.details?.root && (
                <Typography color="danger" level="body-sm">
                  {errors.details.root.message}
                </Typography>
              )}
            </Stack>
          </Card>

          {/* Resumen de montos */}
          <Card variant="soft">
            <Typography level="title-sm" mb={1}>Resumen</Typography>
            <Stack direction="row" spacing={3}>
              <Stack>
                <Typography level="body-sm">Neto:</Typography>
                <Typography level="title-lg">${netAmount.toLocaleString()}</Typography>
              </Stack>
              <Stack>
                <Typography level="body-sm">IVA (19%):</Typography>
                <Typography level="title-lg">${iva.toLocaleString()}</Typography>
              </Stack>
              <Stack>
                <Typography level="body-sm">Total:</Typography>
                <Typography level="title-lg">${totalAmount.toLocaleString()}</Typography>
              </Stack>
            </Stack>
          </Card>

          {/* Botón de enviar */}
          <Button
            type="submit"
            fullWidth
            size="lg"
          >
            Actualizar Orden
          </Button>
        </Stack>
      </form>
    </>
  )
}

export default BuyOrderEdit