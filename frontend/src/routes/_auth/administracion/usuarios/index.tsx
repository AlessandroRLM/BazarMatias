import { createFileRoute } from '@tanstack/react-router';
import UserManagementPage from '../../../../pages/administracion/users/UserManagementPage';


export const Route = createFileRoute('/_auth/administracion/usuarios/')({
  component: UserManagementPage,
});
