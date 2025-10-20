import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Option,
  Stack
} from "@mui/joy";
import Information from "../../../components/core/Information/Information";
import { useState } from "react";
import { createSupplier } from "../../../services/inventoryService";
import { useNavigate } from "@tanstack/react-router";
import { useSnackbar } from "../../../hooks/core/useSnackbar";

export default function AñadirProveedor() {
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [rut, setRut] = useState("");
  const [categoria, setCategoria] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar()

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createSupplier({
        name: nombre,
        address: direccion,
        phone: telefono,
        email: correo,
        rut: rut,
        category: categoria,
      });
      navigate({ to: "/proveedores" });
      showSnackbar('Proveedor creado exitosamente.', 'success')
    } catch (e) {
      showSnackbar(`No se pudo crear el proveedor. Motivo: ${e || "Error desconocido"}`, 'danger')
    } finally {
      setLoading(false);
    }
  };

  return (
    <Information
      title="Añadir Proveedor"
      sectionTitle="Informacion del Proveedor"
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
            Añadir
          </Button>
        </>
      }
    >
      <FormControl>
        <FormLabel>Nombre del Proveedor</FormLabel>
        <Input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Añadir Nombre del proveedor" />
      </FormControl>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <FormControl sx={{ flex: 1 }}>
          <FormLabel>Dirección</FormLabel>
          <Input value={direccion} onChange={e => setDireccion(e.target.value)} placeholder="Añadir Dirección" />
        </FormControl>
        <FormControl sx={{ flex: 1 }}>
          <FormLabel>Teléfono</FormLabel>
          <Input value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="Añadir Teléfono" />
        </FormControl>
      </Stack>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <FormControl sx={{ flex: 1 }}>
          <FormLabel>Correo</FormLabel>
          <Input value={correo} onChange={e => setCorreo(e.target.value)} placeholder="Añadir Correo" />
        </FormControl>
        <FormControl sx={{ flex: 1 }}>
          <FormLabel>Rut</FormLabel>
          <Input value={rut} onChange={e => setRut(e.target.value)} placeholder="Añadir Rut" />
        </FormControl>
      </Stack>
      <FormControl>
        <FormLabel>Categoría</FormLabel>
        <Select value={categoria} onChange={(_, v) => setCategoria(v ?? "")} placeholder="Selecciona una categoría">
          <Option value="Accesorios">Accesorios</Option>
          <Option value="Arte">Arte</Option>
          <Option value="Electronica">Electrónica</Option>
          <Option value="Escolar">Escolar</Option>
          <Option value="Manualidades">Manualidades</Option>
          <Option value="Oficina">Oficina</Option>
          <Option value="Papeleria">Papelería</Option>
          <Option value="Otros">Otros</Option>
        </Select>
      </FormControl>
    </Information>
  );
}
