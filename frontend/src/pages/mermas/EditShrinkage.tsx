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
import { fetchShrinkage, updateShrinkage } from "../../services/inventoryService";

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

  useEffect(() => {
    fetchShrinkage(id).then(data => setForm(data));
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
          <Input 
            value={form.product}
            onChange={e => handleChange("product", e.target.value)}
            placeholder="Añadir Nombre del producto"
            fullWidth
          />
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