import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, Link } from "@tanstack/react-router";
import { 
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Option,
  Stack,
  Typography,
  Alert,
  CircularProgress
} from "@mui/joy";
import Information from "../../components/core/Information/Information";
import dayjs from "dayjs";
import { 
  fetchReturnDetails, 
  updateReturn,
  Return
} from "../../services/returnService";

export default function ReturnEdit() {
  const { id } = useParams({ from: '/_auth/ventas/gestiondeventas/editar-devolucion/$id' });
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  
  // Fetch return details
  const { data: returnData, isLoading } = useQuery<Return>({
    queryKey: ['return', id],
    queryFn: () => fetchReturnDetails(id),

    enabled: !!id, // Solo ejecuta la query si hay un ID
    onError: (error) => console.error('Error loading return:', error)
  });

  const [form, setForm] = useState({
    quantity: "1",
    reason: "",
    status: 'pending' as 'pending' | 'completed'
  });

  useEffect(() => {
    if (returnData) {
      setForm({
        quantity: returnData.quantity.toString(),
        reason: returnData.reason,
        status: returnData.status
      });
    }
  }, [returnData]);

  // Update return mutation
  const updateMutation = useMutation({
    mutationFn: (data: any) => updateReturn(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['return', id]);
      queryClient.invalidateQueries(['returns']);
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Error al actualizar la devolución');
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
            to={`/ventas/gestiondedevoluciones/ver-devolucion/${id}`}
            fullWidth
            disabled={updateMutation.isLoading}
          >
            Cancelar
          </Button>
          <Button 
            variant="solid" 
            color="primary"
            fullWidth
            onClick={handleSubmit}
            loading={updateMutation.isLoading}
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
            endDecorator={returnData.product.sku && (
              <Typography level="body-sm">SKU: {returnData.product.sku}</Typography>
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
              onChange={(e) => handleChange("quantity", e.target.value)}
              slotProps={{ input: { min: 1 } }}
            />
          </FormControl>
          <FormControl sx={{ width: '50%' }}>
            <FormLabel>Estado *</FormLabel>
            <Select
              value={form.status}
              onChange={(_, value) => handleChange("status", value as string)}
            >
              <Option value="pending">Pendiente</Option>
              <Option value="completed">Completado</Option>
            </Select>
          </FormControl>
        </Stack>

        {/* Reason */}
        <FormControl>
          <FormLabel>Motivo *</FormLabel>
          <Input
            value={form.reason}
            onChange={(e) => handleChange("reason", e.target.value)}
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
              value={dayjs(returnData.sale.created_at).format('DD/MM/YYYY')}
              readOnly
            />
          </FormControl>
        </Stack>
      </Stack>
    </Information>
  );
}