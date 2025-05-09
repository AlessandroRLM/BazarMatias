import { z } from 'zod'
import { fallback } from '@tanstack/zod-adapter'

export const supplierSearchSchema = z.object({
    category: fallback(z.string(), '').optional(),
    search: fallback(z.string(), '').optional(),
    ordering: fallback(z.enum(['name', '-name', 'rut', '-rut']), 'name').optional(),
    page: fallback(z.number(), 1).optional(),
    page_size: fallback(z.number(), 10).optional(),
})

export type SupplierSearchType = z.infer<typeof supplierSearchSchema>
