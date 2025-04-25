import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Typography,
  Stack
} from "@mui/joy";
import Information from "../../components/core/Information/Information";
import { useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchSupplier } from "../../services/inventoryService";

export default function VerProveedor() {
  const { id } = useParams();
  const [proveedor, setProveedor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchSupplier(id)
      .then(setProveedor)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Typography>Cargando...</Typography>;
  if (!proveedor) return <Typography>No se encontró el proveedor.</Typography>;

  return (
    <Information
      title="Detalles del Proveedor"
      sectionTitle="Información del Proveedor"
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
      {/* Nombre del proveedor */}
      <FormControl>
        <FormLabel>Nombre del Proveedor</FormLabel>
        <Typography level="body-md" sx={{ p: 1, bgcolor: 'background.level1', borderRadius: 'sm' }}>
          {proveedor.name}
        </Typography>
      </FormControl>

      {/* Dirección y Teléfono */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <FormControl sx={{ flex: 1 }}>
          <FormLabel>Dirección</FormLabel>
          <Typography level="body-md" sx={{ p: 1, bgcolor: 'background.level1', borderRadius: 'sm' }}>
            {proveedor.address}
          </Typography>
        </FormControl>
        <FormControl sx={{ flex: 1 }}>
          <FormLabel>Teléfono</FormLabel>
          <Typography level="body-md" sx={{ p: 1, bgcolor: 'background.level1', borderRadius: 'sm' }}>
            {proveedor.phone}
          </Typography>
        </FormControl>
      </Stack>

      {/* Correo y RUT */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <FormControl sx={{ flex: 1 }}>
          <FormLabel>Correo</FormLabel>
          <Typography level="body-md" sx={{ p: 1, bgcolor: 'background.level1', borderRadius: 'sm' }}>
            {proveedor.email}
          </Typography>
        </FormControl>
        <FormControl sx={{ flex: 1 }}>
          <FormLabel>RUT</FormLabel>
          <Typography level="body-md" sx={{ p: 1, bgcolor: 'background.level1', borderRadius: 'sm' }}>
            {proveedor.rut}
          </Typography>
        </FormControl>
      </Stack>

      {/* Categoría */}
      <FormControl>
        <FormLabel>Categoría</FormLabel>
        <Typography level="body-md" sx={{ p: 1, bgcolor: 'background.level1', borderRadius: 'sm' }}>
          {proveedor.category}
        </Typography>
      </FormControl>
    </Information>
  );
}