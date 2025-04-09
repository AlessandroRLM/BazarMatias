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
                maxHeight: '840px',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                borderRadius: 'var(--joy-radius-md)',
                boxShadow: 'var(--joy-shadow-md)',
            }}
        >
            <Box
                sx={{
                    position: 'relative',
                    width: '-webkit-fill-available',
                    height: '792px',
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--joy-radius-md)',
                    overflow: 'hidden',
                    gap: 2,
                    border: '1px solid var(--theme-divider)',
                    boxShadow: 'var(--joy-shadow-md)',
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