import { ReactNode, useState } from "react"
import UserProfileFormContext from "../../contexts/administracion/UserProfileFormContext"

interface UserProfileFormProviderProps {
    children: ReactNode
}

const UserProfileFormProvider = ({children}: UserProfileFormProviderProps) => {
    const [isEditMode, setIsEditMode] = useState<boolean>(false)
    const [isProfile, setIsProfile] = useState<boolean>(true)
    const [isChangePassword, setIsChangePassword] = useState<boolean>(false)

    const value = {
        isEditMode, setIsEditMode,
        isProfile, setIsProfile,
        isChangePassword, setIsChangePassword 
    }

    return(
        <UserProfileFormContext.Provider value={value}>
            {children}
        </UserProfileFormContext.Provider>
    )
}

export default UserProfileFormProvider