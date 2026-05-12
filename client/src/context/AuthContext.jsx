// client/src/context/AuthContext.js
import { createContext, useState, useContext, useEffect } from 'react'
import axios from '../api/axios'

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isPro, setIsPro] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const res = await axios.get('/billing/status')
          setUser({ token })
          setIsPro(res.data.isPro)
          localStorage.setItem('isPro', res.data.isPro)
        } catch (err) {
          localStorage.removeItem('token')
          localStorage.removeItem('isPro')
          setIsPro(false)
        }
      }
      setLoading(false)
    }
    checkAuth()
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('isPro')
    setUser(null)
    setIsPro(false)
  }

  return (
    <AuthContext.Provider value={{ user, isPro, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}