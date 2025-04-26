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
import { fetchProduct, updateProduct, fetchSuppliers, fetchSupplier } from "../../services/inventoryService"; // Asegúrate de importar fetchSupplier
import { useNavigate, useParams } from "@tanstack/react-router";

export default function EditarProducto() {
  const { id } = useParams({ strict: false });
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [categoria, setCategoria] = useState("");
  const [proveedor, setProveedor] = useState(""); // ID del proveedor actual
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
      setCategoria(producto.category ?? "");
      setProveedor(producto.supplier_id ?? ""); // Cargar el ID del proveedor actual

      // Si hay un supplier_id, obtener el nombre del proveedor
      if (producto.supplier_id) {
        fetchSupplier(producto.supplier_id).then(supplier => {
          setProveedorNombre(supplier.name);
        });
      }
    });

    // Obtener la lista de proveedores
    fetchSuppliers().then(data => setProveedores(data));
  }, [id]);

  const handleSubmit = async () => {
    if (!id) {
      alert("ID del producto no encontrado.");
      return;
    }
    setLoading(true);
    try {
      await updateProduct(id, {
        name: nombre,
        price_clp: Number(precio),
        stock: Number(stock),
        category: categoria,
        supplier_id: proveedor || null,
      });
      navigate({ to: "/Inventory/productos" });
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
        <Select value={proveedor} onChange={(_, v) => setProveedor(v ?? "")} placeholder={proveedorNombre || "Nombre del proveedor"}>
          <Option value="">Ninguno</Option>
          {proveedores.map(proveedor => (
            <Option key={proveedor.id} value={proveedor.id}>
              {proveedor.name}
            </Option>
          ))}
        </Select>
      </FormControl>
    </Information>
  );
}
