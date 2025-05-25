import { Route } from '../../routes/_auth/ventas/gestiondeclientes/editar-cliente.$id';
import { useEffect, useState } from 'react';
import AxiosInstance from '../../helpers/AxiosInstance';
import CommonPageLayout from '../../components/core/layout/components/CommonPageLayout';
import HeaderUserCreation from '../../components/administracion/ProfileHeader/ProfileHeader';
import { Typography, Avatar, Box, CircularProgress } from "@mui/joy";
import { useNavigate } from '@tanstack/react-router';
import FormClientCreation from '../../components/clientes/FormClientCreation';

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

const ClientEdit = () => {
  const params = Route.useParams();
  const id = params.id;
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(false);
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

  const handleSubmit = async (formData: any) => {
    try {
      await AxiosInstance.put(`/api/clients/clients/${id}/`, {
        name: formData.name,
        last_name: formData.lastName,
        rut: formData.rut,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      });
      
      setSubmitSuccess(true);
      
      setTimeout(() => {
        navigate({ to: `/ventas/gestiondeclientes/${id}` });
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
          {client.name.charAt(0)}
        </Avatar>
      </Box>
      
      <FormClientCreation 
        mode="edit"
        initialValues={{
          name: client.name,
          lastName: client.lastName,
          rut: client.rut,
          email: client.email,
          phone: client.phone,
        }}
        onSubmitForm={handleSubmit}
        submitSuccessExternal={submitSuccess}
        onSuccessReset={() => setSubmitSuccess(false)}
        onCancel={() => navigate({ to: `/ventas/gestiondeclientes/${id}` })}
        successMessage="Cliente actualizado con éxito"
      />
    </CommonPageLayout>
  );
};

export default ClientEdit;