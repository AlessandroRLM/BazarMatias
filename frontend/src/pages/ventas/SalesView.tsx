import { useState, useEffect } from 'react';
import { useParams } from '@tanstack/react-router';
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
  Button,
  CircularProgress
} from '@mui/material';
import { fetchSaleById } from '../../services/salesService';
import { Sale } from '../../types/sales.types';

const SalesView = () => {
  const { id } = useParams({ from: '/_auth/ventas/gestiondeventas/ver-venta/$id' });
  const [venta, setVenta] = useState<Sale | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVenta = async () => {
      try {
        const data = await fetchSaleById(id);
        setVenta(data);
      } catch (error) {
        console.error('Error al cargar la venta:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVenta();
  }, [id]);

  if (loading) {
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
    <Box sx={{ p: 3, position: 'relative', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        Visualizar Venta
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Información de venta</Typography>
        <Typography><strong>Número de Venta:</strong> {venta.folio}</Typography>
        <Typography><strong>Fecha de Venta:</strong> {new Date(venta.created_at).toLocaleDateString()}</Typography>
        <Typography><strong>Cliente:</strong> {venta.client ? `${venta.client.first_name} ${venta.client.last_name}` : 'Sin cliente'}</Typography>
        <Typography><strong>Método de Pago:</strong> {venta.payment_method}</Typography>
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
            {venta.details.map((detail) => (
              <TableRow key={detail.id}>
                <TableCell>{detail.product.name}</TableCell>
                <TableCell align="center">{detail.quantity}</TableCell>
                <TableCell align="right">${detail.unit_price.toLocaleString()}</TableCell>
                <TableCell align="right">${(detail.unit_price * detail.quantity).toLocaleString()}</TableCell>
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