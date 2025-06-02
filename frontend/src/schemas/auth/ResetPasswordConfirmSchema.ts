import { z } from 'zod';

export const ResetPasswordConfirmSchema = z.object({
    uid: z.string(),
    token: z.string(),
    new_password: z.string().min(1, 'la contraseña es obligatoria'),
    confirm_password: z.string()
}).refine((data) => data.new_password === data.confirm_password, {
    message: 'Las contraseñas no coinciden',
    path: ['confirm_password'],
})

export type ResetPasswordConfirmSchemaType = z.infer<typeof ResetPasswordConfirmSchema>