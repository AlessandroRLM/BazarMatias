import { SubmitHandler, useForm } from "react-hook-form"
import { defaultValues, loginFormSchema, LoginFormValues } from "../../../schemas/auth/loginFormSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Box, Button, Typography } from "@mui/joy"
import { Link, useNavigate, useSearch, } from "@tanstack/react-router"
import FormField from "../../core/FormField/FormField"
import { useAuth } from "../../../hooks/auth/useAuth"
import { useState } from "react"
import LockIcon from '@mui/icons-material/Lock';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

const LoginForm = () => {
    const fallback = '/home' as const
    const { login } = useAuth()
    const navigate = useNavigate()
    const search = useSearch({ from: '/login'})
    const { control, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
        defaultValues: defaultValues,
        resolver: zodResolver(loginFormSchema),
        mode: 'onBlur',
    })

    const [loginError, setLoginError] = useState<string | null>(null);
    const [attemptsInfo, setAttemptsInfo] = useState<{ attempts?: number, remaining?: number } | null>(null);
    const [blockedInfo, setBlockedInfo] = useState<{ blocked?: boolean, blocked_until?: string, blocked_seconds?: number } | null>(null);

    const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
        setLoginError(null);
        setAttemptsInfo(null);
        setBlockedInfo(null);
        try {
            await login(data);
            navigate({
                to: search.redirect || fallback,
            });
        } catch (error: any) {
            setLoginError(
                error?.response?.data?.detail ||
                "Error al iniciar sesión"
            );
            setAttemptsInfo({
                attempts: error?.response?.data?.attempts,
                remaining: error?.response?.data?.remaining,
            });
            setBlockedInfo({
                blocked: error?.response?.data?.blocked,
                blocked_until: error?.response?.data?.blocked_until,
                blocked_seconds: error?.response?.data?.blocked_seconds,
            });
        }
    };

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
            {blockedInfo?.blocked && blockedInfo.blocked_seconds !== undefined ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, p: 1.5, borderRadius: 2, bgcolor: '#ffeaea' }}>
                    <LockIcon color="error" />
                    <Typography color="danger" fontWeight={600}>
                        Acceso bloqueado. Intenta nuevamente en {Math.ceil(blockedInfo.blocked_seconds / 60)} minutos.
                    </Typography>
                </Box>
            ) : (
                <>
                    {loginError && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, p: 1.5, borderRadius: 2, bgcolor: '#fffde7' }}>
                            <ReportProblemIcon color="warning" />
                            <Typography color="warning">
                                {loginError}
                            </Typography>
                        </Box>
                    )}
                </>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
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