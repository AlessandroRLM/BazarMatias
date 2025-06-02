import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "@tanstack/react-router";
import {  
  Stack, 
  Typography,
  Button,
  CircularProgress,
  Alert,
  Box
} from "@mui/joy";
import Information from "../../components/core/Information/Information";
import dayjs from "dayjs";
import { fetchReturnDetails, Return } from "../../services/returnService";

export default function ReturnView() {
  const { id } = useParams({ from: '/_auth/ventas/gestiondeventas/ver-devolucion/$id' });
  
  const { data: returnData, isLoading, error } = useQuery<Return>({
    queryKey: ['return', id],
    queryFn: () => fetchReturnDetails(id),

    onSuccess: (data) => console.log('Datos recibidos:', data),
    onError: (err) => console.error('Error fetching return:', err)
  });
  if (!id) {
    return (
      <Alert color="danger">
        No se ha proporcionado un ID de devolución válido
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !returnData) {
    return (
      <Alert color="danger">
        Error al cargar los detalles de la devolución
      </Alert>
    );
  }

  return (
    <Information
      title="Detalles de Devolución"
      sectionTitle="Información de la Devolución"
      footerContent={
        <Button 
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          component={Link}
          onClick={() => window.history.back()}
          variant="outlined"
          color="primary"
          
        >
          Volver
        </Button>
      }
    >
      <Stack spacing={3}>
        {/* Client information */}
        <Stack spacing={1}>
          <Typography level="title-md">Cliente</Typography>
          <Typography>
            {returnData.client.first_name} {returnData.client.last_name}
          </Typography>
          <Typography level="body-sm">
            {returnData.client.national_id}
          </Typography>
        </Stack>

        {/* Product information */}
        <Stack spacing={1}>
          <Typography level="title-md">Producto</Typography>
          <Typography>{returnData.product.name}</Typography>
          {returnData.product.sku && (
            <Typography level="body-sm">SKU: {returnData.product.sku}</Typography>
          )}
        </Stack>

        {/* Return details */}
        <Stack direction="row" spacing={2}>
          <Stack spacing={1} sx={{ width: '50%' }}>
            <Typography level="title-md">Cantidad</Typography>
            <Typography>{returnData.quantity}</Typography>
          </Stack>
          <Stack spacing={1} sx={{ width: '50%' }}>
            <Typography level="title-md">Estado</Typography>
            <Typography color={returnData.status === 'completed' ? 'success' : 'warning'}>
              {returnData.status === 'completed' ? 'Completado' : 'Pendiente'}
            </Typography>
          </Stack>
        </Stack>

        <Stack spacing={1}>
          <Typography level="title-md">Motivo</Typography>
          <Typography>{returnData.reason}</Typography>
        </Stack>

        <Stack spacing={1}>
          <Typography level="title-md">Fecha de Devolución</Typography>
          <Typography>
            {dayjs(returnData.created_at).format('DD/MM/YYYY HH:mm')}
          </Typography>
        </Stack>

        {/* Original sale information */}
        <Typography level="title-lg">Información de la Venta Original</Typography>
        <Stack direction="row" spacing={2}>
          <Stack spacing={1} sx={{ width: '50%' }}>
            <Typography level="title-md">Número de Venta</Typography>
            <Typography>#{returnData.sale.folio}</Typography>
          </Stack>
          <Stack spacing={1} sx={{ width: '50%' }}>
            <Typography level="title-md">Fecha de Venta</Typography>
            <Typography>
              {dayjs(returnData.sale.created_at).format('DD/MM/YYYY HH:mm')}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Information>
  );
}