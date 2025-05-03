import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Typography,
  Stack
} from "@mui/joy";
import Information from "../../components/core/Information/Information";
import { useEffect, useState } from "react";
import { fetchProduct, fetchSupplier } from "../../services/inventoryService";
import { useParams } from "@tanstack/react-router";

export default function VerProducto() {
  const { id } = useParams({ strict: false });
  const [producto, setProducto] = useState<any>(null);
  const [proveedor, setProveedor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setProveedor(null); // Limpiar proveedor anterior
    fetchProduct(id)
      .then(data => {
        setProducto(data);
        if (data.supplier) {
          fetchSupplier(data.supplier).then(setProveedor);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Typography>Cargando...</Typography>;
  if (!producto) return <Typography>No se encontró el producto.</Typography>;

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
          {producto.name}
        </Typography>
      </FormControl>

      {/* Precio y Stock */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <FormControl sx={{ flex: 1 }}>
          <FormLabel>Precio (CLP$)</FormLabel>
          <Typography level="body-md" sx={{ p: 1, bgcolor: 'background.level1', borderRadius: 'sm' }}>
            ${producto.price_clp}
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
              color: producto.stock === 0 ? 'danger.500' : 'success.500'
            }}
          >
            {producto.stock} unidades
          </Typography>
        </FormControl>
      </Stack>

      {/* Categoría */}
      <FormControl>
        <FormLabel>Categoría</FormLabel>
        <Typography level="body-md" sx={{ p: 1, bgcolor: 'background.level1', borderRadius: 'sm' }}>
          {producto.category}
        </Typography>
      </FormControl>

      {/* Proveedor */}
      <FormControl>
        <FormLabel>Proveedor</FormLabel>
        <Typography level="body-md" sx={{ p: 1, bgcolor: 'background.level1', borderRadius: 'sm' }}>
          {proveedor?.name || "Ninguno"}
        </Typography>
      </FormControl>
    </Information>
  );
}