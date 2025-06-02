import z from 'zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { useMutation } from '@tanstack/react-query'
import { requestPasswordReset } from '../../../services/authService' // Asegúrate de crear este servicio
import { toast } from 'react-hot-toast'
import FormField from '../../../components/core/FormField/FormField'
import { Button, Stack, Typography } from '@mui/joy'

const formSchema = z.object({
    email: z.string().email({ message: 'Por favor, introduce un correo electrónico válido.' }),
})

type FormData = z.infer<typeof formSchema>

function RequestPasswordResetPage() {
    const navigate = useNavigate()

    const {
        handleSubmit,
        control,
        formState: { errors }
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
        },
        mode: 'onSubmit',
    })

    const mutation = useMutation({
        mutationFn: requestPasswordReset,
        onSuccess: () => {
            toast.success('Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña.')
        },
        onError: () => {
            toast.error('Error al enviar el correo electrónico de restablecimiento de contraseña.')
        },
    })

    const onSubmit: SubmitHandler<FormData> = (data) => {
        mutation.mutate(data)
    }


    return (
        <Stack justifyContent={'center'} alignItems={'center'} sx={{height: '100dvh'}}>
            <Stack padding={{xs: 2}} spacing={2}>
                <Stack>
                    <Typography level="h4" gutterBottom>
                        Restablecer Contraseña
                    </Typography>
                    <Typography level="body-md" gutterBottom>
                        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                    </Typography>
                </Stack>    
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormField
                        label="Correo Electrónico"
                        control={control}
                        name="email"
                        placeholder="tucorre@electronico.com"
                        error={errors?.email}
                        fullWidth
                    />
                    <Stack direction={'row'} spacing={2}>
                        <Button variant='outlined' color='neutral' onClick={()=> navigate({to: '/login'})} sx={{width: '100%'}}>
                            Volver al Login
                        </Button>
                        <Button type="submit" disabled={mutation.isPending} sx={{width: '100%'}}>
                            {mutation.isPending ? 'Enviando...' : 'Enviar Enlace de Restablecimiento'}
                        </Button>
                    </Stack>
                </form>
            </Stack>
        </Stack>
    )
}

export default RequestPasswordResetPage