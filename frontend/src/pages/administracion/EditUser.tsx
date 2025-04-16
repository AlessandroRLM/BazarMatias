import { Route } from '../../routes/_auth/administracion/usuarios/editar-usuario.$rut';
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import AxiosInstance from "../../helpers/AxiosInstance";
import HeaderUserCreation from "../../components/administracion/HeaderUserCreation/HeaderUserCreation";
import FormUserCreation from "../../components/administracion/FormUserCreation/FormUserCreation";
import CommonPageLayout from "../../components/layout/components/CommonPageLayout";
import { Typography, Box, Avatar } from "@mui/joy";

const EditUser = () => {
  const { rut } = Route.useParams();
  const [initialValues, setInitialValues] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // <-- Agrega esto

  useEffect(() => {
    AxiosInstance.get(`/api/users/${rut}/`)
      .then(res => {
        const data = res.data;
        setInitialValues({
          name: data.first_name,
          lastName: data.last_name,
          rut: data.national_id,
          email: data.email,
          role: data.position,
        });
      })
      .finally(() => setLoading(false));
  }, [rut]);

  const handleSubmitForm = async (formData: any) => {
    try {
      await AxiosInstance.put(`/api/users/${rut}/`, {
        first_name: formData.name,
        last_name: formData.lastName,
        national_id: formData.rut,
        email: formData.email,
        position: formData.role,
      });
      alert("Usuario actualizado con éxito!");
      navigate({ to: "/administracion/usuarios/" });
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw error;
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (!initialValues) return <div>No encontrado</div>;

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
        mode="edit"
        disableRole={true}
        disableRut={false}
        initialValues={initialValues}
      />
    </CommonPageLayout>
  );
};

export default EditUser;