import { Route } from '../../routes/_auth/ventas/gestiondeclientes/ver-cliente.$id';
import { useEffect, useState } from 'react';
import CommonPageLayout from '../../components/core/layout/components/CommonPageLayout';
import HeaderUserCreation from "../../components/administracion/ProfileHeader/ProfileHeader";
import { Typography, Avatar, Box, CircularProgress } from "@mui/joy";
import { fetchClient } from '../../services/salesService';
import { Client } from '../../types/sales.types';
import FormUserCreation from "../../components/clientes/FormClientCreation";

const ClientView = () => {
  const params = Route.useParams();
  const id = params.id;
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadClient = async () => {
      try {
        const clientData = await fetchClient(id);
        setClient(clientData);
      } catch (error) {
        console.error("Error loading client:", error);
        setClient(null);
      } finally {
        setLoading(false);
      }
    };

    loadClient();
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
          {client.first_name.charAt(0)}
        </Avatar>
      </Box>
      
      {/* Usamos el mismo componente FormUserCreation en modo visualización */}
      <FormUserCreation 
        mode="view"
        initialValues={{
          rut: client.national_id,
          name: client.first_name,
          lastName: client.last_name,
          email: client.email || '',
          phone: client.phone_number || ''
        }}
        onSubmitForm={() => Promise.resolve()} // No-op para modo visualización
        onSuccess={() => {}} // No-op para modo visualización
      />
    </CommonPageLayout>
  );
};

export default ClientView;