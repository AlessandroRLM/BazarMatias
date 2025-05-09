import { z } from 'zod'
import { fallback } from '@tanstack/zod-adapter'


export const buyOrderSearchSchema = z.object({
    status: fallback(z.string(), '').optional(),
    search: fallback(z.string(), '').optional(),
    ordering: fallback(z.enum(['status', '-status', 'created_at', '-created_at', 'supplier', '-supplier']), 'created_at').optional(),
    page: fallback(z.number(), 1).optional(),
    page_size: fallback(z.number(), 10).optional(),
})

export type BuyOrderSearchType = z.infer<typeof buyOrderSearchSchema>
