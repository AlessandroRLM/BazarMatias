import { useState } from "react";
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
import { useNavigate } from "@tanstack/react-router";
import { createShrinkage } from "../../services/inventoryService";

export default function RegistrarMerma() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    product: "",
    price: "",
    quantity: "",
    category: "",
    observation: "",
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    await createShrinkage(form);
    navigate({ to: "/Inventario/mermas" });
  };

  return (
    <Information
      title="Registrar Merma"
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
            Añadir
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