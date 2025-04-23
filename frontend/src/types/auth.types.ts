export interface User {
    id: string
    first_name: string
    last_name: string
    national_id: string
    formatted_national_id: string
    email: string
    position: string
    is_staff: boolean
    is_active: boolean
}

export interface AuthProviderProps {
    children: React.ReactNode
}

export interface AuthContextType {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    login: ({ email, password }: LoginProps) => Promise<void>
    logout: () => void
    logoutAll: () => void
}

export interface LoginProps {
    email: string
    password: string
}