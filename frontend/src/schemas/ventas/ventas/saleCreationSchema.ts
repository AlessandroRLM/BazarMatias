import { z } from "zod";

export const saleCreationSchema = z.object({
    status: z.enum(['PA', 'PE', 'CA']),
    document_type: z.enum(['BOL', 'FAC']),
    payment_method: z.enum(['EF', 'TC', 'TD', 'TR', 'OT']),
    client_id: z.string().min(1, "Debe seleccionar un cliente"),
    details: z.array(z.object({
        product_id: z.string().min(1, "Debe seleccionar un producto"),
        quantity: z.number().min(1, "La cantidad debe ser al menos 1"),
        unit_price: z.number().min(1, "El precio debe ser mayor a 0"),
    })).min(1, "Debe agregar al menos un detalle"),
})

export type SaleCreationFormValues = z.infer<typeof saleCreationSchema>