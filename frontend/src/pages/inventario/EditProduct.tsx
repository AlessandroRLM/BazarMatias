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
import Information from "../../components/core/Information/Information";
import { useEffect, useState } from "react";
import { fetchProduct, updateProduct, fetchSuppliers, fetchSupplier } from "../../services/inventoryService";
import { useNavigate, useParams } from "@tanstack/react-router";

export default function EditarProducto() {
  const { id } = useParams({ strict: false });
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [minStock, setMinStock] = useState(""); // Nuevo estado
  const [categoria, setCategoria] = useState("");
  const [proveedor, setProveedor] = useState<string | null>(null);
  const [proveedorNombre, setProveedorNombre] = useState(""); // Nombre del proveedor actual
  const [proveedores, setProveedores] = useState([]); // Lista de proveedores
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    // Obtener el producto
    fetchProduct(id).then(producto => {
      setNombre(producto.name ?? "");
      setPrecio(producto.price_clp ?? "");
      setStock(producto.stock ?? "");
      setMinStock(producto.min_stock ?? ""); // Cargar min_stock
      setCategoria(producto.category ?? "");
      setProveedor(producto.supplier ?? ""); // Cargar el ID del proveedor actual

      // Si hay un supplier, obtener el nombre del proveedor
      if (producto.supplier) {
        fetchSupplier(producto.supplier).then(supplier => {
          setProveedorNombre(supplier.name);
        });
      }
    });

    // Obtener la lista de proveedores al cargar el componente
    fetchSuppliers().then(data => setProveedores(data.results || []));
  }, [id]);

  const handleSubmit = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      await updateProduct(id, {
        name: nombre,
        price_clp: Number(precio),
        stock: Number(stock),
        min_stock: Number(minStock),
        category: categoria,
        supplier: proveedor, // Now properly sends ID or null
      });
      navigate({ to: "/inventario/productos" });
    } catch (e) {
      alert("Error al actualizar producto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Information
      title="Editar Producto"
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
        <FormControl sx={{ flex: 1 }}>
          <FormLabel>Stock Mínimo</FormLabel>
          <Input value={minStock} onChange={e => setMinStock(e.target.value)} placeholder="Stock mínimo" type="number" />
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
        <Select 
          value={proveedor} 
          onChange={(_, v) => setProveedor(v || null)}
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
