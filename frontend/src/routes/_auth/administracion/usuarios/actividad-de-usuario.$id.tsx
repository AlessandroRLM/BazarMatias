import { createFileRoute } from '@tanstack/react-router'
import { queryClient } from '../../../../App'
import { userActivityDetailQueryOptions } from '../../../../utils/administracion/administracionQueryOptions'
import UserActivityDetailPage from '../../../../pages/administracion/userActivities/UserActivityDetailPage'

export const Route = createFileRoute(
  '/_auth/administracion/usuarios/actividad-de-usuario/$id',
)({
  component: UserActivityDetailPage,
  loader: ({params: {id}}) => {
    return queryClient.ensureQueryData(userActivityDetailQueryOptions(id))
  }
})


