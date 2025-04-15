import FormUserCreation from "../../components/administracion/FormUserCreation/FormUserCreation";
import useUserProfileFormContext from "../../hooks/administracion/useUserProfileFormContext";
import ChangePasswordForm from "../../components/administracion/ChangePasswordForm/ChangePasswordForm";
import CommonPageLayout from "../../components/layout/components/CommonPageLayout";
import HeaderUserCreation from "../../components/administracion/HeaderUserCreation/HeaderUserCreation";
import GenericFormContainer from "../../components/administracion/GenericFormContainer/GenericFormContainer";
import { Typography } from "@mui/joy";

const ProfilePage = () => {
  const { isProfile, isChangePassword, setIsProfile, setIsChangePassword, setIsEditMode, isEditMode } =
    useUserProfileFormContext();

  const handleProfileSubmit = async (formData: any) => {
    try {
      console.log("Datos del perfil:", formData);
      // Lógica para actualizar el perfil
      setIsEditMode(false);
      alert("Perfil actualizado con éxito!");
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
      <GenericFormContainer avatarText="AA">
      {isProfile && (
        <FormUserCreation 
          mode={isEditMode ? "edit" : "view"} // Mantienes la lógica original
          disableRole={true}
          disableRut={true}
          onSubmitForm={handleProfileSubmit}
        />
      )}
        {isChangePassword && <ChangePasswordForm />}
      </GenericFormContainer>
    </CommonPageLayout>
  );
};

export default ProfilePage;