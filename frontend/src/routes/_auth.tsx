import { createFileRoute, redirect } from '@tanstack/react-router'
import layout from '../components/core/layout/layout'

export const Route = createFileRoute('/_auth')({
    beforeLoad: ({context, location}) => {
        if(!context.auth.isAuthenticated) {
            throw redirect({
                to: '/login',
                search: {
                    redirect: location.href,
                },
            })
        }
    },
    component: layout,
})

