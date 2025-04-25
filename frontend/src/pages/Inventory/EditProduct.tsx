import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Option,
  Stack
} from "@mui/joy";
import Information from "../../components/core/Information/Information";
import { useEffect, useState } from "react";
import { fetchProduct, updateProduct } from "../../services/inventoryService";
import { useNavigate, useParams } from "@tanstack/react-router";

export default function EditarProducto() {
  const { id } = useParams();
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [categoria, setCategoria] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    fetchProduct(id).then(producto => {
      setNombre(producto.nombre);
      setPrecio(producto.precio);
      setStock(producto.stock);
      setCategoria(producto.categoria);
    });
  }, [id]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await updateProduct(id, {
        name: nombre,
        price: Number(precio),
        stock: Number(stock),
        category: categoria,
      });
      navigate("/Inventory/productos");
    } catch (e) {
      alert("Error al actualizar producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Information
      title="Editar Producto"
      sectionTitle="Informacion del Producto"
      footerContent={
        <>
          <Button 
            variant="outlined" 
            color="neutral"
            onClick={() => window.history.back()}
          >
            Cancelar
          </Button>
          <Button 
            variant="solid" 
            color="primary"
            loading={loading}
            onClick={handleSubmit}
          >
            Guardar
          </Button>
        </>
      }
    >
      <FormControl>
        <FormLabel>Nombre del Producto</FormLabel>
        <Input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre del producto" />
      </FormControl>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <FormControl sx={{ flex: 1 }}>
          <FormLabel>Precio (CLP$)</FormLabel>
          <Input value={precio} onChange={e => setPrecio(e.target.value)} placeholder="Precio" type="number" />
        </FormControl>
        <FormControl sx={{ flex: 1 }}>
          <FormLabel>Stock</FormLabel>
          <Input value={stock} onChange={e => setStock(e.target.value)} placeholder="Cantidad" type="number" />
        </FormControl>
      </Stack>
      <FormControl>
        <FormLabel>Categoría</FormLabel>
        <Select value={categoria} onChange={(_, v) => setCategoria(v ?? "")} placeholder="Selecciona una categoría">
          <Option value="utiles">Útiles escolares</Option>
          <Option value="oficina">Oficina</Option>
          <Option value="otros">Otros</Option>
        </Select>
      </FormControl>
    </Information>
  );
}
