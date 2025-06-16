import { z } from 'zod'
import { fallback } from '@tanstack/zod-adapter'

export const productsSearchSchema = z.object({
    category: fallback(z.string(), '').optional(),
    search: fallback(z.string(), '').optional(),
    ordering: fallback(z.enum(['name', '-name', 'price_clp', '-price_clp', 'stock', '-stock']), 'name').optional(),
    page: fallback(z.number(), 1).optional(),
    page_size: fallback(z.number(), 10).optional(),
})

export type ProductsSearchType = z.infer<typeof productsSearchSchema>
