import { zodResolver } from '@hookform/resolvers/zod'
import { Add, ArrowBack, Delete } from '@mui/icons-material'
import { Button, IconButton, Stack, Typography, Sheet, Table, Grid, Divider, CircularProgress } from '@mui/joy'
import { SubmitHandler, useForm } from 'react-hook-form'
import { BuyOrderCreationFormValues, buyOrderCreationSchema } from '../../../schemas/proveedores/buyOrderSchema'
import { useMutation, useQuery, useQueries } from '@tanstack/react-query'
import { fetchBuyOrderById, editBuyOrder, fetchProducts, fetchSuppliers } from '../../../services/supplierService'
import AutocompleteFormField, { SelectOption } from '../../../components/core/AutocompleteFormField/AutocompleteFormField'
import { Supplier } from '../../../types/suppliers.types'
import FormField from '../../../components/core/FormField/FormField'
import { Product } from '../../../types/inventory.types'
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

  // Consulta para proveedores
  const { data: suppliers, isLoading: suppliersLoading } = useQuery({
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

  // Observar cambios en los productos seleccionados
  const details = watch('details') || []

  // Usar useQueries para crear una consulta independiente para cada detalle
  const productQueries = useQueries({
    queries: details.map((_, index) => ({
      queryKey: ["products", index],
      queryFn: ({ queryKey }: { queryKey: unknown[] }) => {
        // El tercer elemento del queryKey es el término de búsqueda (si existe)
        const searchTerm = queryKey[2] as string | undefined
        if (searchTerm) {
          return fetchProducts(searchTerm)
        }
        return fetchProducts("")
      },
      staleTime: Infinity,
    })),
  })

  // Función para encontrar un producto por su ID usando los resultados de las consultas
  const findProductById = (productId: string): Product | undefined => {
    // Buscar en todos los resultados de consultas
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
        // Optionally, clear unit price if product is removed
        // setValue(`details.${index}.unit_price`, 0)
      }
    })
  }, [details, setValue, watch, findProductById]) // Adjusted dependencies for robustness

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
  const handleProductChange = (index: number, productId: string | null) => {
    // Allow null for type safety
    if (productId) {
      const selectedProduct = findProductById(productId)
      if (selectedProduct && typeof selectedProduct.price_clp === "number") {
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
        <Stack spacing={2} direction={{ xs: "column", md: "row" }}>
          <Sheet variant="outlined" sx={{ p: 2, borderRadius: "md", flex: 2 }}>
            <Stack spacing={3}>
              {/* Proveedor y Estado */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <AutocompleteFormField
                  name="supplier"
                  control={control}
                  label="Proveedor"
                  options={supplierOptions}
                  error={errors.supplier}
                  fullWidth={true}
                  placeholder="Buscar proveedor"
                  loading={suppliersLoading}
                  freeSolo={false}
                />
                <AutocompleteFormField
                  name="status"
                  control={control}
                  label="Estado"
                  options={[
                    { value: "PE", label: "Pendiente" },
                    { value: "AP", label: "Aprobado" },
                    { value: "RE", label: "Rechazado" },
                  ]}
                  error={errors.status}
                  fullWidth={true}
                />
              </Stack>

              {/* Grid para Detalles y Resumen */}
              <Grid container sx={{ flexGrow: 1 }}>
                {/* Columna Izquierda: Detalles de la orden (Tabla) */}
                <Grid xs={12}>
                  <Stack spacing={2}>
                    <Typography level="title-md">Detalles de la Orden</Typography>
                    <Sheet variant="outlined" sx={{
                      borderRadius: "var(--joy-radius-md)",
                      height: '23.77rem',
                      overflow: 'auto',
                    }}
                    >
                      <Table
                        stickyHeader // Makes header sticky if table scrolls
                        sx={{
                          "& thead th": { fontWeight: "lg" },
                          "& tr > *:not(:first-of-type)": { textAlign: "right" },
                          "& td": { verticalAlign: "top", paddingTop: "12px", paddingBottom: "12px" }, // Adjust padding for FormControls
                        }}
                      >
                        <thead>
                          <tr>
                            <th style={{ width: "40%", textAlign: "left" }}>Producto</th>
                            <th style={{ width: "20%" }}>Cantidad</th>
                            <th style={{ width: "25%" }}>Precio Unitario</th>
                            <th style={{ width: "15%", textAlign: "center" }}>Acciones</th>
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
                                    placeholder="Buscar producto"
                                    size="sm"
                                    loading={isProductsLoading}
                                    freeSolo={false}
                                    onInputChange={(_, value) => {
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
                                <td style={{ textAlign: "center" }}>
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
                            )
                          })}
                        </tbody>
                      </Table>
                    </Sheet>
                    <Button
                      variant="soft"
                      color="primary"
                      onClick={addDetail}
                      startDecorator={<Add />}
                      sx={{ alignSelf: "flex-start", mt: 1 }}
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
          <Sheet
            variant="outlined"
            sx={{ p: 2, borderRadius: "md", flex: 1, display: "flex", flexDirection: "column" }}
          >
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
              <Typography level="title-md">Resumen</Typography>
              <Stack justifyContent={"space-between"} flexDirection={"row"}>
                <Typography>Total Neto:</Typography>
                <Typography level='title-md'>{netAmount.toLocaleString("es-CL")}</Typography>
              </Stack>
              <Stack justifyContent={"space-between"} flexDirection={"row"}>
                <Typography>IVA (19%):</Typography>
                <Typography level='title-md'>{iva.toLocaleString("es-CL")}</Typography>
              </Stack>
              <Divider />
              <Stack justifyContent={"space-between"} flexDirection={"row"}>
                <Typography>Total:</Typography>
                <Typography level='title-md'>{totalAmount.toLocaleString("es-CL")}</Typography>
              </Stack>
            </Stack>
            <Button
              type="submit"
              fullWidth
              size="md"
              sx={{ mt: "auto", pt: 2 }}
              loading={mutation.isPending}
              disabled={mutation.isPending}
            >
              Actualizar Orden
            </Button>
          </Sheet>
        </Stack>
      </form>
    </>
  )
}

export default BuyOrderEdit