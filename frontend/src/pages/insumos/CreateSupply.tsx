import { useState } from "react";
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
import { useNavigate } from "@tanstack/react-router";
import { createSupply } from "../../services/inventoryService";

export default function CrearInsumo() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    stock: "",
    category: "",
    unit: "",
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    await createSupply(form);
    navigate({ to: "/Inventario/insumos" });
  };

  return (
    <Information
      title="Crear Insumo"
      sectionTitle="Información del Insumo"
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
      <Stack spacing={3}>
        {/* Nombre del insumo */}
        <FormControl>
          <FormLabel>Nombre del Insumo</FormLabel>
          <Input 
            value={form.name}
            onChange={e => handleChange("name", e.target.value)}
            placeholder="Ej: Papel A4, Tóner negro, etc." 
            fullWidth
          />
        </FormControl>

        {/* Stock */}
        <FormControl>
          <FormLabel>Stock</FormLabel>
          <Input 
            value={form.stock}
            onChange={e => handleChange("stock", e.target.value)}
            placeholder="Cantidad disponible" 
            type="number"
            fullWidth
          />
        </FormControl>

        {/* Categoría */}
        <FormControl>
          <FormLabel>Categoría</FormLabel>
          <Select 
            value={form.category}
            onChange={(_, value) => handleChange("category", value)}
            placeholder="Selecciona una categoría"
            fullWidth
          >
            <Option value="papeleria">Papelería</Option>
            <Option value="oficina">Oficina</Option>
            <Option value="limpieza">Limpieza</Option>
            <Option value="electronica">Electrónica</Option>
            <Option value="otros">Otros</Option>
          </Select>
        </FormControl>
      </Stack>
    </Information>
  );
}