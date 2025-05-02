import {
    Button,
    FormControl,
    FormLabel,
    Box,
    Stack,
    Typography
  } from "@mui/joy";
  import Information from "../../components/core/Information/Information";
  
  export default function VerInsumo() {
    // Datos de ejemplo del insumo
    const insumoData = {
      id: "INS-2023-045",
      nombre: "Papel A4",
      stock: 42,
      categoria: "Papelería",
      unidad: "Resmas"
    };
  
    return (
      <Information
        title={`Insumo`}
        sectionTitle="Detalles del Insumo"
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
          {/* Nombre del insumo */}
          <FormControl>
            <FormLabel>Nombre del Insumo</FormLabel>
            <Typography 
              level="body-md" 
              sx={{ 
                p: 1, 
                bgcolor: 'background.level1', 
                borderRadius: 'sm',
                border: '1px solid',
                borderColor: 'neutral.outlinedBorder'
              }}
            >
              {insumoData.nombre}
            </Typography>
          </FormControl>
  
          {/* Stock */}
          <FormControl>
            <FormLabel>Stock Disponible</FormLabel>
            <Typography 
              level="body-md" 
              sx={{ 
                p: 1, 
                bgcolor: 'background.level1', 
                borderRadius: 'sm',
                border: '1px solid',
                borderColor: 'neutral.outlinedBorder'
              }}
            >
              {insumoData.stock} {insumoData.unidad}
            </Typography>
          </FormControl>
  
          {/* Categoría */}
          <FormControl>
            <FormLabel>Categoría</FormLabel>
            <Typography 
              level="body-md" 
              sx={{ 
                p: 1, 
                bgcolor: 'background.level1', 
                borderRadius: 'sm',
                border: '1px solid',
                borderColor: 'neutral.outlinedBorder'
              }}
            >
              {insumoData.categoria}
            </Typography>
          </FormControl>
        </Stack>
      </Information>
    );
  }