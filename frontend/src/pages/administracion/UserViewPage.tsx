import { Route } from '../../routes/_auth/administracion/usuarios/ver-usuario.$rut';
import { useEffect, useState } from 'react';
import AxiosInstance from '../../helpers/AxiosInstance';
import UserViewForm from '../../components/administracion/UserViewForm/UserViewForm';
import CommonPageLayout from '../../components/layout/components/CommonPageLayout';
import HeaderUserCreation from '../../components/administracion/HeaderUserCreation/HeaderUserCreation';
import GenericFormContainer from '../../components/administracion/GenericFormContainer/GenericFormContainer';
import { Typography } from "@mui/joy";

const UserViewPage = () => {
  const { rut } = Route.useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AxiosInstance.get(`/api/users/${rut}/`)
      .then(res => {
        const data = res.data;
        setUser({
          name: data.first_name,
          lastName: data.last_name,
          rut: data.national_id,
          email: data.email,
          role: data.position,
        });
      })
      .finally(() => setLoading(false));
  }, [rut]);

  if (loading) return <div>Cargando...</div>;
  if (!user) return <div>No encontrado</div>;

  return (
    <CommonPageLayout>
      <HeaderUserCreation
        title={<Typography level="h2" component="h1">Ver Usuario</Typography>}
      />
      <GenericFormContainer avatarText="VU">
        <UserViewForm user={user} />
      </GenericFormContainer>
    </CommonPageLayout>
  );
};

export default UserViewPage;