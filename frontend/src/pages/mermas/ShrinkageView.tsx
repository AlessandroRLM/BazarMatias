import {
    Button,
    FormControl,
    FormLabel,
    Box,
    Stack,
    Textarea,
    Typography
  } from "@mui/joy";
  import Information from "../../components/core/Information/Information";
  
  export default function VerMerma() {
    // Datos de ejemplo de la merma
    const mermaData = {
      id: "M-2023-001",
      producto: "Leche Entera 1L",
      precio: 12.50,
      cantidad: 5,
      categoria: "Lácteos",
      observaciones: "Producto encontrado vencido durante el inventario rutinario"
    };
  
    return (
      <Information
        title={`Merma`}
        sectionTitle="Detalles de la Merma"
        footerContent={
          <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
            <Button 
              variant="solid" 
              color="primary"
              sx={{ width: "200px" }}
              onClick={() => window.history.back()}
            >
              Volver
            </Button>
          </Box>
        }
      >
        <Stack spacing={2}>
          {/* Nombre del producto */}
          <FormControl>
            <FormLabel>Nombre del Producto</FormLabel>
            <Typography level="body-md" sx={{ p: 1, bgcolor: 'background.level1', borderRadius: 'sm' }}>
              {mermaData.producto}
            </Typography>
          </FormControl>
  
          {/* Precio y cantidad */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <FormControl sx={{ flex: 1 }}>
              <FormLabel>Precio (CLP$)</FormLabel>
              <Typography level="body-md" sx={{ p: 1, bgcolor: 'background.level1', borderRadius: 'sm' }}>
                ${mermaData.precio.toFixed(2)}
              </Typography>
            </FormControl>
            <FormControl sx={{ flex: 1 }}>
              <FormLabel>Cantidad</FormLabel>
              <Typography level="body-md" sx={{ p: 1, bgcolor: 'background.level1', borderRadius: 'sm' }}>
                {mermaData.cantidad} unidades
              </Typography>
            </FormControl>
          </Stack>
  
          {/* Categoría */}
          <FormControl>
            <FormLabel>Categoría</FormLabel>
            <Typography level="body-md" sx={{ p: 1, bgcolor: 'background.level1', borderRadius: 'sm' }}>
              {mermaData.categoria}
            </Typography>
          </FormControl>
  
          {/* Observaciones */}
          <FormControl>
            <FormLabel>Observaciones</FormLabel>
            <Textarea 
              
              value={mermaData.observaciones}
              readOnly
              minRows={3}
              sx={{bgcolor: 'background.level1', borderRadius: 'sm', p: 1}}
                 
                
              
            />
          </FormControl>
        </Stack>
      </Information>
    );
  }