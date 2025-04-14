import { Box, Sheet, Avatar } from "@mui/joy"
import ProfileHeader from "../../components/administracion/ProfileHeader/ProfileHeader"
import ProfileForm from '../../components/administracion/ProfileForm/ProfileForm'
import useUserProfileFormContext from "../../hooks/administracion/useUserProfileFormContext"
import ChangePasswordForm from "../../components/administracion/ChangePasswordForm/ChangePasswordForm"

const ProfilePage = () => {
    const { isProfile, isChangePassword } = useUserProfileFormContext()

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
                    width: '100%', // Asegura que ocupe todo el ancho disponible
                    height: 'auto', // Cambiado de altura fija a dinámica
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--joy-radius-md)',
                    overflow: 'visible', // Permite que el contenido se ajuste dinámicamente
                    gap: 2,
                    border: '1px solid var(--theme-divider)',
                    boxShadow: 'var(--joy-shadow-md)',
                    paddingBottom: '16px',
                }}
            >
                <ProfileHeader />
                <Box
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, padding: 0 }}
                >
                    <Avatar variant="soft" color="primary" size="profile" >AA</Avatar>
                    {isProfile && <ProfileForm />}
                    {isChangePassword && <ChangePasswordForm />}
                </Box>
            </Box>
        </Sheet >

    )
}

export default ProfilePage