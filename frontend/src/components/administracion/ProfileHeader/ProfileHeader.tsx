import { Box, Dropdown, IconButton, Menu, MenuButton, MenuItem, Typography } from "@mui/joy"
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SettingsIcon from '@mui/icons-material/Settings'
import useUserProfileFormContext from "../../../hooks/administracion/useUserProfileFormContext"

const ProfileHeader = () => {
    const { setIsProfile, isEditMode, setIsEditMode, setIsChangePassword } = useUserProfileFormContext()

    const handleProfileForm = () => {
        setIsChangePassword(false)
        setIsProfile(true)
        setIsEditMode(!isEditMode)
    }

    const handleChangePasswordForm = () => {
        setIsProfile(false)
        setIsChangePassword(true)
        setIsEditMode(false)
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                paddingTop: '8px'
            }}
        >
            <IconButton onClick={() => window.history.back()} variant='plain' color='neutral' size='lg'>
                <ArrowBackIcon />
            </IconButton>
            <Typography level='h2'>
                Mí Perfil
            </Typography>
            <Dropdown>
                <MenuButton
                    slots={{ root: IconButton }}
                    slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'lg' } }}
                >
                    <SettingsIcon />
                </MenuButton>
                <Menu>
                    <MenuItem onClick={() => handleProfileForm()}>
                        {isEditMode ? 'Ver perfil' : 'Editar Perfil'}
                    </MenuItem>
                    <MenuItem onClick={() => handleChangePasswordForm()}>
                        Cambiar Contraseña
                    </MenuItem>
                </Menu>
            </Dropdown>
        </Box>

    )
}

export default ProfileHeader