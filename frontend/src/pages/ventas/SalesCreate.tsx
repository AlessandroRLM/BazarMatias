import React, { useState } from 'react';
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
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  CreditCard as CreditCardIcon,
  LocalOffer as LocalOfferIcon,
  Close as CloseIcon,
  Check as CheckIcon
} from '@mui/icons-material';

const AgregarVenta = () => {

  const [cliente, setCliente] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [producto, setProducto] = useState('');
  const [cantidad, setCantidad] = useState(0);
  const [productosAgregados, setProductosAgregados] = useState<any[]>([]);


  const clientes = [
    { id: '1', nombre: 'Cliente Corporativo S.A.', rut: '12345678-9' },
    { id: '2', nombre: 'Empresa Ejemplo Ltda.', rut: '98765432-1' }
  ];

  const metodos = ['Efectivo', 'Tarjeta de Crédito', 'Transferencia Bancaria'];
  
  const productos = [
    { id: '1', nombre: 'Producto Premium', precio: 19990 },
    { id: '2', nombre: 'Producto Estándar', precio: 12990 },
    { id: '3', nombre: 'Producto Básico', precio: 7990 }
  ];

  const subtotal = productosAgregados.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  const handleAgregarProducto = () => {
    if (producto && cantidad > 0) {
      const prodSeleccionado = productos.find(p => p.id === producto);
      if (prodSeleccionado) {
        setProductosAgregados([...productosAgregados, {
          ...prodSeleccionado,
          cantidad: cantidad,
          subtotal: prodSeleccionado.precio * cantidad
        }]);
        setProducto('');
        setCantidad(0);
      }
    }
  };


  const handleEliminarProducto = (id: string) => {
    setProductosAgregados(productosAgregados.filter(p => p.id !== id));
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
                  value="def59070-d416-4c39-a2b2-e86d020..."
                  fullWidth
                  size="small"
                  InputProps={{ 
                    readOnly: true,
                  }}
                />
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
                  onChange={(e) => setCliente(e.target.value)}
                  fullWidth
                  size="small"
                  displayEmpty
                  startAdornment={
                    <InputAdornment position="start">
                      <PersonIcon fontSize="small" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">Seleccionar cliente...</MenuItem>
                  {clientes.map((c) => (
                    <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>
                  ))}
                </Select>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>Método de Pago</Typography>
                <Select
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                  fullWidth
                  size="small"
                  displayEmpty
                  startAdornment={
                    <InputAdornment position="start">
                      <CreditCardIcon fontSize="small" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="">Seleccionar método de pago...</MenuItem>
                  {metodos.map((m, i) => (
                    <MenuItem key={i} value={m}>{m}</MenuItem>
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
                    onChange={(e) => setProducto(e.target.value)}
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
                    {productos.map((p) => (
                      <MenuItem key={p.id} value={p.id}>{p.nombre} - ${p.precio.toLocaleString()}</MenuItem>
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
                startIcon={<CheckIcon />}
                fullWidth
                disabled={productosAgregados.length === 0 || !cliente || !metodoPago}
                sx={{
                py: 1.5,
                fontSize: '1rem'
                }}
            >
                Finalizar Venta
            </Button>
            
            <Button 
                variant="outlined" 
                color="inherit"
                startIcon={<CloseIcon />}
                fullWidth
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
                  {clientes.find(c => c.id === cliente)?.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  RUT: {clientes.find(c => c.id === cliente)?.rut}
                </Typography>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', py: 1 }}>
                <PersonIcon fontSize="large" color="disabled" sx={{ mb: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  No hay cliente seleccionado
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  12345678-9
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default AgregarVenta;