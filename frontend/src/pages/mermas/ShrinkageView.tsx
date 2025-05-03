import { useEffect, useState } from "react";
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
import { useParams } from "@tanstack/react-router";
import { fetchShrinkage } from "../../services/inventoryService";

export default function VerMerma() {
  const params = useParams({ from: "/Inventario/mermas/ver-merma/$id" });
  const [mermaData, setMermaData] = useState<any>(null);

  useEffect(() => {
    fetchShrinkage(params.id).then(setMermaData);
  }, [params.id]);

  if (!mermaData) return <Typography>Cargando...</Typography>;

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
            {mermaData.product}
          </Typography>
        </FormControl>

        {/* Precio y cantidad */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <FormControl sx={{ flex: 1 }}>
            <FormLabel>Precio (CLP$)</FormLabel>
            <Typography level="body-md" sx={{ p: 1, bgcolor: 'background.level1', borderRadius: 'sm' }}>
              ${mermaData.price?.toFixed(2)}
            </Typography>
          </FormControl>
          <FormControl sx={{ flex: 1 }}>
            <FormLabel>Cantidad</FormLabel>
            <Typography level="body-md" sx={{ p: 1, bgcolor: 'background.level1', borderRadius: 'sm' }}>
              {mermaData.quantity} unidades
            </Typography>
          </FormControl>
        </Stack>

        {/* Categoría */}
        <FormControl>
          <FormLabel>Categoría</FormLabel>
          <Typography level="body-md" sx={{ p: 1, bgcolor: 'background.level1', borderRadius: 'sm' }}>
            {mermaData.category}
          </Typography>
        </FormControl>

        {/* Observaciones */}
        <FormControl>
          <FormLabel>Observaciones</FormLabel>
          <Textarea 
            value={mermaData.observation}
            readOnly
            minRows={3}
            sx={{bgcolor: 'background.level1', borderRadius: 'sm', p: 1}}
          />
        </FormControl>
      </Stack>
    </Information>
  );
}