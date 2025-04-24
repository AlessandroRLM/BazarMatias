import { useState } from "react";
import AxiosInstance from "../../helpers/AxiosInstance";
import FormUserCreation from "../../components/administracion/FormUserCreation/FormUserCreation";
import useUserProfileFormContext from "../../hooks/administracion/useUserProfileFormContext";
import ChangePasswordForm from "../../components/administracion/ChangePasswordForm/ChangePasswordForm";
import HeaderUserCreation from "../../components/core/layout/components/Header";
import CommonPageLayout from "../../components/core/layout/components/CommonPageLayout";
import { Typography, Avatar, Box } from "@mui/joy";
import { useAuth } from "../../hooks/auth/useAuth";

const ProfilePage = () => {
  const { isProfile, isChangePassword, setIsProfile, setIsChangePassword, setIsEditMode, isEditMode } =
    useUserProfileFormContext();

  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {user} = useAuth();
  const handleProfileSubmit = async (formData: any) => {
    try {
      await AxiosInstance.put(`/api/users/${user?.national_id}/`, {
        first_name: formData.name,
        last_name: formData.lastName,
        national_id: formData.rut,
        email: formData.email,
        position: formData.role
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
          disableRole={true}
          disableRut={true}
          onSubmitForm={handleProfileSubmit}
          initialValues={{
            name: user?.first_name,
            lastName: user?.last_name,
            rut: user?.national_id,
            email: user?.email,
            role: user?.position,
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