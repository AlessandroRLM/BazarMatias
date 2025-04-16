import { Box } from "@mui/joy"
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import { Outlet } from "@tanstack/react-router"



const layout = () => {
    return (
        <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
            <Header />
            <Sidebar />
            <Box
                component="main"
                className="MainContent"
                sx={{
                    px: { xs: 2, md: 6 },
                    pt: {
                        xs: 'calc(12px + var(--Header-height))',
                        sm: 'calc(12px + var(--Header-height))',
                        md: 3,
                    },
                    pb: { xs: 2, sm: 2, md: 3 },
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0,
                    height: '100dvh',
                    maxHeight: {
                        lg: '100dvh',
                    },
                    overflowY: 'auto',
                    gap: 1,
                }}
            >
                <Outlet />
            </Box>
        </Box>
    )

}

export default layout