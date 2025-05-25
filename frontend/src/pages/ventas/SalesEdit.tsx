import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Divider,
  Button,
  TextField,
  Select,
  MenuItem,
  IconButton,
  CircularProgress,
  InputAdornment
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, Delete as DeleteIcon, LocalOffer as LocalOfferIcon } from '@mui/icons-material';
import { fetchSaleById, updateSale } from '../../services/salesService';
import { fetchClients } from '../../services/salesService';
import { fetchProducts } from '../../services/inventoryService';
import { Sale, Client } from '../../types/sales.types';
import { Product } from '../../types/inventory.types';

const SalesEdit = () => {
  const { id } = useParams({ from: '/_auth/ventas/gestiondeventas/editar-venta/$id' });
  const navigate = useNavigate();
  const [venta, setVenta] = useState<Sale | null>(null);
  const [clientes, setClientes] = useState<Client[]>([]);
  const [productosDisponibles, setProductosDisponibles] = useState<Product[]>([]);
  const [nuevoProducto, setNuevoProducto] = useState<string>('');
  const [nuevaCantidad, setNuevaCantidad] = useState<number>(1);
  const [loading, setLoading] = useState({
    venta: true,
    clientes: true,
    productos: true
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ventaData, clientesData, productosData] = await Promise.all([
          fetchSaleById(id),
          fetchClients({ page_size: 100 }),
          fetchProducts({ page_size: 100 })
        ]);

        setVenta(ventaData);
        setClientes(clientesData.results);
        setProductosDisponibles(productosData.results);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading({ venta: false, clientes: false, productos: false });
      }
    };

    loadData();
  }, [id]);

  const handleSave = async () => {
    if (!venta) return;

    try {
      await updateSale(id, venta);
      navigate({ to: '/ventas/gestiondeventas' });
    } catch (error) {
      console.error('Error al actualizar la venta:', error);
    }
  };

  const handleAgregarProducto = () => {
    if (!nuevoProducto || nuevaCantidad <= 0 || !venta) return;

    const productoSeleccionado = productosDisponibles.find(p => p.id === nuevoProducto);
    if (!productoSeleccionado) return;

    setVenta({
      ...venta,
      details: [
        ...venta.details,
        {
          id: `temp-${Date.now()}`,
          product: productoSeleccionado,
          quantity: nuevaCantidad,
          unit_price: productoSeleccionado.price_clp,
          discount: 0
        }
      ]
    });

    // Resetear selección
    setNuevoProducto('');
    setNuevaCantidad(1);
  };

  const handleIncrementarCantidad = (detailId: string) => {
    if (!venta) return;

    setVenta({
      ...venta,
      details: venta.details.map(detail => 
        detail.id === detailId 
          ? { ...detail, quantity: detail.quantity + 1 }
          : detail
      )
    });
  };

  const handleDecrementarCantidad = (detailId: string) => {
    if (!venta) return;

    setVenta({
      ...venta,
      details: venta.details.map(detail => 
        detail.id === detailId 
          ? { ...detail, quantity: Math.max(1, detail.quantity - 1) }
          : detail
      )
    });
  };

  const handleCambiarPrecio = (detailId: string, nuevoPrecio: number) => {
    if (!venta) return;

    setVenta({
      ...venta,
      details: venta.details.map(detail => 
        detail.id === detailId 
          ? { ...detail, unit_price: Math.max(0, nuevoPrecio) }
          : detail
      )
    });
  };

  const handleEliminarProducto = (detailId: string) => {
    if (!venta) return;

    setVenta({
      ...venta,
      details: venta.details.filter(detail => detail.id !== detailId)
    });
  };

  if (loading.venta || loading.clientes || loading.productos) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!venta) {
    return <Typography>No se encontró la venta</Typography>;
  }

  const subtotal = venta.details.reduce((sum, detail) => sum + (detail.unit_price * detail.quantity), 0);
  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', p: 3, position: 'relative' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        Editar Venta
      </Typography>

      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ flex: 2 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Información de venta</Typography>

            <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2">Número de Venta</Typography>
                <Typography sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  {venta.folio}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2">Fecha de Venta</Typography>
                <Typography sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  {new Date(venta.created_at).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2">Cliente</Typography>
                <Select
                  value={venta.client?.id || ''}
                  onChange={(e) => setVenta({
                    ...venta,
                    client: clientes.find(c => c.id === e.target.value) || null
                  })}
                  fullWidth
                >
                  {clientes.map((cliente) => (
                    <MenuItem key={cliente.id} value={cliente.id}>
                      {cliente.first_name} {cliente.last_name}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2">Método de Pago</Typography>
                <Select
                  value={venta.payment_method}
                  onChange={(e) => setVenta({ ...venta, payment_method: e.target.value })}
                  fullWidth
                >
                  <MenuItem value="EF">Efectivo</MenuItem>
                  <MenuItem value="TC">Tarjeta de Crédito</MenuItem>
                  <MenuItem value="TD">Tarjeta de Débito</MenuItem>
                  <MenuItem value="TR">Transferencia</MenuItem>
                  <MenuItem value="OT">Otro</MenuItem>
                </Select>
              </Box>
            </Box>

            <Typography variant="h6" sx={{ mb: 2 }}>Productos</Typography>
            
            {/* Formulario para agregar nuevos productos */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
              <Box sx={{ flex: 1 }}>
                <Select
                  value={nuevoProducto}
                  onChange={(e) => setNuevoProducto(e.target.value)}
                  fullWidth
                  size="small"
                  displayEmpty
                  startAdornment={
                    <InputAdornment position="start">
                      <LocalOfferIcon fontSize="small" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">Selecciona un producto</MenuItem>
                  {productosDisponibles.map((producto) => (
                    <MenuItem key={producto.id} value={producto.id}>
                      {producto.name} - ${producto.price_clp.toLocaleString()}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton 
                  size="small" 
                  onClick={() => setNuevaCantidad(Math.max(1, nuevaCantidad - 1))}
                  disabled={nuevaCantidad <= 1}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <TextField
                  value={nuevaCantidad}
                  onChange={(e) => setNuevaCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                  type="number"
                  inputProps={{ min: 1 }}
                  size="small"
                  sx={{ width: 80, textAlign: 'center' }}
                />
                <IconButton 
                  size="small" 
                  onClick={() => setNuevaCantidad(nuevaCantidad + 1)}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
              
              <Button 
                variant="contained" 
                onClick={handleAgregarProducto}
                disabled={!nuevoProducto}
                sx={{ width: 150 }}
              >
                Agregar
              </Button>
            </Box>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell align="center">Cantidad</TableCell>
                  <TableCell align="right">Precio Unitario</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {venta.details.map((detail) => (
                  <TableRow key={detail.id}>
                    <TableCell>{detail.product.name}</TableCell>
                    <TableCell align="center">
                      <IconButton 
                        size="small" 
                        onClick={() => handleDecrementarCantidad(detail.id)}
                        disabled={detail.quantity <= 1}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      {detail.quantity}
                      <IconButton 
                        size="small" 
                        onClick={() => handleIncrementarCantidad(detail.id)}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        value={detail.unit_price}
                        onChange={(e) => handleCambiarPrecio(detail.id, parseFloat(e.target.value) || 0)}
                        size="small"
                        type="number"
                        sx={{ width: 100 }}
                        inputProps={{ min: 0, step: "any" }}
                      />
                    </TableCell>
                    <TableCell align="right">${(detail.unit_price * detail.quantity).toLocaleString()}</TableCell>
                    <TableCell align="center">
                      <IconButton 
                        size="small" 
                        onClick={() => handleEliminarProducto(detail.id)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Resumen de venta</Typography>
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>Subtotal:</Typography>
                <Typography>${subtotal.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography>IVA (19%):</Typography>
                <Typography>${iva.toLocaleString()}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography fontWeight="bold">Total:</Typography>
                <Typography fontWeight="bold">${total.toLocaleString()}</Typography>
              </Box>
            </Box>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>Cliente seleccionado</Typography>
            <Box>
              {venta.client ? (
                <>
                  <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 1 }}>
                    {venta.client.first_name} {venta.client.last_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    RUT: {venta.client.formatted_rut || venta.client.national_id}
                  </Typography>
                </>
              ) : (
                <Typography>Sin cliente</Typography>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>

      <Box sx={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', gap: 2 }}>
        <Button variant="outlined" onClick={() => navigate({ to: '/ventas/gestiondeventas' })}>
          Cancelar
        </Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Guardar Cambios
        </Button>
      </Box>
    </Box>
  );
};

export default SalesEdit;