import z from 'zod'

export const changePasswordFormSchema = z.object({
    password: z.string().min(1, {message: 'La contraseña es requerida'}),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword']
})

export type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>

export const defaultValues = {
    password: '',
    confirmPassword: ''
}