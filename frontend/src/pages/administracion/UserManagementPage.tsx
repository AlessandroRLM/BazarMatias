import BasePageLayout from '../../components/layout/components/BasePageLayout';
import Button from '@mui/joy/Button';
import { Link } from '@tanstack/react-router';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import OrderTable from '../../components/administracion/UserManagementOrder/OrderTable';
import OrderList from '../../components/administracion/UserManagementOrder/OrderList';

export default function UserManagementPage() {
  return (
    <BasePageLayout
      title="Lista de Usuarios"
      actionButton={
        <Button
          color="primary"
          startDecorator={<PersonAddRoundedIcon />}
          size="sm"
          component={Link}
          to="/_auth/administracion/usuarios/crear-usuario"
        >
          Añadir Usuario
        </Button>
      }
    >
      <OrderTable />
      <OrderList />
    </BasePageLayout>
  );
}