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
  Stack
} from "@mui/joy";
import CustomTable from "../../components/core/CustomTable/CustomTable";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

export default function ReturnEdit() {
  const [returnData, setReturnData] = useState({
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
        status: "Defectuoso",
        quantity: 3,
        productStatus: "Nuevo",
        reason: "Daños en el embalaje"
      },
      {
        id: "2",
        name: "Producto ABC-1000",
        status: "Devuelto",
        quantity: 1,
        productStatus: "Usado",
        reason: "No cumplió expectativas"
      }
    ]
  });

  const handleChange = (field: string, value: string) => {
    setReturnData(prev => ({ ...prev, [field]: value }));
  };

  const handleProductChange = (id: string, field: string, value: string) => {
    setReturnData(prev => ({
      ...prev,
      products: prev.products.map(product => 
        product.id === id ? { ...product, [field]: value } : product
      )
    }));
  };

  const productColumns: ColumnDef<typeof returnData.products[0]>[] = [
    { 
      accessorKey: "name", 
      header: "Producto",
      cell: ({ row }) => (
        <Input 
          value={row.original.name}
          onChange={(e) => handleProductChange(row.original.id, 'name', e.target.value)}
        />
      )
    },
    { 
      accessorKey: "status", 
      header: "Estado del producto",
      cell: ({ row }) => (
        <Select
          value={row.original.status}
          onChange={(e, value) => handleProductChange(row.original.id, 'status', value as string)}
        >
          <Option value="Defectuoso">Defectuoso</Option>
          <Option value="Devuelto">Devuelto</Option>
          <Option value="Usado">Usado</Option>
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
          onChange={(e) => handleProductChange(row.original.id, 'quantity', e.target.value)}
        />
      )
    },
    { 
      accessorKey: "productStatus", 
      header: "Estatus",
      cell: ({ row }) => (
        <Select
          value={row.original.productStatus}
          onChange={(e, value) => handleProductChange(row.original.id, 'productStatus', value as string)}
        >
          <Option value="Nuevo">Nuevo</Option>
          <Option value="Usado">Usado</Option>
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
                  <Input 
                    value={returnData.provider} 
                    onChange={(e) => handleChange('provider', e.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>RUT</FormLabel>
                  <Input 
                    value={returnData.rut}
                    onChange={(e) => handleChange('rut', e.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input 
                    value={returnData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Teléfono</FormLabel>
                  <Input 
                    value={returnData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
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
          sx={{ width: 150 }}
        >
          Confirmar
        </Button>
      </Box>
    </Box>
  );
}