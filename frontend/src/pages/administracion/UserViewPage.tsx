import UserViewForm from "../../components/administracion/UserViewForm/UserViewForm";
import CommonPageLayout from "../../components/layout/components/CommonPageLayout";
import HeaderUserCreation from "../../components/administracion/HeaderUserCreation/HeaderUserCreation";
import GenericFormContainer from "../../components/administracion/GenericFormContainer/GenericFormContainer";
import { Typography } from "@mui/joy";

const UserViewPage = () => {
  return (
    <CommonPageLayout>
    <HeaderUserCreation
      title={<Typography level="h2" component="h1">Ver Usuario</Typography>}
    />
      <GenericFormContainer avatarText="VU">
        <UserViewForm />
      </GenericFormContainer>
    </CommonPageLayout>
  );
};

export default UserViewPage;