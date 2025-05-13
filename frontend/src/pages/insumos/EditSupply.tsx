import { useEffect, useState } from "react";
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
import { useParams, useNavigate } from "@tanstack/react-router";
import { fetchSupply, updateSupply } from "../../services/inventoryService";

export default function EditarInsumo() {
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();
  const [form, setForm] = useState<any>({
    name: "",
    stock: "",
    min_stock: "",
    category: "",
  });

  useEffect(() => {
    fetchSupply(id).then(data => setForm(data));
  }, [id]);

  const handleChange = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    await updateSupply(id, {
      ...form,
      stock: Number(form.stock),
      min_stock: Number(form.min_stock),
    });
    navigate({ to: "/Inventario/insumos" });
  };

  return (
    <Information
      title="Editar Insumo"
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
            Confirmar
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

        {/* Stock Min */}
        <FormControl>
          <FormLabel>Stock Mínimo</FormLabel>
          <Input 
            value={form.min_stock}
            onChange={e => handleChange("min_stock", e.target.value)}
            placeholder="Cantidad mínima antes de alerta" 
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