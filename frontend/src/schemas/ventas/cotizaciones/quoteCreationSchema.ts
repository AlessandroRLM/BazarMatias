import { z } from "zod";

export const quoteCreationSchema = z.object({
    status: z.enum(['RE', 'PE', 'AP']),
    client_id: z.string().min(1, "Debe seleccionar un cliente"),
    details: z.array(z.object({
        product_id: z.string().min(1, "Debe seleccionar un producto"),
        quantity: z.number().min(1, "La cantidad debe ser al menos 1"),
        unit_price: z.number().min(1, "El precio debe ser mayor a 0"),
        discount: z.number().min(0, "El descuento no puede ser negativo"),
    })).min(1, "Debe agregar al menos un detalle"),
})

export type QuoteCreationFormValues = z.infer<typeof quoteCreationSchema>