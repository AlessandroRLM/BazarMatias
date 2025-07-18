import { createFileRoute } from '@tanstack/react-router';
import EditUser from '../../../../pages/administracion/users/EditUser';

export const Route = createFileRoute('/_auth/administracion/usuarios/editar-usuario/$rut')({
  component: EditUserPage,
});

function EditUserPage() {
  return <EditUser />;
}