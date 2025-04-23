import { createFileRoute } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { userActivitySearchSchema } from '../../../../schemas/administracion/userActivitySearchSchema'
import { queryClient } from '../../../../App'
import { userActivityQueryOptions } from '../../../../utils/administracion/administracionQueryOptions'
import UserActivityPage from '../../../../pages/administracion/UserActivityPage'

export const Route = createFileRoute('/_auth/administracion/usuarios/actividad-de-usuarios')({
  validateSearch: zodValidator(userActivitySearchSchema),
  loaderDeps: ({search}) => search,
  loader: ({deps}) => queryClient.prefetchQuery(userActivityQueryOptions(deps)),
  component: UserActivityPage,
})


