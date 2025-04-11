import { createFileRoute } from '@tanstack/react-router';
import UserManagementPage from '../../../pages/administracion/UserManagementPage';
import UserCreation from '../../../pages/administracion/UserCreation';

export const Route = createFileRoute('/administracion/usuarios/')({
  component: UserManagementComponent,
  children: [
    {
      path: '/administracion/crear-usuario',
      component: UserCreation,
    },
  ],
});

function UserManagementComponent() {
  return <UserManagementPage />;
}
