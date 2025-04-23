import { User } from "./auth.types"

export type userProfileFormContextType = {
    isEditMode: boolean
    setIsEditMode: (editMode: boolean) => void
    isProfile: boolean
    setIsProfile: (isProfile: boolean) => void
    isChangePassword: boolean
    setIsChangePassword: (isChangePassword: boolean) => void
}


export interface UserActivity {
    id: string
    user: User
    action_type: string
    description: string
    object_id?: string
    data?: Data
    ip_address: string
    user_agent: string
    date: string
    time: string
    timestamp: string
}


export interface Data {
    path: string
    status_code: number
    status_type: string
}
