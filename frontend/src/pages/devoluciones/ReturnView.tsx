import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Typography,
  Grid,
  Stack
} from "@mui/joy";
import CustomTable from "../../components/core/CustomTable/CustomTable";
import { ColumnDef } from "@tanstack/react-table";
import { fetchReturnSupplier, fetchSupplier } from "../../services/inventoryService";
import { useParams } from "@tanstack/react-router";
import { useState, useEffect } from "react";

export default function ReturnView() {
  const { id } = useParams({ strict: false });
  const [returnData, setReturnData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchReturnSupplier(id)
      .then(async data => {
        // Obtener datos del proveedor si es posible
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
        const products = [{
          id: data.product,
          name: data.product_name || "",
          status: data.status || "",
          quantity: data.quantity || 0,
          productStatus: data.product_condition || "",
          reason: data.reason || "",
        }];
        setReturnData({
          provider: data.supplier_name || data.provider,
          rut: supplierData.rut,
          email: supplierData.email,
          phone: supplierData.phone,
          issueDate: data.purchase_date || "",
          returnNumber: data.purchase_number || "",
          products,
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Typography>Cargando...</Typography>;
  if (!returnData) return <Typography>No se encontró la devolución.</Typography>;

  const productColumns: ColumnDef<typeof returnData.products[0]>[] = [
    { 
      accessorKey: "name", 
      header: "Producto",
      cell: info => <Typography>{info.getValue<string>()}</Typography>
    },
    { 
      accessorKey: "productStatus", // <-- Estado del producto
      header: "Estado del producto",
      cell: info => <Typography>{info.getValue<string>()}</Typography>
    },
    { 
      accessorKey: "quantity", 
      header: "Cantidad",
      cell: info => <Typography>{info.getValue<number>()}</Typography>
    },
    { 
      accessorKey: "status", // <-- Estatus
      header: "Estatus",
      cell: info => <Typography>{info.getValue<string>()}</Typography>
    },
    { 
      accessorKey: "reason", 
      header: "Motivo",
      cell: info => <Typography>{info.getValue<string>()}</Typography>
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography level="h2" sx={{ mb: 3 }}>Detalle de Devolución</Typography>

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
                  <Typography>{returnData.provider}</Typography>
                </FormControl>

                <FormControl>
                  <FormLabel>RUT</FormLabel>
                  <Typography>{returnData.rut}</Typography>
                </FormControl>

                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Typography>{returnData.email}</Typography>
                </FormControl>

                <FormControl>
                  <FormLabel>Teléfono</FormLabel>
                  <Typography>{returnData.phone}</Typography>
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
                  <Typography>{returnData.issueDate}</Typography>
                </FormControl>

                <FormControl>
                  <FormLabel>Número de devolución</FormLabel>
                  <Typography>{returnData.returnNumber}</Typography>
                </FormControl>
              </Stack>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <Typography level="h4" sx={{ mb: 2 }}>Productos devueltos</Typography>
          
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
        </Box>
      </Box>

      <Box sx={{ 
        mt: 3, 
        display: 'flex', 
        justifyContent: 'flex-end'
      }}>
        <Button 
          variant="solid" 
          color="primary"
          onClick={() => window.history.back()}
          sx={{ width: 150 }}
        >
          Volver
        </Button>
      </Box>
    </Box>
  );
}