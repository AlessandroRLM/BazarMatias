import FormUserCreation from "../../components/administracion/FormUserCreation/FormUserCreation";
import useUserProfileFormContext from "../../hooks/administracion/useUserProfileFormContext";
import ChangePasswordForm from "../../components/administracion/ChangePasswordForm/ChangePasswordForm";
import HeaderUserCreation from "../../components/layout/components/Header";
import CommonPageLayout from "../../components/layout/components/CommonPageLayout";
import { Typography, Avatar, Box} from "@mui/joy";

const ProfilePage = () => {
  const { isProfile, isChangePassword, setIsProfile, setIsChangePassword, setIsEditMode, isEditMode } =
    useUserProfileFormContext();

  const handleProfileSubmit = async (formData: any) => {
    try {
      console.log("Datos del perfil:", formData);
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
    <CommonPageLayout> {/* ← envuelve el contenido */}
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
          />
        )}
        {isChangePassword && <ChangePasswordForm />}
    </CommonPageLayout>
  );
};

export default ProfilePage;
