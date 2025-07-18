import { z } from 'zod'
import { fallback } from '@tanstack/zod-adapter'

export const returnSupplierSearchSchema = z.object({
    page: fallback(z.number(), 1).optional(),
    page_size: fallback(z.number(), 10).optional(),
    ordering: fallback(z.enum(['status', '-status', 'supplier__name', '-supplier__name', 'return_date', '-return_date', 'total_products', '-total_products']), 'supplier__name').optional(),
    search: fallback(z.string(), '').optional(),
    date__range: fallback(z.string(), '').optional(), 
    supplier: fallback(z.string(), '').optional(),
    status: fallback(z.enum(['PE', 'AP', 'RE']), 'PE').optional(),
})

export type ReturnSupplierSearchType = z.infer<typeof returnSupplierSearchSchema>
