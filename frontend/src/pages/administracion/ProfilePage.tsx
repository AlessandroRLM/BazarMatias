import { useEffect, useState } from "react";
import AxiosInstance from "../../helpers/AxiosInstance";
import FormUserCreation from "../../components/administracion/FormUserCreation/FormUserCreation";
import useUserProfileFormContext from "../../hooks/administracion/useUserProfileFormContext";
import ChangePasswordForm from "../../components/administracion/ChangePasswordForm/ChangePasswordForm";
import HeaderUserCreation from "../../components/layout/components/Header";
import CommonPageLayout from "../../components/layout/components/CommonPageLayout";
import { Typography, Avatar, Box } from "@mui/joy";

const ProfilePage = () => {
  const { isProfile, isChangePassword, setIsProfile, setIsChangePassword, setIsEditMode, isEditMode } =
    useUserProfileFormContext();

  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    AxiosInstance.get("/api/users/me/")
      .then(res => setProfileData(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleProfileSubmit = async (formData: any) => {
    try {
      await AxiosInstance.put(`/api/users/${profileData.national_id}/`, {
        first_name: formData.name,
        last_name: formData.lastName,
        email: formData.email,
      });
      setSubmitSuccess(true);
      setTimeout(() => {
        setIsEditMode(false);
        setSubmitSuccess(false);
      }, 1500);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      throw error;
    }
  };

  const menuItems = [
    {
      label: isEditMode ? "Ver Perfil" : "Editar Perfil",
      onClick: () => {
        setIsChangePassword(false);
        setIsProfile(true);
        setIsEditMode(!isEditMode);
      },
    },
    {
      label: "Cambiar Contraseña",
      onClick: () => {
        setIsProfile(false);
        setIsChangePassword(true);
        setIsEditMode(false);
      },
    },
  ];

  if (loading) return <div>Cargando...</div>;
  if (!profileData) return <div>No se pudo cargar el perfil</div>;

  return (
    <CommonPageLayout>
      <HeaderUserCreation
        title={<Typography level="h2" component="h1">Perfil de Usuario</Typography>}
        showMenu={true}
        menuItems={menuItems}
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
      
      {isProfile && (
        <FormUserCreation 
          mode={isEditMode ? "edit" : "view"}
          disableRole={false}
          disableRut={true}
          onSubmitForm={handleProfileSubmit}
          initialValues={{
            name: profileData.first_name,
            lastName: profileData.last_name,
            rut: profileData.national_id,
            email: profileData.email,
            role: profileData.position,
          }}
          successMessage="¡Perfil actualizado con éxito!"
          submitSuccessExternal={submitSuccess}
          onSuccessReset={() => setSubmitSuccess(false)}
          onSuccess={() => setIsEditMode(false)}
          onCancel={() => setIsEditMode(false)}
        />
      )}
      
      {isChangePassword && (
        <ChangePasswordForm 
          onSuccess={() => {
            setIsChangePassword(false);
            setIsProfile(true);
          }} 
        />
      )}
    </CommonPageLayout>
  );
};

export default ProfilePage;