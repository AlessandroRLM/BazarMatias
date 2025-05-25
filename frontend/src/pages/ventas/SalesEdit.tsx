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
  Button
} from '@mui/material';

const SalesEdit = () => {
  const cliente = { id: '1', nombre: 'Cliente Corporativo S.A.', rut: '12345678-9' };
  const metodoPago = 'Tarjeta de Crédito';

  const productosAgregados = [
    { id: '1', nombre: 'Producto Premium', precio: 19990, cantidad: 2 },
    { id: '2', nombre: 'Producto Estándar', precio: 12990, cantidad: 1 }
  ];

  const subtotal = productosAgregados.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', p: 3, position: 'relative' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        Visualizar Venta
      </Typography>

      <Box sx={{ display: 'flex', gap: 3 }}>
        <Box sx={{ flex: 2 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>Información de venta</Typography>

            <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2">Número de Venta</Typography>
                <Typography sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  def59070-d416-4c39-a2b2-e86d020...
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2">Fecha de Venta</Typography>
                <Typography sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  {new Date().toLocaleDateString()}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2">Cliente</Typography>
                <Typography sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  {cliente.nombre}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2">Método de Pago</Typography>
                <Typography sx={{ p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  {metodoPago}
                </Typography>
              </Box>
            </Box>

            <Typography variant="h6" sx={{ mb: 2 }}>Productos</Typography>

            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Producto</TableCell>
                  <TableCell align="center">Cantidad</TableCell>
                  <TableCell align="right">Precio Unitario</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productosAgregados.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.nombre}</TableCell>
                    <TableCell align="center">{p.cantidad}</TableCell>
                    <TableCell align="right">${p.precio.toLocaleString()}</TableCell>
                    <TableCell align="right">${(p.precio * p.cantidad).toLocaleString()}</TableCell>
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
              <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 1 }}>
                {cliente.nombre}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                RUT: {cliente.rut}
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>

      <Box sx={{ position: 'fixed', bottom: 24, right: 24 }}>
        <Button variant="contained" color="primary" onClick={() => window.history.back()}>
          Volver
        </Button>
      </Box>
    </Box>
  );
};

export default SalesEdit;
