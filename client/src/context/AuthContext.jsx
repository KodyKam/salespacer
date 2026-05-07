// client/src/context/AuthContext.js
import { createContext, useState, useContext, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
import axios from '../api/axios'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  // const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          // Optional: Verify token with backend
          const response = await axios.get('/dashboard')
          if (response.data) {
            setUser({ token })
          }
        } catch (err) {
          // Token invalid
          localStorage.removeItem('token')
        }
      }
      setLoading(false)
    }
    
    checkAuth()
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    // navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}