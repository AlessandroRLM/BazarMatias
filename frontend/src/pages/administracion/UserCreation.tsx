import { Box, Avatar } from "@mui/joy";
import HeaderUserCreation from "../../components/administracion/HeaderUserCreation/HeaderUserCreation";
import FormUserCreation from "../../components/administracion/FormUserCreation/FormUserCreation";
import CommonPageLayout from "../../components/layout/components/CommonPageLayout";
import { Typography } from "@mui/joy";

const UserCreation = () => {
  const handleSubmitForm = async (formData: any) => {
    try {
      console.log("Datos del formulario:", formData);
      alert("Usuario creado con éxito!");
    } catch (error) {
      console.error("Error al crear usuario:", error);
      throw error;
    }
  };

  return (
    <CommonPageLayout>
      <HeaderUserCreation
        title={<Typography level="h2" component="h1">Crear Nuevo Usuario</Typography>}
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
        <Avatar variant="soft" color="primary" size="profile"></Avatar>
      </Box>
      <FormUserCreation 
        onSubmitForm={handleSubmitForm}
        mode="create"       // Usamos el nuevo prop 'mode' en lugar de 'isEditMode'
        disableRole={false} // Habilita selección de rol
        disableRut={false}  // Habilita edición de RUT
      />
    </CommonPageLayout>
  );
};

export default UserCreation;