import { Route } from '../../routes/_auth/administracion/usuarios/ver-usuario.$rut';
import { useEffect, useState } from 'react';
import AxiosInstance from '../../helpers/AxiosInstance';
import UserViewForm from '../../components/administracion/UserViewForm/UserViewForm';
import CommonPageLayout from '../../components/core/layout/components/CommonPageLayout';
import HeaderUserCreation from '../../components/core/layout/components/Header';
import { Typography, Avatar, Box} from "@mui/joy";
import { User } from '../../types/auth.types';

const UserViewPage = () => {
  const { rut } = Route.useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AxiosInstance.get(`/api/users/users/${rut}/`)
      .then(res => {
        const data = res.data;
        setUser({
          firstName: data.first_name,
          lastName: data.last_name,
          nationalId: data.national_id,
          email: data.email,
          position: data.position,
          isStaff: data.is_staff,
          isSuperuser: data.is_superuser,
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
      <UserViewForm user={user} />

    </CommonPageLayout>
  );
};

export default UserViewPage;