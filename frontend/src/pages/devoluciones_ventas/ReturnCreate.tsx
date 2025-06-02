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
  Typography
} from "@mui/joy";
import Information from "../../components/core/Information/Information";
import { 
  fetchClientsForSelect, 
  fetchClientSales,
  fetchSaleDetails,
  createReturn,
  Client,
  Sale,
  Product
} from "../../services/returnService";

export default function ReturnCreate() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    client: "",
    sale: "",
    product: "",
    quantity: "1",
    reason: "",
    returnDate: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState<string | null>(null);

  // Fetch clients
  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: () => fetchClientsForSelect('')
  });

  // Fetch client sales when client is selected
  const { data: sales = [], isLoading: isLoadingSales } = useQuery<Sale[]>({
    queryKey: ['sales', form.client],
    queryFn: () => form.client ? fetchClientSales(form.client) : [],
    enabled: !!form.client
  });

  // Fetch sale products when sale is selected
  const { data: saleDetails, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['saleDetails', form.sale],
    queryFn: () => form.sale ? fetchSaleDetails(form.sale) : null,
    enabled: !!form.sale,
  });

  // Create return mutation
  const createMutation = useMutation({
    mutationFn: createReturn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['return'] });
      navigate({ to: "/ventas/gestiondedevoluciones" });
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || 'Error al crear la devolución');
    }
  });

  const handleChange = (field: string, value: string) => {
    setError(null);
    if (field === 'client') {
      setForm(prev => ({ ...prev, client: value, sale: "", product: "" }));
    } else if (field === 'sale') {
      setForm(prev => ({ ...prev, sale: value, product: "", quantity: "1" }));
    } else {
      setForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = () => {
    if (!form.client || !form.sale || !form.product || !form.quantity) {
      setError('Todos los campos son obligatorios');
      return;
    }

    createMutation.mutate({
      client: form.client,
      sale: form.sale,
      product: form.product,
      quantity: parseInt(form.quantity),
      reason: form.reason
    });
  };

  // Calculate max quantity for selected product
  const maxQuantity = saleDetails?.find(
    (detail: any) => detail.product.id === form.product
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
              <Select
                value={form.client}
                onChange={(_, value) => handleChange("client", value as string)}
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
              <Select
                value={form.sale}
                onChange={(_, value) => handleChange("sale", value as string)}
                disabled={!form.client || isLoadingSales}
                loading={isLoadingSales}
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
              <Select
                value={form.product}
                onChange={(_, value) => handleChange("product", value as string)}
                disabled={!form.sale || isLoadingProducts}
                loading={isLoadingProducts}
              >
                {saleDetails?.map((detail: any) => (
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

        {/* Reason and Return Date */}
        <Grid container spacing={2}>
          <Grid xs={8}>
            <FormControl>
              <FormLabel>Motivo *</FormLabel>
              <Input
                value={form.reason}
                onChange={(e) => handleChange("reason", e.target.value)}
              />
            </FormControl>
          </Grid>
          <Grid xs={4}>
            <FormControl>
              <FormLabel>Fecha de devolución</FormLabel>
              <Input
                type="date"
                value={form.returnDate}
                onChange={(e) => handleChange("returnDate", e.target.value)}
              />
            </FormControl>
          </Grid>
        </Grid>
      </Stack>
    </Information>
  );
}