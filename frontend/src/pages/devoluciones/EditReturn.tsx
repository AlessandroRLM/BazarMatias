import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Option,
  Typography,
  Grid,
  Stack,
  CircularProgress
} from "@mui/joy";
import CustomTable from "../../components/core/CustomTable/CustomTable";
import { ColumnDef } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { fetchReturnSupplier, updateReturnSupplier, fetchSuppliers, fetchSupplier, fetchProducts } from "../../services/inventoryService";
import { useParams, useNavigate } from "@tanstack/react-router";

interface ReturnProduct {
  id: string;
  name: string;
  status: string;
  quantity: number;
  productStatus: string;
  reason: string;
}

interface ReturnData {
  provider: string;
  rut: string;
  email: string;
  phone: string;
  issueDate: string;
  returnNumber: string;
  products: ReturnProduct[];
}

export default function ReturnEdit() {
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();
  const [returnData, setReturnData] = useState<ReturnData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchSuppliers().then(data => setSuppliers(data.results || []));
    fetchProducts().then(data => setProducts(data.results || []));
  }, []);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      fetchReturnSupplier(id)
        .then(async (data) => {
          let supplierData = { rut: "", email: "", phone: "" };
          if (data.supplier) {
            try {
              const s = await fetchSupplier(data.supplier);
              supplierData = {
                rut: s.rut || "",
                email: s.email || "",
                phone: s.phone || ""
              };
            } catch { /* proveedor no encontrado */ }
          }
          const transformed: ReturnData = {
            provider: data.supplier, // Usar el id para el Select
            rut: supplierData.rut,
            email: supplierData.email,
            phone: supplierData.phone,
            issueDate: data.purchase_date || "",
            returnNumber: data.purchase_number || "",
            products: [
              {
                id: data.product,
                name: data.product_name || "",
                status: data.status || "",
                quantity: data.quantity || 0,
                productStatus: data.product_condition || "",
                reason: data.reason || "",
              }
            ]
          };
          setReturnData(transformed);
          setIsLoading(false);
        })
        .catch(() => {
          toast.error('Error al cargar la devolución');
          setIsLoading(false);
        });
    }
  }, [id]);

  const handleChange = (field: keyof ReturnData, value: string) => {
    setReturnData(prev => prev ? ({ ...prev, [field]: value }) : null);
  };

  const handleProductChange = (id: string, field: keyof ReturnProduct, value: string | number) => {
    setReturnData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        products: prev.products.map(product => 
          product.id === id ? { ...product, [field]: value } : product
        )
      };
    });
  };

  const handleProviderChange = async (value: string) => {
    setReturnData(prev => {
      if (!prev) return null;
      return { ...prev, provider: value };
    });
    try {
      const s = await fetchSupplier(value);
      setReturnData(prev => prev ? ({
        ...prev,
        rut: s.rut || "",
        email: s.email || "",
        phone: s.phone || ""
      }) : null);
    } catch { /* proveedor no encontrado */ }
  };

  const handleConfirm = async () => {
    if (!returnData || !id) return;

    // Transformar los datos al formato esperado por el backend
    const payload = {
      supplier: returnData.provider,
      purchase_date: returnData.issueDate,
      purchase_number: returnData.returnNumber,
      // Solo soporta un producto, ajusta si hay varios
      product: returnData.products[0]?.id,
      product_condition: returnData.products[0]?.productStatus,
      quantity: returnData.products[0]?.quantity,
      reason: returnData.products[0]?.reason,
      status: returnData.products[0]?.status,
    };

    try {
      await updateReturnSupplier(id, payload);
      toast.success('¡Devolución actualizada con éxito!', {
        style: {
          borderRadius: '8px',
          background: '#333',
          color: '#fff',
        },
        icon: '✅',
      });
      navigate({ to: "/proveedores/devoluciones" });
    } catch (error) {
      toast.error('Error al actualizar la devolución');
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!returnData) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="danger">No se pudo cargar la información de la devolución</Typography>
      </Box>
    );
  }

  const productColumns: ColumnDef<ReturnProduct>[] = [
    { 
      accessorKey: "name",
      header: "Producto",
      cell: ({ row }) => (
        <Select
          value={row.original.id}
          onChange={(_, value) => {
            // Busca el producto seleccionado
            const selected = products.find(p => p.id === value);
            handleProductChange(row.original.id, 'id', value as string);
            handleProductChange(row.original.id, 'name', selected ? selected.name : "");
          }}
          placeholder="Seleccione producto"
        >
          {products.map(p => (
            <Option key={p.id} value={p.id}>{p.name}</Option>
          ))}
        </Select>
      )
    },
    { 
      accessorKey: "productStatus",
      header: "Estado del Producto",
      cell: ({ row }) => (
        <Select
          value={row.original.productStatus}
          onChange={(e, value) => handleProductChange(row.original.id, 'productStatus', value as string)}
        >
          <Option value="Nuevo">Nuevo</Option>
          <Option value="Usado">Usado</Option>
          <Option value="Dañado">Dañado</Option>
          <Option value="Defectuoso">Defectuoso</Option>
        </Select>
      )
    },
    { 
      accessorKey: "quantity", 
      header: "Cantidad",
      cell: ({ row }) => (
        <Input 
          type="number"
          value={row.original.quantity}
          onChange={(e) => handleProductChange(row.original.id, 'quantity', parseInt(e.target.value) || 0)}
        />
      )
    },
    { 
      accessorKey: "status",
      header: "Estatus",
      cell: ({ row }) => (
        <Select
          value={row.original.status}
          onChange={(e, value) => handleProductChange(row.original.id, 'status', value as string)}
        >
          <Option value="Pendiente">Pendiente</Option>
          <Option value="Resuelto">Resuelto</Option>
          <Option value="Denegado">Denegado</Option>
        </Select>
      )
    },
    { 
      accessorKey: "reason", 
      header: "Motivo",
      cell: ({ row }) => (
        <Input 
          value={row.original.reason}
          onChange={(e) => handleProductChange(row.original.id, 'reason', e.target.value)}
        />
      )
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography level="h2" sx={{ mb: 3 }}>Editar Devolución</Typography>

      <Box sx={{ 
        border: '1px solid', 
        borderColor: 'divider', 
        borderRadius: 'sm',
        p: 3,
        mb: 3
      }}>
        <Grid container spacing={3}>
          <Grid xs={12} md={6}>
            <Box sx={{ 
              border: '1px solid', 
              borderColor: 'divider', 
              borderRadius: 'sm',
              p: 2,
              height: '100%'
            }}>
              <Typography level="h4" sx={{ mb: 2 }}>Información del Proveedor</Typography>
              
              <Stack spacing={2}>
                <FormControl>
                  <FormLabel>Nombre Proveedor</FormLabel>
                  <Select
                    value={returnData.provider}
                    onChange={(_, value) => handleProviderChange(value ?? "")}
                    placeholder="Seleccione proveedor"
                  >
                    {suppliers.map(s => (
                      <Option key={s.id} value={s.id}>{s.name}</Option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>RUT</FormLabel>
                  <Input 
                    value={returnData.rut}
                    disabled
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input 
                    value={returnData.email}
                    disabled
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Teléfono</FormLabel>
                  <Input 
                    value={returnData.phone}
                    disabled
                  />
                </FormControl>
              </Stack>
            </Box>
          </Grid>

          <Grid xs={12} md={6}>
            <Box sx={{ 
              border: '1px solid', 
              borderColor: 'divider', 
              borderRadius: 'sm',
              p: 2,
              height: '100%'
            }}>
              <Typography level="h4" sx={{ mb: 2 }}>Orden de devolución</Typography>
              
              <Stack spacing={2}>
                <FormControl>
                  <FormLabel>Fecha de emisión</FormLabel>
                  <Input 
                    type="date" 
                    value={returnData.issueDate}
                    onChange={(e) => handleChange('issueDate', e.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Número de devolución</FormLabel>
                  <Input 
                    value={returnData.returnNumber}
                    onChange={(e) => handleChange('returnNumber', e.target.value)}
                  />
                </FormControl>
              </Stack>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Typography level="h4" sx={{ mb: 2 }}>Productos devueltos</Typography>
          
          {returnData.products && returnData.products.length > 0 ? (
            <CustomTable
              data={returnData.products}
              columns={productColumns}
              pagination={{ pageIndex: 0, pageSize: 10 }}
              paginationOptions={{
                onPaginationChange: () => {},
                rowCount: returnData.products.length
              }}
              sorting={[]}
              onSortingChange={() => {}}
              manualPagination={false}
            />
          ) : (
            <Typography>No hay productos en esta devolución</Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ 
        mt: 3, 
        display: 'flex', 
        justifyContent: 'flex-end',
        gap: 2
      }}>
        <Button 
          variant="outlined" 
          color="neutral"
          onClick={() => window.history.back()}
          sx={{ width: 150 }}
        >
          Cancelar
        </Button>
        <Button 
          variant="solid" 
          color="primary"
          onClick={handleConfirm}
          sx={{ width: 150 }}
        >
          Confirmar
        </Button>
      </Box>
    </Box>
  );
}