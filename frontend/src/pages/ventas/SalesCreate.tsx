import React, { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Paper,
  Divider,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  CreditCard as CreditCardIcon,
  LocalOffer as LocalOfferIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  Receipt as ReceiptIcon
} from '@mui/icons-material';
import { fetchClients, createSale, getNextSaleFolio } from '../../services/salesService';
import { fetchProducts } from '../../services/inventoryService';
import { Client, DocumentType, PaymentMethod, CreateSaleData } from '../../types/sales.types';
import { Product } from '../../types/inventory.types';

const SalesCreate = () => {
  const navigate = useNavigate({ from: '/ventas/gestiondeventas/añadir-venta' });
  const [cliente, setCliente] = useState<string>('');
  const [metodoPago, setMetodoPago] = useState<PaymentMethod>('EF');
  const [producto, setProducto] = useState<string>('');
  const [cantidad, setCantidad] = useState<number>(0);
  const [productosAgregados, setProductosAgregados] = useState<{
    id: string;
    nombre: string;
    precio: number;
    cantidad: number;
    subtotal: number;
  }[]>([]);
  const [clientes, setClientes] = useState<Client[]>([]);
  const [productos, setProductos] = useState<Product[]>([]);
  const [loading, setLoading] = useState({
    clients: false,
    products: false,
    folio: false
  });
  const [folio, setFolio] = useState<string>('Generando...');
  const [tipoDocumento, setTipoDocumento] = useState<DocumentType>('FAC');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const metodosPago: PaymentMethod[] = ['EF', 'TC', 'TD', 'TR', 'OT'];
  const metodosPagoLabels = {
    'EF': 'Efectivo',
    'TC': 'Tarjeta de Crédito',
    'TD': 'Tarjeta de Débito',
    'TR': 'Transferencia',
    'OT': 'Otro'
  };

  // Obtener datos iniciales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Obtener folio inicial
        setLoading(prev => ({ ...prev, folio: true }));
        const nextFolio = await getNextSaleFolio(tipoDocumento);
        setFolio(`#${nextFolio}`);

        // Obtener clientes
        setLoading(prev => ({ ...prev, clients: true }));
        const clientsData = await fetchClients({ page_size: 100 });
        setClientes(clientsData.results);

        // Obtener productos
        setLoading(prev => ({ ...prev, products: true }));
        const productsData = await fetchProducts({ page_size: 100 });
        setProductos(productsData.results);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setFolio('Error al generar');
      } finally {
        setLoading(prev => ({ ...prev, clients: false, products: false, folio: false }));
      }
    };

    fetchInitialData();
  }, []);

  // Actualizar folio cuando cambia el tipo de documento
  useEffect(() => {
    const updateFolio = async () => {
      try {
        setLoading(prev => ({ ...prev, folio: true }));
        const nextFolio = await getNextSaleFolio(tipoDocumento);
        setFolio(`#${nextFolio}`);
      } catch (error) {
        console.error('Error al actualizar folio:', error);
        setFolio('Error al generar');
      } finally {
        setLoading(prev => ({ ...prev, folio: false }));
      }
    };

    if (tipoDocumento) {
      updateFolio();
    }
  }, [tipoDocumento]);

  // Calcular totales
  const subtotal = productosAgregados.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  const handleAgregarProducto = () => {
    if (producto && cantidad > 0) {
      const prodSeleccionado = productos.find(p => p.id === producto);
      if (prodSeleccionado) {
        setProductosAgregados([...productosAgregados, {
          id: prodSeleccionado.id,
          nombre: prodSeleccionado.name,
          precio: prodSeleccionado.price_clp,
          cantidad: cantidad,
          subtotal: prodSeleccionado.price_clp * cantidad
        }]);
        setProducto('');
        setCantidad(0);
      }
    }
  };

  const handleEliminarProducto = (id: string) => {
    setProductosAgregados(productosAgregados.filter(p => p.id !== id));
  };

  const handleFinalizarVenta = async () => {
    if (isSubmitting || productosAgregados.length === 0 || !cliente) return;

    try {
      setIsSubmitting(true);
      
      const saleData: CreateSaleData = {
        document_type: tipoDocumento,
        client: cliente, // Solo el ID
        payment_method: metodoPago,
        details: productosAgregados.map(p => ({
          product: p.id, // Solo el ID
          quantity: p.cantidad,
          unit_price: p.precio,
          discount: 0
        })),
        net_amount: subtotal,
        iva: iva,
        total_amount: total
      };

      const newSale = await createSale(saleData);
      console.log('Venta creada:', newSale);
      
      // Resetear el formulario y redirigir
      setProductosAgregados([]);
      setCliente('');
      navigate({ to: '/ventas/gestiondeventas' });
    } catch (error) {
      console.error('Error al crear la venta:', error);
      alert('Error al crear la venta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelar = () => {
    navigate({ to: '/ventas/gestiondeventas' });
  };

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      p: 3,
    }}>
      <Typography variant="h4" sx={{ 
        fontWeight: 'bold',
        mb: 3,
        color: 'text.primary'
      }}>
        Añadir Venta
      </Typography>

      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ flex: 2 }}>
          <Paper sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'medium' }}>
              Información de venta
            </Typography>

            <Box sx={{ 
              display: 'flex', 
              gap: 3, 
              mb: 3,
              '& .MuiTextField-root': {
                bgcolor: '#f9f9f9',
                '& .MuiInputBase-root': {
                  pointerEvents: 'none'
                }
              }
            }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>Número de Venta</Typography>
                <TextField
                  value={loading.folio ? 'Cargando...' : folio}
                  fullWidth
                  size="small"
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <ReceiptIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>Tipo de Documento</Typography>
                <Select
                  value={tipoDocumento}
                  onChange={(e) => setTipoDocumento(e.target.value as DocumentType)}
                  fullWidth
                  size="small"
                >
                  <MenuItem value="FAC">Factura</MenuItem>
                  <MenuItem value="BOL">Boleta</MenuItem>
                </Select>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>Fecha de Venta</Typography>
                <TextField
                  value={new Date().toLocaleDateString()}
                  fullWidth
                  size="small"
                  InputProps={{ 
                    readOnly: true,
                  }}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>Cliente</Typography>
                <Select
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value as string)}
                  fullWidth
                  size="small"
                  displayEmpty
                  disabled={loading.clients}
                  startAdornment={
                    <InputAdornment position="start">
                      <PersonIcon fontSize="small" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">Seleccionar cliente...</MenuItem>
                  {clientes.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.first_name} {c.last_name} - {c.formatted_rut || c.national_id}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>Método de Pago</Typography>
                <Select
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value as PaymentMethod)}
                  fullWidth
                  size="small"
                  displayEmpty
                  startAdornment={
                    <InputAdornment position="start">
                      <CreditCardIcon fontSize="small" />
                    </InputAdornment>
                  }
                >
                  {metodosPago.map((m) => (
                    <MenuItem key={m} value={m}>
                      {metodosPagoLabels[m]}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </Box>

            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
                Productos
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 3, alignItems: 'center' }}>
                <Box sx={{ flex: 1 }}>
                  <Select
                    value={producto}
                    onChange={(e) => setProducto(e.target.value as string)}
                    fullWidth
                    size="small"
                    displayEmpty
                    disabled={loading.products}
                    startAdornment={
                      <InputAdornment position="start">
                        <LocalOfferIcon fontSize="small" />
                      </InputAdornment>
                    }
                  >
                    <MenuItem value="">Selecciona un producto</MenuItem>
                    {productos.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.name} - ${p.price_clp.toLocaleString()}
                      </MenuItem>
                    ))}
                  </Select>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton 
                    size="small" 
                    onClick={() => setCantidad(Math.max(0, cantidad - 1))}
                    disabled={cantidad <= 0}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <TextField
                    value={cantidad}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setCantidad(Math.max(0, parseInt(e.target.value) || 0))
                    }
                    type="number"
                    inputProps={{ min: 0 }}
                    size="small"
                    sx={{ width: 80, textAlign: 'center' }}
                  />
                  <IconButton 
                    size="small" 
                    onClick={() => setCantidad(cantidad + 1)}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />}
                  onClick={handleAgregarProducto}
                  disabled={!producto || cantidad <= 0}
                  sx={{ width: 150 }}
                >
                  Agregar
                </Button>
              </Box>

              {productosAgregados.length > 0 ? (
                <Box sx={{ overflow: 'auto' }}>
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
                      {productosAgregados.map((p) => (
                        <TableRow key={`${p.id}-${p.cantidad}`} hover>
                          <TableCell>{p.nombre}</TableCell>
                          <TableCell align="center">{p.cantidad}</TableCell>
                          <TableCell align="right">${p.precio.toLocaleString()}</TableCell>
                          <TableCell align="right">${(p.precio * p.cantidad).toLocaleString()}</TableCell>
                          <TableCell align="center">
                            <IconButton 
                              size="small" 
                              onClick={() => handleEliminarProducto(p.id)}
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: '#fafafa',
                  borderRadius: 1,
                  height: 100,
                  mb: 2
                }}>
                  <Typography color="text.secondary">
                    No hay productos agregados
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>

        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
              Resumen de venta
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>${subtotal.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>IVA (19%):</Typography>
                <Typography>${iva.toLocaleString()}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography fontWeight="bold">Total:</Typography>
                <Typography fontWeight="bold">${total.toLocaleString()}</Typography>
              </Box>
            </Box>

            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              mt: 2
            }}>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={isSubmitting ? <CircularProgress size={20} /> : <CheckIcon />}
                fullWidth
                disabled={productosAgregados.length === 0 || !cliente || isSubmitting}
                onClick={handleFinalizarVenta}
                sx={{
                  py: 1.5,
                  fontSize: '1rem'
                }}
              >
                {isSubmitting ? 'Procesando...' : 'Finalizar Venta'}
              </Button>
              
              <Button 
                variant="outlined" 
                color="inherit"
                startIcon={<CloseIcon />}
                fullWidth
                onClick={handleCancelar}
                disabled={isSubmitting}
                sx={{
                  py: 1.5,
                  bgcolor: 'white',
                  '&:hover': {
                    bgcolor: '#f5f5f5'
                  }
                }}
              >
                Cancelar
              </Button>
            </Box>
          </Paper>

          <Paper sx={{ p: 3, bgcolor: 'background.paper' }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'medium' }}>
              Cliente seleccionado
            </Typography>
            
            {cliente ? (
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 1 }}>
                  {clientes.find(c => c.id === cliente)?.first_name} {clientes.find(c => c.id === cliente)?.last_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  RUT: {clientes.find(c => c.id === cliente)?.formatted_rut || clientes.find(c => c.id === cliente)?.national_id}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: {clientes.find(c => c.id === cliente)?.email || 'No registrado'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Teléfono: {clientes.find(c => c.id === cliente)?.phone_number || 'No registrado'}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 1 }}>
                <PersonIcon fontSize="large" color="disabled" sx={{ mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  No hay cliente seleccionado
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default SalesCreate;