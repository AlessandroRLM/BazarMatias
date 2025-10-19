import { createFileRoute } from '@tanstack/react-router';
import UserManagementPage from '../../../../pages/administracion/users/UserManagementPage';
import { zodValidator } from '@tanstack/zod-adapter';
import { userSearchSchema } from '../../../../schemas/administracion/userSearchSchema';
import { queryClient } from '../../../../App';
import { usersQueryOptions } from '../../../../utils/administracion/administracionQueryOptions';


export const Route = createFileRoute('/_auth/administracion/usuarios/')({
  validateSearch: zodValidator(userSearchSchema),
  loaderDeps: ({search}) => search,
  loader: ({deps}) => queryClient.prefetchQuery(usersQueryOptions(deps)),
  component: UserManagementPage,
});
