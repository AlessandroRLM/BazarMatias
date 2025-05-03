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
import { useState, useEffect } from "react";
import { createProduct, fetchSuppliers, fetchProduct, fetchSupplier } from "../../services/inventoryService";
import { useNavigate, useParams } from "@tanstack/react-router";

export default function AñadirProducto() {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [categoria, setCategoria] = useState("");
  const [proveedor, setProveedor] = useState(""); // Nuevo estado para el proveedor
  const [proveedorNombre, setProveedorNombre] = useState(""); // Estado para el nombre del proveedor
  const [loading, setLoading] = useState(false);
  const [proveedores, setProveedores] = useState([]);
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();

  // Efecto para cargar proveedores SIEMPRE
  useEffect(() => {
    fetchSuppliers().then(data => setProveedores(data.results || []));
  }, []);

  // Efecto para cargar producto SOLO si hay id (modo editar)
  useEffect(() => {
    if (!id) return;

    // Obtener el producto
    fetchProduct(id).then(producto => {
      setNombre(producto.name ?? "");
      setPrecio(producto.price_clp ?? "");
      setStock(producto.stock ?? "");
      setCategoria(producto.category ?? "");
      setProveedor(producto.supplier ?? ""); // O supplier_id según tu backend

      // Si hay un supplier_id, obtener el nombre del proveedor
      if (producto.supplier) {
        fetchSupplier(producto.supplier).then(supplier => {
          setProveedorNombre(supplier.name);
        });
      }
    });
  }, [id]);

  const handleSubmit = async () => {
    if (!nombre || !precio || !stock || !categoria) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    setLoading(true);
    try {
      await createProduct({
        name: nombre,
        price_clp: Number(precio),
        stock: Number(stock),
        category: categoria,
        supplier: proveedor || null, // Si no hay proveedor, se envía null
      });
      alert("Producto creado exitosamente.");
      // Redirigir a la página de gestión de productos después de crear el producto
      navigate({ to: "/inventario/productos" });
    } catch (e) {
      alert(`No se pudo crear el producto. Motivo: ${e || "Error desconocido"}`);
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
      <FormControl>
        <FormLabel>Nombre del Producto</FormLabel>
        <Input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Añadir Nombre del producto" />
      </FormControl>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <FormControl sx={{ flex: 1 }}>
          <FormLabel>Precio (CLP$)</FormLabel>
          <Input value={precio} onChange={e => setPrecio(e.target.value)} placeholder="Añadir Precio" type="number" />
        </FormControl>
        <FormControl sx={{ flex: 1 }}>
          <FormLabel>Stock</FormLabel>
          <Input value={stock} onChange={e => setStock(e.target.value)} placeholder="Añadir Cantidad" type="number" />
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
      <FormControl>
        <FormLabel>Proveedor</FormLabel>
        <Select value={proveedor} onChange={(_, v) => setProveedor(v ?? "")}>
          <Option value="">Ninguno</Option>
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
