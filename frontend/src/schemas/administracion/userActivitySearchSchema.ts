import { z } from 'zod'
import { fallback } from '@tanstack/zod-adapter'

export const userActivitySearchSchema = z.object({
    user: fallback(z.string(), '').optional(),
    action_type: fallback(z.enum(['CREATE', 'VIEW', 'UPDATE', 'DELETE', 'LOGOUT', 'LOGIN', 'OTHER']), 'CREATE').optional(),
    date__range: fallback(z.string(), '').optional(),
    ordering: fallback(z.enum(['timestamp', '-timestamp', 'user', '-user', 'action_type', '-action_type']), '-timestamp').optional(),
    search: fallback(z.string(), '').optional(),
    page: fallback(z.number(), 1).optional(),
    page_size: fallback(z.number(), 10).optional(),
})

export type userActivitySearchType = z.infer<typeof userActivitySearchSchema>
