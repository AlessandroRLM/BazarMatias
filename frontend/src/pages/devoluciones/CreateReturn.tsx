import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Option,
  Typography,
  Grid
} from "@mui/joy";
import { useEffect, useState } from "react";
import { createReturnSupplier, fetchSuppliers, fetchProducts } from "../../services/inventoryService";
import { useNavigate } from "@tanstack/react-router";

export default function ReturnCreate() {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [supplier, setSupplier] = useState("");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [productCondition, setProductCondition] = useState("");
  const [reason, setReason] = useState("");
  const [purchaseNumber, setPurchaseNumber] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split('T')[0]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuppliers().then(data => setSuppliers(data.results || []));
    fetchProducts().then(data => setProducts(data.results || []));
  }, []);

  const handleSubmit = async () => {
    const returnData = {
      supplier,
      product,
      quantity: Number(quantity),
      product_condition: productCondition,
      reason,
      purchase_number: purchaseNumber,
      purchase_date: purchaseDate,
      return_date: returnDate,
    };

    try {
      await createReturnSupplier(returnData);
      alert("Devolución creada exitosamente");
      navigate({ to: "/proveedores/devoluciones" });
    } catch (error) {
      alert("Error al crear la devolución");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography level="h2" sx={{ mb: 3 }}>Añadir</Typography>

      <Box sx={{ 
        border: '1px solid', 
        borderColor: 'divider', 
        borderRadius: 'sm',
        p: 3,
        mb: 3
      }}>
        <Typography level="h4" sx={{ mb: 3 }}>Información del Producto</Typography>

        <FormControl sx={{ mb: 3 }}>
          <FormLabel>Nombre del Proveedor</FormLabel>
          <Select
            value={supplier}
            onChange={(_, value) => setSupplier(value ?? "")}
            placeholder="Seleccione proveedor"
            fullWidth
            required
          >
            {suppliers.map(s => (
              <Option key={s.id} value={s.id}>{s.name}</Option>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ mb: 3 }}>
          <FormLabel>Nombre del Producto</FormLabel>
          <Select
            value={product}
            onChange={(_, value) => setProduct(value ?? "")}
            placeholder="Seleccione producto"
            fullWidth
            required
          >
            {products.map(p => (
              <Option key={p.id} value={p.id}>{p.name}</Option>
            ))}
          </Select>
        </FormControl>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid xs={6}>
            <FormControl>
              <FormLabel>Cantidad</FormLabel>
              <Input
                type="number"
                placeholder="0"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
              />
            </FormControl>
          </Grid>
          <Grid xs={6}>
            <FormControl>
              <FormLabel>Estado del Producto</FormLabel>
              <Select
                value={productCondition}
                onChange={(_, value) => setProductCondition(value ?? "")}
                placeholder="Seleccione estado"
              >
                <Option value="Nuevo">Nuevo</Option>
                <Option value="Usado">Usado</Option>
                <Option value="Defectuoso">Defectuoso</Option>
                <Option value="Dañado">Dañado</Option>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid xs={6}>
            <FormControl>
              <FormLabel>Motivo</FormLabel>
              <Input 
                placeholder="Describa el motivo de la devolución" 
                multiline 
                minRows={3} 
                value={reason}
                onChange={e => setReason(e.target.value)}
              />
            </FormControl>
          </Grid>
          <Grid xs={6}>
            <FormControl >
              <FormLabel>Fecha de Devolución</FormLabel>
              <Input 
                type="date"
                value={returnDate}
                onChange={e => setReturnDate(e.target.value)}
              />
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid xs={6}>
            <FormControl >
              <FormLabel>Número de Compra</FormLabel>
              <Input
                placeholder="Ingrese número de compra"
                value={purchaseNumber}
                onChange={e => setPurchaseNumber(e.target.value)}
              />
            </FormControl>
          </Grid>
          <Grid xs={6}>
            <FormControl >
              <FormLabel>Fecha de Compra</FormLabel>
              <Input
                type="date"
                value={purchaseDate}
                onChange={e => setPurchaseDate(e.target.value)}
              />
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ 
        mt: 3, 
        display: 'flex', 
        justifyContent: 'flex-end',
        gap: 2
      }}>
        <Button 
          variant="outlined" 
          color="neutral"
          onClick={() => window.history.back()}
          sx={{ width: 150 }}
        >
          Cancelar
        </Button>
        <Button 
          variant="solid" 
          color="primary"
          sx={{ width: 150 }}
          onClick={handleSubmit}
        >
          Añadir Devolución
        </Button>
      </Box>
    </Box>
  );
}