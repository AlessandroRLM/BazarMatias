import { Box, Typography } from "@mui/joy"
import LoginForm from "../../../components/auth/LoginForm/LoginForm"

const LoginPage = () => {
    return (
        <>
            <Box
                sx={{
                    width: { xs: '100%', md: '50vw' },
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    backgroundColor: (theme) => theme.palette.background.body,
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        minHeight: '100dvh',
                        px: 4,
                        py: 2,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Typography sx={{ textAlign: 'center', }} level="h2">
                        Bazar Matias
                    </Typography>
                    <LoginForm />
                    <Typography sx={{ textAlign: 'center', }} level="body-xs">
                        Bazar Matias
                    </Typography>
                </Box>
            </Box>
            <Box
                sx={(theme) => ({
                    height: '100%',
                    position: 'fixed',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    left: { xs: 0, md: '50vw' },
                    backgroundColor: theme.palette.primary.solidBg
                })}
            />
        </>
    )
}

export default LoginPage