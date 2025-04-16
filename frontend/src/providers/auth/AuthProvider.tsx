import { useState, useEffect } from 'react'
import AxiosInstance from '../../helpers/AxiosInstance'
import { AuthContext } from '../../contexts/auth/AuthContext'
import { AuthProviderProps, LoginProps, User } from '../../types/auth.types'

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(localStorage.getItem("Token"))
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token)

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
            const response = await AxiosInstance.get("/api/users/me/")
            setUser(response.data)
        } catch (error) {
            console.error("Error fetching user data:", error)
            logout()
        }
    }

    const login = async ({ email, password }: LoginProps) => {
        try {
            const response = await AxiosInstance.post("/api/auth/login/", { email, password })
            setToken(response.data.token)
        } catch (error) {
            console.error("Login error:", error)
            throw error
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