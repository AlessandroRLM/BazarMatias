import { Box, Avatar, Typography } from "@mui/joy";
import HeaderUserCreation from "../../components/administracion/ProfileHeader/ProfileHeader";
import CommonPageLayout from "../../components/core/layout/components/CommonPageLayout";
import FormUserCreation from "../../components/clientes/FormClientCreation";
import { useNavigate } from "@tanstack/react-router";

const ClientCreatePage = () => {
  const navigate = useNavigate();

  const handleSubmitForm = async (data: any) => {
    // Simulación de envío de datos
    console.log("Datos del cliente a crear:", data);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log("Cliente creado exitosamente (simulado)");
        resolve();
      }, 1500);
    });
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