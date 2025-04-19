import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { API_URL } from '../config/constants'
import { toast } from 'react-toastify'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token')
        
        if (!token) {
          setLoading(false)
          return
        }
        
        const response = await axios.get(`${API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        
        if (response.data) {
          setUser(response.data)
        }
      } catch (error) {
        console.error('Authentication check failed:', error)
        // Clear invalid token
        localStorage.removeItem('token')
      } finally {
        setLoading(false)
      }
    }
    
    checkLoggedIn()
  }, [])

  // Register user
  const register = async (userData) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await axios.post(`${API_URL}/api/users/register`, userData)
      setUser(response.data.user)
      localStorage.setItem('token', response.data.token)
      toast.success('Registration successful!')
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed'
      setError(message)
      toast.error(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Login user
  const login = async (credentials) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await axios.post(`${API_URL}/api/users/login`, credentials)
      setUser(response.data.user)
      localStorage.setItem('token', response.data.token)
      toast.success('Login successful!')
      return response.data
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      setError(message)
      toast.error(message)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Logout user
  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    toast.info('Logged out successfully')
  }

  // Check if token is expired
  const isTokenExpired = () => {
    const token = localStorage.getItem('token')
    if (!token) return true
    
    try {
      // Get payload from token
      const payload = JSON.parse(atob(token.split('.')[1]))
      // Check if token is expired
      return payload.exp * 1000 < Date.now()
    } catch (error) {
      return true
    }
  }

  // Refresh token if needed
  const refreshTokenIfNeeded = async () => {
    if (isTokenExpired()) {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.post(`${API_URL}/api/users/refresh-token`, { 
          token 
        })
        localStorage.setItem('token', response.data.token)
        return response.data.token
      } catch (error) {
        logout()
        throw new Error('Session expired. Please login again.')
      }
    }
    return localStorage.getItem('token')
  }

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    refreshTokenIfNeeded
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}