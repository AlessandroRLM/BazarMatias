import { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Option,
  Stack,
  Textarea
} from "@mui/joy";
import Information from "../../components/core/Information/Information";
import { useParams, useNavigate } from "@tanstack/react-router";
import {
  fetchShrinkage,
  updateShrinkage,
  fetchProducts
} from "../../services/inventoryService";

export default function EditarMerma() {
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();
  const [form, setForm] = useState<any>({
    product: "",
    price: "",
    quantity: "",
    category: "",
    observation: "",
  });

  const [productos, setProductos] = useState<any[]>([]);

  useEffect(() => {
    // Primero obtenemos la merma
    fetchShrinkage(id).then(data => {
      setForm(data);
    });

    // Luego los productos para el selector
    fetchProducts({ page_size: 100 }).then(res => {
      setProductos(res.results || []);
    });
  }, [id]);

  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    await updateShrinkage(id, form);
    navigate({ to: "/Inventario/mermas" });
  };

  return (
    <Information
      title="Editar Merma"
      sectionTitle="Detalles de la Merma"
      footerContent={
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            color="neutral"
            onClick={() => window.history.back()}
            fullWidth
          >
            Cancelar
          </Button>
          <Button 
            variant="solid" 
            color="primary"
            fullWidth
            onClick={handleSubmit}
          >
            Confirmar
          </Button>
        </Stack>
      }
    >
      <Stack spacing={1}>
        <FormControl>
          <FormLabel>Nombre del Producto</FormLabel>
          <Select
            value={form.product}
            onChange={(_, value) => handleChange("product", value)}
            placeholder="Selecciona un producto"
            fullWidth
            required
          >
            {productos.map((p) => (
              <Option key={p.id} value={p.name}>
                {p.name}
              </Option>
            ))}
          </Select>
        </FormControl>

        {/* Cantidad */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <FormControl sx={{ flex: 1 }}>
            <FormLabel>Precio (CLP$)</FormLabel>
            <Input 
              type="number" 
              value={form.price}
              onChange={e => handleChange("price", e.target.value)}
              placeholder="Añadir precio"
              fullWidth
              required
            />
          </FormControl>
          <FormControl sx={{ flex: 1 }}>
            <FormLabel>Cantidad</FormLabel>
            <Input 
              type="number"
              value={form.quantity}
              onChange={e => handleChange("quantity", e.target.value)}
              placeholder="Añadir cantidad"
              fullWidth
            />
          </FormControl>
        </Stack>

        <FormControl sx={{ flex: 1 }}>
          <FormLabel>Categoría</FormLabel>
          <Select 
            value={form.category}
            onChange={(_, value) => handleChange("category", value)}
            placeholder="Seleccione una categoria"
            fullWidth
            required
          >
            <Option value="daño">Daño físico</Option>
            <Option value="deterioro">Deterioro</Option>
            <Option value="otros">Otros</Option>
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>Observación</FormLabel>
          <Textarea 
            value={form.observation}
            onChange={e => handleChange("observation", e.target.value)}
            placeholder="Registrar Observaciones"
            minRows={2}
            maxRows={4}
          />
        </FormControl>
      </Stack>
    </Information>
  );
}
