import { Box, Avatar } from "@mui/joy";
import HeaderUserCreation from "../../components/administracion/HeaderUserCreation/HeaderUserCreation";
import FormUserCreation from "../../components/administracion/FormUserCreation/FormUserCreation";
import CommonPageLayout from "../../components/layout/components/CommonPageLayout";
import { Typography } from "@mui/joy";

const EditUser = () => {
  // Función para manejar la actualización del usuario
  const handleSubmitForm = async (formData: any) => {
    try {
      console.log("Datos actualizados:", formData);
      // Aquí va tu lógica para actualizar el usuario
      // Ejemplo:
      // const response = await api.updateUser(formData);
      // console.log("Usuario actualizado:", response);
      
      alert("Usuario actualizado con éxito!");
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw error; // Esto activará el manejo de errores en FormUserCreation
    }
  };

  // Datos iniciales del usuario (deberías obtenerlos de tu API/estado)
  const initialValues = {
    name: "Nombre del Usuario",
    lastName: "Apellido del Usuario",
    rut: "12345678-9",
    email: "usuario@ejemplo.com",
    role: "Admin"
  };

  return (
    <CommonPageLayout>
      <HeaderUserCreation
        title={<Typography level="h2" component="h1">Editar Usuario</Typography>}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          padding: 0,
        }}
      >
        <Avatar variant="soft" color="primary" size="profile"></Avatar>
      </Box>
      <FormUserCreation 
       onSubmitForm={handleSubmitForm}
       mode="edit"       // Usamos el nuevo prop 'mode' en lugar de 'isEditMode'
       disableRole={false} // Habilita selección de rol
       disableRut={false}  // Habilita edición de RUT
      />
    </CommonPageLayout>
  );
};

export default EditUser;