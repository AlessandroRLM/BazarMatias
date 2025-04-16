import { z } from 'zod'

export const loginFormSchema = z.object({
    email: z.string().email('Dirección de correo invalida'),
    password: z.string().min(1, 'Debe ingresar una contraseña')
})

export type LoginFormValues = z.infer<typeof loginFormSchema>

export const defaultValues: LoginFormValues = {
    email: '',
    password: '',
}
