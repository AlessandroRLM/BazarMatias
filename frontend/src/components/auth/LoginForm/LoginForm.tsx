import { SubmitHandler, useForm } from "react-hook-form"
import { defaultValues, loginFormSchema, LoginFormValues } from "../../../schemas/auth/loginFormSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Box, Button, Typography } from "@mui/joy"
import { Link, useNavigate, useSearch, } from "@tanstack/react-router"
import FormField from "../../core/FormField/FormField"
import { useAuth } from "../../../hooks/auth/useAuth"

const LoginForm = () => {
    const { login } = useAuth()
    const navigate = useNavigate()
    const search = useSearch({ from: '/login'})
    const { control, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
        defaultValues: defaultValues,
        resolver: zodResolver(loginFormSchema),
        mode: 'onBlur',
    })

    const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
        login(data).then(() => navigate({
            to: search.redirect || '/',
        }))
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: '100%', paddingBottom: 2, paddingTop: 2, paddingLeft: 4, paddingRight: 4, alignItems: 'flex-start', justifyContent: 'center' }}>
            <Typography level="h2">
                Iniciar Sesión
            </Typography>
            <FormField
                name="email"
                control={control}
                label="Correo"
                fullWidht={true}
                error={errors.email}
            />
            <FormField
                name="password"
                control={control}
                label="Contraseña"
                fullWidht={true}
                type="password"
                error={errors.password}
            />
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                { /* 
                <FormField
                    name="rememberMe"
                    control={control}
                    label="Recordar sesión"
                    type="checkbox"
                    fullWidht={true}
                    error={errors.rememberMe}
                />
             */}

                <Link to=".">¿Olvidaste tu contraseña?</Link>
            </Box>
            <Button sx={{
                width: '100%'
            }}
                variant="solid"
                size="md"
                type="submit"
            >
                Iniciar sesión
            </Button>
        </form>
    )
}

export default LoginForm