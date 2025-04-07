import z from 'zod'

export const userProfileFormSchema = z.object({
    firstName: z.string().min(1, {message: 'El nombre es requerido'}),
    lastName: z.string().min(1, {message: 'El apellido es requerido'}),
    email: z.string().email({message: 'El email no es válido'}),
    nationalId: z.string(),
    position: z.string({required_error: 'El cargo es requerido'})
})

export type UserProfileFormValues = z.infer<typeof userProfileFormSchema>
