import { createFileRoute } from '@tanstack/react-router'
import DashboardAdministrationPage from '../../../pages/administracion/DashboardAdministrationPage'
import { administrationMetricsQueryOptions } from '../../../utils/administracion/administracionQueryOptions'
import { queryClient } from '../../../App'

export const Route = createFileRoute('/_auth/administracion/dashboard')({
  loader: () => queryClient.prefetchQuery(administrationMetricsQueryOptions()),
  component: DashboardAdministrationPage,
})

