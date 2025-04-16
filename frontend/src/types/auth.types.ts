export interface User {
    email: string
    firstName: string
    lastName: string
    isStaff: boolean
    isSuperuser: boolean
    position: string
}

export interface AuthProviderProps {
    children: React.ReactNode
}

export interface AuthContextType {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    login: ({email, password}: LoginProps) => Promise<void>
    logout: () => void
    logoutAll: () => void

}

export interface LoginProps {
    email: string
    password: string
}