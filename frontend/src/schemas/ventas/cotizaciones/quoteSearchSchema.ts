import { z } from "zod";
import { fallback } from "@tanstack/zod-adapter";


export const quoteSearchSchema = z.object({
    created_at: fallback(z.string(), '').optional(),
    status: fallback(z.enum(['', 'PE', 'AP', 'RE']), '').optional(),
    search: fallback(z.string(), '').optional(),
    ordering: fallback(z.enum(['status', '-status', 'created_at', '-created_at', 'total', '-total']), '-created_at').optional(),
    page: fallback(z.number(), 1).optional(),
    page_size: fallback(z.number(), 10).optional(),
})

export type QuoteSearchType = z.infer<typeof quoteSearchSchema>