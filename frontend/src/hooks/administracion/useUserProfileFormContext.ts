import { useContext } from "react"
import UserProfileContext from "../../contexts/administracion/UserProfileFormContext"

const useUserProfileFormContext = () => {
    const context = useContext(UserProfileContext)

    if (!context) {
        throw new Error("userProfileFormContext must be used within a UserProfileFormProvider")
    }

    return context
}

export default useUserProfileFormContext