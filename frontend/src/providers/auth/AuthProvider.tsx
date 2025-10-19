import { useState, useEffect } from 'react'
import AxiosInstance from '../../helpers/AxiosInstance'
import { AuthContext } from '../../contexts/auth/AuthContext'
import { AuthProviderProps, LoginProps, User } from '../../types/auth.types'
import { useSnackbar } from '../../hooks/core/useSnackbar'

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(localStorage.getItem("Token"))
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token)
    const { showSnackbar } = useSnackbar()

    useEffect(() => {
        if (token) {
            localStorage.setItem("Token", token)
            setIsAuthenticated(true)
            fetchUserData()
        } else {
            localStorage.removeItem("Token")
            setIsAuthenticated(false)
            setUser(null)
        }
    }, [token])


    const fetchUserData = async () => {
        try {
            const response = await AxiosInstance.get("/api/users/users/me/")
            setUser(response.data)
        } catch (error) {
            showSnackbar("Error al obtener los datos del usuario:", 'danger')
            logout()
        }
    }

    const login = async ({ email, password }: LoginProps) => {
        try {
            const response = await AxiosInstance.post("/api/auth/login/", { email, password })
            setToken(response.data.token)
        } catch (error) {
            showSnackbar("Error al iniciar sesión", 'danger')
        }
    }

    const logout = () => {
        setToken(null)
        setUser(null)
        AxiosInstance.post('/api/auth/logout/')
    }

    const logoutAll = () => {
        setToken(null)
        setUser(null)
        AxiosInstance.post('/api/auth/logoutall/')
    }

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, logoutAll }}>
            {children}
        </AuthContext.Provider>
    )
}