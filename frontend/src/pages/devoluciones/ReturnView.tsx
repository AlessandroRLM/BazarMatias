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

export default function ReturnView() {
  const returnData = {
    provider: "Proveedor Ejemplo S.A.",
    rut: "12.345.678-9",
    email: "contacto@proveedor.com",
    phone: "+56 9 8765 4321",
    issueDate: "2023-11-15",
    returnNumber: "DEV-2023-0456",
    products: [
      {
        id: "1",
        name: "Producto XYZ-2000",
        productStatus: "Nuevo",
        status: "Defectuoso",
        quantity: 3,
        reason: "Daños en el embalaje"
      },
      {
        id: "2",
        name: "Producto ABC-1000",
        productStatus: "Usado",
        status: "Devuelto",
        quantity: 1,
        reason: "No cumplió expectativas"
      }
    ]
  };

  const productColumns: ColumnDef<typeof returnData.products[0]>[] = [
    { 
      accessorKey: "name", 
      header: "Producto",
      cell: info => <Typography>{info.getValue<string>()}</Typography>
    },
    { 
      accessorKey: "status", 
      header: "Estado del producto",
      cell: info => <Typography>{info.getValue<string>()}</Typography>
    },
    { 
      accessorKey: "quantity", 
      header: "Cantidad",
      cell: info => <Typography>{info.getValue<number>()}</Typography>
    },
    { 
      accessorKey: "productStatus", 
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