import {
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
import { fetchSupplier, updateSupplier } from "../../services/inventoryService";
import { useNavigate, useParams } from "@tanstack/react-router";

export default function EditarProveedor() {
  const { id } = useParams({ strict: false });
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [rut, setRut] = useState("");
  const [categoria, setCategoria] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    fetchSupplier(id).then(proveedor => {
      setNombre(proveedor.name ?? "");
      setDireccion(proveedor.address ?? "");
      setTelefono(proveedor.phone ?? "");
      setCorreo(proveedor.email ?? "");
      setRut(proveedor.rut ?? "");
      setCategoria(proveedor.category ?? "");
    });
  }, [id]);

  const handleSubmit = async () => {
    if (!id) {
      alert("ID de proveedor no encontrado.");
      return;
    }
    setLoading(true);
    try {
      await updateSupplier(id, {
        name: nombre,
        address: direccion,
        phone: telefono,
        email: correo,
        rut: rut,
        category: categoria,
      });
      navigate({ to: "/proveedores" });
    } catch (e) {
      alert("Error al actualizar proveedor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Information
      title="Editar Proveedor"
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
            Guardar
          </Button>
        </>
      }
    >
      <FormControl>
        <FormLabel>Nombre del Proveedor</FormLabel>
        <Input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre del proveedor" />
      </FormControl>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <FormControl sx={{ flex: 1 }}>
          <FormLabel>Dirección</FormLabel>
          <Input value={direccion} onChange={e => setDireccion(e.target.value)} placeholder="Dirección" />
        </FormControl>
        <FormControl sx={{ flex: 1 }}>
          <FormLabel>Teléfono</FormLabel>
          <Input value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="Teléfono" />
        </FormControl>
      </Stack>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <FormControl sx={{ flex: 1 }}>
          <FormLabel>Correo</FormLabel>
          <Input value={correo} onChange={e => setCorreo(e.target.value)} placeholder="Correo" />
        </FormControl>
        <FormControl sx={{ flex: 1 }}>
          <FormLabel>Rut</FormLabel>
          <Input value={rut} onChange={e => setRut(e.target.value)} placeholder="Rut" />
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
