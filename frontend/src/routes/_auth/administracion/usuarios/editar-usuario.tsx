import { createFileRoute } from '@tanstack/react-router';
import EditUser from '../../../../pages/administracion/EditUser';

export const Route = createFileRoute('/_auth/administracion/usuarios/editar-usuario')({
  component: EditUserPage,
});

function EditUserPage() {
  return <EditUser />;
}