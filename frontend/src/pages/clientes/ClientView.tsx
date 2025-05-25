import { Route } from '../../routes/_auth/ventas/gestiondeclientes/ver-cliente.$id';
import { useEffect, useState } from 'react';
import AxiosInstance from '../../helpers/AxiosInstance';
import CommonPageLayout from '../../components/core/layout/components/CommonPageLayout';
import HeaderUserCreation from "../../components/administracion/ProfileHeader/ProfileHeader";
import { Typography, Avatar, Box, CircularProgress } from "@mui/joy";
import { useNavigate } from '@tanstack/react-router';

interface Client {
  id: string;
  name: string;
  lastName: string;
  rut: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

const ClientView = () => {
  const params = Route.useParams();
  const id = params.id;
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    AxiosInstance.get(`/api/clients/clients/${id}/`)
      .then(res => {
        const data = res.data;
        setClient({
          id: data.id,
          name: data.name,
          lastName: data.last_name,
          rut: data.rut,
          email: data.email,
          phone: data.phone,
          address: data.address,
          createdAt: data.created_at
        });
      })
      .catch(() => setClient(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <CommonPageLayout>
      <CircularProgress size="lg" />
    </CommonPageLayout>
  );

  if (!client) return (
    <CommonPageLayout>
      <Typography color="danger">Cliente no encontrado</Typography>
    </CommonPageLayout>
  );

  return (
    <CommonPageLayout>
      <HeaderUserCreation
        title={<Typography level="h2" component="h1">Detalles del Cliente</Typography>}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          padding: 2,
          marginBottom: 3
        }}
      >
        <Avatar variant="soft" color="primary" size="lg" sx={{ '--Avatar-size': '100px' }}>
          {client.name.charAt(0)}
        </Avatar>
      </Box>
      
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 3,
          p: 3,
          maxWidth: '1200px',
          mx: 'auto'
        }}
      >
        <DetailItem label="Nombre" value={client.name} />
        <DetailItem label="Apellido" value={client.lastName} />
        <DetailItem label="RUT" value={client.rut} />
        <DetailItem label="Correo Electrónico" value={client.email} />
        <DetailItem label="Teléfono" value={client.phone} />
        <DetailItem label="Dirección" value={client.address} />
        <DetailItem label="Fecha de Registro" value={new Date(client.createdAt).toLocaleDateString()} />
      </Box>
    </CommonPageLayout>
  );
};

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <Box>
    <Typography level="body-sm" color="neutral">{label}</Typography>
    <Typography level="title-lg" sx={{ mt: 0.5 }}>{value || '-'}</Typography>
  </Box>
);

export default ClientView;