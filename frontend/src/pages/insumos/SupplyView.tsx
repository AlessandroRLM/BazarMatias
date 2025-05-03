import { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Box,
  Stack,
  Typography
} from "@mui/joy";
import Information from "../../components/core/Information/Information";
import { useParams } from "@tanstack/react-router";
import { fetchSupply } from "../../services/inventoryService";

export default function VerInsumo() {
  const { id } = useParams({ strict: false });
  const [insumoData, setInsumoData] = useState<any>(null);

  useEffect(() => {
    fetchSupply(id).then(setInsumoData);
  }, [id]);

  if (!insumoData) return <Typography>Cargando...</Typography>;

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
            {insumoData.name}
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
            {insumoData.stock} {insumoData.unit}
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
            {insumoData.category}
          </Typography>
        </FormControl>
      </Stack>
    </Information>
  );
}