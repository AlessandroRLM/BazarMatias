import { Box, Sheet, Avatar } from "@mui/joy"
import UserViewHeader from "../../components/administracion/UserViewHeader/UserViewHeader"
import UserViewForm from '../../components/administracion/UserViewForm/UserViewForm'

const UserViewPage = () => {

    return (
        <Sheet
            variant="outlined"
            color="neutral"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                position: 'relative',
                borderRadius: 'var(--joy-radius-md)',
                boxShadow: 'var(--joy-shadow-md)',
                width: '100%',
                height: 'auto',
                maxHeight: '100vh',
                overflow: 'auto',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    width: '100%',
                    height: 'auto',
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--joy-radius-md)',
                    overflow: 'visible',
                    gap: 2,
                    border: '1px solid var(--theme-divider)',
                    boxShadow: 'var(--joy-shadow-md)',
                    paddingBottom: '16px',
                }}
            >
                <UserViewHeader />
                <Box
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, padding: 0 }}
                >
                    <Avatar variant="soft" color="primary" size="profile" >AA</Avatar>
                </Box>
                <UserViewForm />
            </Box>
        </Sheet>
    )
}

export default UserViewPage