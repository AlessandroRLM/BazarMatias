import {
  Box,
  Typography,
  Paper,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button
} from '@mui/material';

const SalesView = ({ venta }: { venta: any }) => {
  const { cliente, metodoPago, productosAgregados, fecha, numeroVenta } = venta;

  const subtotal = productosAgregados.reduce((sum: number, p: any) => sum + (p.precio * p.cantidad), 0);
  const iva = subtotal * 0.19;
  const total = subtotal + iva;

  return (
    <Box sx={{ p: 3, position: 'relative', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        Visualizar Venta
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Información de venta</Typography>
        <Typography><strong>Número de Venta:</strong> {numeroVenta}</Typography>
        <Typography><strong>Fecha de Venta:</strong> {fecha}</Typography>
        <Typography><strong>Cliente:</strong> {cliente?.nombre}</Typography>
        <Typography><strong>Método de Pago:</strong> {metodoPago}</Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
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
            {productosAgregados.map((p: any, idx: number) => (
              <TableRow key={idx}>
                <TableCell>{p.nombre}</TableCell>
                <TableCell align="center">{p.cantidad}</TableCell>
                <TableCell align="right">${p.precio.toLocaleString()}</TableCell>
                <TableCell align="right">${(p.precio * p.cantidad).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Resumen</Typography>
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
      </Paper>

      <Box sx={{ position: 'fixed', bottom: 24, right: 24 }}>
        <Button variant="contained" color="primary" onClick={() => window.history.back()}>
          Volver
        </Button>
      </Box>
    </Box>
  );
};

export default SalesView;
