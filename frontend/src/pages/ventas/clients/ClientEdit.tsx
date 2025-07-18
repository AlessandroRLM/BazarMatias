import { Route } from '../../../routes/_auth/ventas/gestiondeclientes/editar-cliente.$id';
import { useEffect, useState } from 'react';
import CommonPageLayout from '../../../components/core/layout/components/CommonPageLayout';
import HeaderUserCreation from '../../../components/administracion/ProfileHeader/ProfileHeader';
import { Typography, Avatar, Box, CircularProgress } from "@mui/joy";
import { useNavigate } from '@tanstack/react-router';
import FormClientCreation from '../../../components/clientes/FormClientCreation';
import { fetchClient, updateClient } from '../../../services/salesService';
import { Client } from '../../../types/sales.types';

const ClientEdit = () => {
  const params = Route.useParams();
  const id = params.id;
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const navigate = useNavigate();

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

  const handleSubmit = async (formData: any) => {
    try {
      await updateClient(id, {
        first_name: formData.name,
        last_name: formData.lastName,
        national_id: formData.rut,
        email: formData.email,
        phone_number: formData.phone
      });
      
      setSubmitSuccess(true);
      
      setTimeout(() => {
        navigate({ to: `/ventas/gestiondeclientes` });
      }, 1500);
      
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      throw error;
    }
  };

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
        title={<Typography level="h2" component="h1">Editar Cliente</Typography>}
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
      
      <FormClientCreation 
        mode="edit"
        initialValues={{
          name: client.first_name,
          lastName: client.last_name,
          rut: client.national_id,
          email: client.email || '',
          phone: client.phone_number || '',
        }}
        onSubmitForm={handleSubmit}
        submitSuccessExternal={submitSuccess}
        onSuccessReset={() => setSubmitSuccess(false)}
        onCancel={() => navigate({ to: `/ventas/gestiondeclientes` })}
        successMessage="Cliente actualizado con éxito"
      />
    </CommonPageLayout>
  );
};

export default ClientEdit;