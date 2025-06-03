import { useState, useEffect, ChangeEvent } from "react";
import { useQuery, useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { useParams, Link } from "@tanstack/react-router";
import { 
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Option,
  Stack,
  Typography,
  Alert,
  CircularProgress,
  Box
} from "@mui/joy";
import Information from "../../components/core/Information/Information";
import dayjs from "dayjs";
import { 
  fetchReturn, 
  updateReturn,
} from "../../services/salesService";
import { Return } from "../../types/sales.types";

export default function ReturnEdit() {
  const { id } = useParams({ from: '/_auth/ventas/gestiondedevoluciones/editar-devolucion/$id' });
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  
  // Fetch return details
  const { data: returnData, isLoading } = useQuery<Return, Error>({
    queryKey: ['return', id],
    queryFn: () => fetchReturn(id),
    enabled: !!id,
    onError: (error: Error) => {
      console.error('Error loading return:', error);
      setError('Error al cargar la devolución');
    }
  } as UseQueryOptions<Return, Error>);

  const [form, setForm] = useState({
    quantity: "1",
    reason: "",
    status: 'pending' as 'pending' | 'completed' | 'refused'
  });

  useEffect(() => {
    if (returnData) {
      setForm({
        quantity: returnData.quantity.toString(),
        reason: returnData.reason,
        status: returnData.status || 'pending'
      });
    }
  }, [returnData]);

  // Update return mutation
  const updateMutation = useMutation({
    mutationFn: (data: { quantity: number; reason: string; status: 'pending' | 'completed' | 'refused' }) => 
      updateReturn(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['return', id] });
      queryClient.invalidateQueries({ queryKey: ['returns'] });
    },
    onError: (err: Error) => {
      setError(err.message || 'Error al actualizar la devolución');
    }
  });

  const handleChange = (field: string, value: string) => {
    setError(null);
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.quantity || !form.reason) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (parseInt(form.quantity) <= 0) {
      setError('La cantidad debe ser mayor a 0');
      return;
    }

    updateMutation.mutate({
      quantity: parseInt(form.quantity),
      reason: form.reason,
      status: form.status
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!returnData) {
    return (
      <Alert color="danger">
        No se pudo cargar la información de la devolución
      </Alert>
    );
  }

  return (
    <Information
      title="Editar Devolución"
      sectionTitle="Información de la Devolución"
      footerContent={
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            color="neutral"
            component={Link}
            to="/ventas/gestiondedevoluciones/"
            fullWidth
            disabled={updateMutation.isPending}
          >
            Cancelar
          </Button>
          <Button 
            variant="solid" 
            color="primary"
            fullWidth
            onClick={handleSubmit}
            loading={updateMutation.isPending}
            component={Link}
            to="/ventas/gestiondedevoluciones/"
          >
            Guardar Cambios
          </Button>
        </Stack>
      }
    >
      <Stack spacing={3}>
        {error && (
          <Alert color="danger" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Client information (readonly) */}
        <FormControl>
          <FormLabel>Cliente</FormLabel>
          <Input
            value={`${returnData.client.first_name} ${returnData.client.last_name} (${returnData.client.national_id})`}
            readOnly
          />
        </FormControl>

        {/* Product information (readonly) */}
        <FormControl>
          <FormLabel>Producto</FormLabel>
          <Input
            value={returnData.product.name}
            readOnly
            endDecorator={returnData.product.data?.sku && (
              <Typography level="body-sm">SKU: {returnData.product.data.sku}</Typography>
            )}
          />
        </FormControl>

        {/* Quantity and Status */}
        <Stack direction="row" spacing={2}>
          <FormControl sx={{ width: '50%' }}>
            <FormLabel>Cantidad *</FormLabel>
            <Input
              type="number"
              value={form.quantity}
              onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange("quantity", e.target.value)}
              slotProps={{ input: { min: 1 } }}
            />
          </FormControl>
          <FormControl sx={{ width: '50%' }}>
            <FormLabel>Estado *</FormLabel>
            <Select
              value={form.status}
              onChange={(_, value) => value && handleChange("status", value as string)}
            >
              <Option value="pending">Pendiente</Option>
              <Option value="completed">Completado</Option>
              <Option value="refused">Rechazado</Option>
            </Select>
          </FormControl>
        </Stack>

        {/* Reason */}
        <FormControl>
          <FormLabel>Motivo *</FormLabel>
          <Textarea
            value={form.reason}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange("reason", e.target.value)}
            minRows={3}
          />
        </FormControl>

        {/* Original sale information (readonly) */}
        <Typography level="title-md">Información de la Venta Original</Typography>
        <Stack direction="row" spacing={2}>
          <FormControl sx={{ width: '50%' }}>
            <FormLabel>Número de Venta</FormLabel>
            <Input
              value={`#${returnData.sale.folio}`}
              readOnly
            />
          </FormControl>
          <FormControl sx={{ width: '50%' }}>
            <FormLabel>Fecha de Venta</FormLabel>
            <Input
              value={dayjs(returnData.sale.date).format('DD/MM/YYYY')}
              readOnly
            />
          </FormControl>
        </Stack>
      </Stack>
    </Information>
  );
}