export type userProfileFormContextType = {
    isEditMode: boolean
    setIsEditMode: (editMode: boolean) => void
    isProfile: boolean
    setIsProfile: (isProfile: boolean) => void
    isChangePassword: boolean
    setIsChangePassword: (isChangePassword: boolean) => void
}