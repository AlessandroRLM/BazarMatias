import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Typography,
    Stack
  } from "@mui/joy";
  import Information from "../../components/core/Information/Information";
  
  export default function VerProducto() {
    const producto = {
      nombre: "Laptop HP EliteBook",
      precio: "1.200.000",
      stock: "15 unidades",
      categoria: "Electrónicos"
    };
  
    return (
      <Information
        title="Detalles del Producto"
        sectionTitle="Información del Producto"
        footerContent={
          <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <Button 
              variant="solid" 
              color="primary"
              sx={{ width: "200px" }}
              onClick={() => window.history.back()}
            >
              Confirmar
            </Button>
          </Box>
        }
      >
        {/* Nombre del producto */}
        <FormControl>
          <FormLabel>Nombre del Producto</FormLabel>
          <Typography level="body-md" sx={{ p: 1, bgcolor: 'background.level1', borderRadius: 'sm' }}>
            {producto.nombre}
          </Typography>
        </FormControl>
  
        {/* Precio y Stock */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <FormControl sx={{ flex: 1 }}>
            <FormLabel>Precio (CLP$)</FormLabel>
            <Typography level="body-md" sx={{ p: 1, bgcolor: 'background.level1', borderRadius: 'sm' }}>
              ${producto.precio}
            </Typography>
          </FormControl>
          <FormControl sx={{ flex: 1 }}>
            <FormLabel>Stock</FormLabel>
            <Typography 
              level="body-md" 
              sx={{ 
                p: 1, 
                bgcolor: 'background.level1', 
                borderRadius: 'sm',
                color: producto.stock.includes('0') ? 'danger.500' : 'success.500'
              }}
            >
              {producto.stock}
            </Typography>
          </FormControl>
        </Stack>
  
        {/* Categoría */}
        <FormControl>
          <FormLabel>Categoría</FormLabel>
          <Typography level="body-md" sx={{ p: 1, bgcolor: 'background.level1', borderRadius: 'sm' }}>
            {producto.categoria}
          </Typography>
        </FormControl>
      </Information>
    );
  }