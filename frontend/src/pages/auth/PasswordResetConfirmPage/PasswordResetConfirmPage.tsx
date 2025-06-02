import { Button, Stack, Typography } from "@mui/joy"
import { useNavigate, useParams } from "@tanstack/react-router"
import { ResetPasswordConfirmSchema, ResetPasswordConfirmSchemaType } from "../../../schemas/auth/ResetPasswordConfirmSchema"
import { SubmitHandler, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { confirmPasswordReset } from "../../../services/authService"
import toast from "react-hot-toast"
import FormField from "../../../components/core/FormField/FormField"

const PasswordResetConfirmPage = () => {
    const {token, uid} = useParams({from: '/confirmar-contrasena/$uid/$token/'})
    const navigate = useNavigate()

    const { 
        handleSubmit,
        control,
        formState: { errors }
     } = useForm<ResetPasswordConfirmSchemaType>({
        resolver: zodResolver(ResetPasswordConfirmSchema),
        defaultValues: {
            token: token as string,
            uid: uid as string,
            new_password: '',
            confirm_password: '',
        },
        mode: 'onBlur',
    })

    console.log(`token: ${token}, uid: ${uid}`)

    const mutation = useMutation({
        mutationFn: confirmPasswordReset,
        onSuccess: () => {
            toast.success('Contraseña restablecida correctamente')
            navigate({to: '/login'})
        },
        onError: () => {
            toast.error('Error al restablecer la contraseña, intentalo nuevamente')
        }
    })

    const onSubmit: SubmitHandler<ResetPasswordConfirmSchemaType> = (data) => {
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
                        Ingresa tu nueva contraseña
                    </Typography>
                </Stack>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        type="hidden"
                        name="token"
                        value={token as string}
                    />
                    <input
                        type="hidden"
                        name="uid"
                        value={uid as string}
                    />
                    <FormField 
                        name="new_password"
                        control={control}
                        label="Nueva Contraseña"
                        type="password"
                        error={errors.new_password}
                    />
                    <FormField
                        name="confirm_password"
                        control={control}
                        label="Confirmar Contraseña"
                        type="password"
                        error={errors.confirm_password}
                    />
                    <Stack direction={'row'} spacing={2}>
                        <Button variant="outlined" color="neutral" onClick={()=> navigate({to: '/login'})} sx={{width: '100%'}}>
                            Volver al Login
                        </Button>
                        <Button type="submit" disabled={mutation.isPending} sx={{width: '100%'}}>
                            Restablecer Contraseña
                        </Button>   
                    </Stack>
                </form>
            </Stack>
        </Stack>
    )
}

export default PasswordResetConfirmPage