import { Box, Avatar } from "@mui/joy";
import HeaderUserCreation from "../../components/administracion/ProfileHeader/ProfileHeader";
import FormUserCreation from "../../components/administracion/FormUserCreation/FormUserCreation";
import CommonPageLayout from "../../components/core/layout/components/CommonPageLayout";
import { Typography } from "@mui/joy";
import { createUser } from "../../services/userService";
import { useNavigate } from "@tanstack/react-router";

const UserCreation = () => {
  const navigate = useNavigate();

  const handleSubmitForm = async (formData: any) => {
    try {
      // Preparar datos para el backend
      const userData = {
        national_id: formData.rut,
        first_name: formData.name,
        last_name: formData.lastName,
        email: formData.email,
        position: formData.role,
      };

      await createUser(userData);
      
      // Redirigir usando @tanstack/react-router
      navigate({
        to: "/administracion/usuarios",
        search: { success: "Usuario creado con éxito" },
      });
      
    } catch (error: any) {
      console.error("Error al crear usuario:", error);
      
      let errorMessage = "Error al crear usuario";
      if (error.response?.data) {
        // Manejar errores de validación del backend
        errorMessage = Object.entries(error.response.data)
          .map(([field, errors]) => `${field}: ${(errors as string[]).join(', ')}`)
          .join('\n');
      }
      
      throw new Error(errorMessage);
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
        mode="create"
        disableRole={false}
        disableRut={false}
      />
    </CommonPageLayout>
  );
};

export default UserCreation;