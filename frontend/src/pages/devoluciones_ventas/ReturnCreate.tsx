import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { 
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Option,
  Stack,
  Grid,
  Alert,
  CircularProgress,
  Typography,
  Textarea
} from "@mui/joy";
import Information from "../../components/core/Information/Information";
import { 
  fetchClientsForSelect, 
  fetchClientSales,
  fetchSaleDetails,
  createReturn,
  Client,
  Sale,
  SaleDetail
} from "../../services/salesService";

export default function ReturnCreate() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    client_id: "",
    sale: "",
    product: "",
    quantity: "1",
    reason: "",
  });
  const [error, setError] = useState<string | null>(null);

  // Fetch clients
  const { data: clients = [], isLoading: isLoadingClients } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: () => fetchClientsForSelect('')
  });

  // Fetch client sales when client is selected
  const { data: sales = [], isLoading: isLoadingSales } = useQuery<Sale[]>({
    queryKey: ['sales', form.client_id],
    queryFn: () => form.client_id ? fetchClientSales(form.client_id) : [],
    enabled: !!form.client_id
  });

  // Fetch sale products when sale is selected
  const { data: saleDetails, isLoading: isLoadingProducts } = useQuery<SaleDetail[]>({
    queryKey: ['saleDetails', form.sale],
    queryFn: () => form.sale ? fetchSaleDetails(form.sale) : [],
    enabled: !!form.sale,
  });

  // Create return mutation
  const createMutation = useMutation({
    mutationFn: createReturn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['returns'] });
      navigate({ to: "/ventas/gestiondedevoluciones" });
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Error al crear la devolución');
    }
  });

  const handleChange = (field: string, value: string) => {
    setError(null);
    if (field === 'client_id') {
      setForm(prev => ({ ...prev, client_id: value, sale: "", product: "" }));
    } else if (field === 'sale') {
      setForm(prev => ({ ...prev, sale: value, product: "", quantity: "1" }));
    } else {
      setForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = () => {
    if (!form.client_id || !form.sale || !form.product || !form.quantity || !form.reason) {
      setError('Todos los campos son obligatorios');
      return;
    }

    if (parseInt(form.quantity) <= 0) {
      setError('La cantidad debe ser mayor a 0');
      return;
    }

    createMutation.mutate({
      client_id: form.client_id,
      sale_id: form.sale,
      product_id: form.product,
      quantity: parseInt(form.quantity),
      reason: form.reason
    });
  };

  // Calculate max quantity for selected product
  const maxQuantity = saleDetails?.find(
    (detail) => detail.product.id === form.product
  )?.quantity || 0;

  return (
    <Information
      title="Añadir Devolución"
      sectionTitle="Información del producto"
      footerContent={
        <Stack direction="row" spacing={2}>
          <Button 
            variant="outlined" 
            color="neutral"
            onClick={() => navigate({ to: "/ventas/gestiondedevoluciones" })}
            fullWidth
            disabled={createMutation.isPending}
          >
            Cancelar
          </Button>
          <Button 
            variant="solid" 
            color="primary"
            fullWidth
            onClick={handleSubmit}
            loading={createMutation.isPending}
          >
            Añadir
          </Button>
        </Stack>
      }
    >
      <Stack spacing={2}>
        {error && (
          <Alert color="danger" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Client and Sale selection */}
        <Grid container spacing={2}>
          <Grid xs={12}>
            <FormControl>
              <FormLabel>Nombre del cliente *</FormLabel>
              {/* @ts-expect-error */}
              <Select
                value={form.client_id}
                onChange={(_, value) => handleChange("client_id", value as string)}
                loadingIndicator={isLoadingClients ? <CircularProgress size="sm" /> : undefined}
              >
                {clients.map(client => (
                  <Option key={client.id} value={client.id}>
                    {`${client.first_name} ${client.last_name} (${client.national_id})`}
                  </Option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid xs={12}>
            <FormControl>
              <FormLabel>Venta asociada *</FormLabel>
              {/* @ts-expect-error */}
              <Select
                value={form.sale}
                onChange={(_, value) => handleChange("sale", value as string)}
                disabled={!form.client_id || isLoadingSales}
                loadingIndicator={isLoadingSales ? <CircularProgress size="sm" /> : undefined}
              >
                {sales.map(sale => (
                  <Option key={sale.id} value={sale.id}>
                    {`Venta #${sale.folio} - ${new Date(sale.created_at).toLocaleDateString()}`}
                  </Option>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Product and Quantity */}
        <Grid container spacing={2}>
          <Grid xs={8}>
            <FormControl>
              <FormLabel>Producto *</FormLabel>
              {/* @ts-expect-error */}
              <Select
                value={form.product}
                onChange={(_, value) => handleChange("product", value as string)}
                disabled={!form.sale || isLoadingProducts}
                loadingIndicator={isLoadingProducts ? <CircularProgress size="sm" /> : undefined}
              >
                {saleDetails?.map((detail) => (
                  <Option key={detail.product.id} value={detail.product.id}>
                    {`${detail.product.name} (Vendidos: ${detail.quantity})`}
                  </Option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid xs={4}>
            <FormControl>
              <FormLabel>Cantidad *</FormLabel>
              <Input
                type="number"
                value={form.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
                slotProps={{ 
                  input: { 
                    min: 1,
                    max: maxQuantity
                  } 
                }}
                disabled={!form.product}
              />
              {form.product && (
                <Typography level="body-xs" sx={{ mt: 1 }}>
                  Máximo devolvable: {maxQuantity}
                </Typography>
              )}
            </FormControl>
          </Grid>
        </Grid>

        {/* Reason */}
        <FormControl>
          <FormLabel>Motivo *</FormLabel>
          <Textarea
            value={form.reason}
            onChange={(e) => handleChange("reason", e.target.value)}
            minRows={3}
          />
        </FormControl>
      </Stack>
    </Information>
  );
}