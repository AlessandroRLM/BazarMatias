import { createFileRoute } from '@tanstack/react-router';
import UserManagementPage from '../../../../pages/administracion/UserManagementPage';

function UserManagementComponent() {
  return <UserManagementPage />;
}

export const Route = createFileRoute('/_auth/administracion/usuarios/')({
  component: UserManagementComponent,
});
