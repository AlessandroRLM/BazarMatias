import { Box, Avatar, Typography } from "@mui/joy";
import HeaderUserCreation from "../../../components/administracion/ProfileHeader/ProfileHeader";
import CommonPageLayout from "../../../components/core/layout/components/CommonPageLayout";
import FormUserCreation from "../../../components/clientes/FormClientCreation";
import { useNavigate } from "@tanstack/react-router";
import { createClient } from "../../../services/salesService";
import { Client } from "../../../types/sales.types";

interface FormClientData {
  rut: string;
  name: string;
  lastName: string;
  email?: string;
  phone?: string;
}

const ClientCreatePage = () => {
  const navigate = useNavigate();

  const handleSubmitForm = async (formData: FormClientData) => {
    try {
      // Creamos el objeto cliente con todos los campos requeridos
      const clientData: Omit<Client, 'id'> = {
        national_id: formData.rut,
        first_name: formData.name,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phone,
      };

      await createClient(clientData);
      return Promise.resolve();
    } catch (error) {
      console.error("Error creating client:", error);
      return Promise.reject(error);
    }
  };

  const handleSuccess = () => {
    navigate({ to: "/ventas/gestiondeclientes" });
  };

  return (
    <CommonPageLayout>
      <HeaderUserCreation
        title={<Typography level="h2" component="h1">Crear Nuevo Cliente</Typography>}
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
          CL
        </Avatar>
      </Box>
      <FormUserCreation 
        onSubmitForm={handleSubmitForm}
        onSuccess={handleSuccess}
        mode="create"
        successMessage="¡Cliente creado con éxito!"
      />
    </CommonPageLayout>
  );
};

export default ClientCreatePage;