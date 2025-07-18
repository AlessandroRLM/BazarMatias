import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Option,
  Stack,
  Alert
} from "@mui/joy";
import Information from "../../../components/core/Information/Information";
import { useState, useEffect } from "react";
import { createProduct, fetchSuppliers } from "../../../services/inventoryService";
import { useNavigate } from "@tanstack/react-router";

export default function AñadirProducto() {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [minStock, setMinStock] = useState("");
  const [categoria, setCategoria] = useState("");
  const [proveedor, setProveedor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuppliers().then(data => setProveedores(data.results || []));
  }, []);

  const handleSubmit = async () => {
    if (!nombre || !precio || !stock || !categoria) {
      setError("Por favor, completa todos los campos obligatorios.");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      await createProduct({
        name: nombre,
        price_clp: Number(precio),
        stock: Number(stock),
        min_stock: Number(minStock) || 0,
        category: categoria,
        supplier: proveedor, // Now sends ID or null
      });
      navigate({ to: "/inventario/productos" });
    } catch (e) {
      setError(`No se pudo crear el producto. Motivo: ${e.message || "Error desconocido"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Information
      title="Añadir Producto"
      sectionTitle="Información del Producto"
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
      {error && <Alert color="danger">{error}</Alert>}
      
      <FormControl required>
        <FormLabel>Nombre del Producto</FormLabel>
        <Input value={nombre} onChange={e => setNombre(e.target.value)} />
      </FormControl>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <FormControl required sx={{ flex: 1 }}>
          <FormLabel>Precio (CLP$)</FormLabel>
          <Input 
            value={precio} 
            onChange={e => setPrecio(e.target.value)} 
            type="number" 
            startDecorator="$"
          />
        </FormControl>
        <FormControl required sx={{ flex: 1 }}>
          <FormLabel>Stock</FormLabel>
          <Input 
            value={stock} 
            onChange={e => setStock(e.target.value)} 
            type="number" 
          />
        </FormControl>
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <FormControl required sx={{ flex: 1 }}>
          <FormLabel>Categoría</FormLabel>
          <Select 
            value={categoria} 
            onChange={(_, v) => setCategoria(v || "")}
          >
            <Option value="Electronicos">Electrónicos</Option>
            <Option value="Accesorios">Accesorios</Option>
            <Option value="Ropa">Ropa</Option>
            <Option value="Oficina">Oficina</Option>
            <Option value="Utiles escolares">Útiles escolares</Option>
            <Option value="Otros">Otros</Option>
          </Select>
        </FormControl>
        <FormControl sx={{ flex: 1 }}>
          <FormLabel>Stock Mínimo</FormLabel>
          <Input 
            value={minStock} 
            onChange={e => setMinStock(e.target.value)} 
            type="number" 
          />
        </FormControl>
      </Stack>

      <FormControl>
        <FormLabel>Proveedor</FormLabel>
        <Select 
          value={proveedor} 
          onChange={(_, v) => setProveedor(v || null)}
          placeholder="Seleccione proveedor"
        >
          <Option value={null}>Ninguno</Option>
          {proveedores.map(prov => (
            <Option key={prov.id} value={prov.id}>
              {prov.name}
            </Option>
          ))}
        </Select>
      </FormControl>
    </Information>
  );
}