// client/src/api/axios.js
import axios from "axios"

const instance = axios.create({
  baseURL: import.meta.env.DEV
    ? "http://localhost:5000/api"
    : "https://salespacer.onrender.com/api"
})

// ✅ REQUEST INTERCEPTOR (attach token)
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")

  console.log("TOKEN BEING SENT:", token)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  // Add timezone header for better date handling on server
  config.headers["x-timezone"] = Intl.DateTimeFormat().resolvedOptions().timeZone 

  return config
})

// ✅ RESPONSE INTERCEPTOR (handle 401)
instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.warn("401 detected → redirecting to login")

      localStorage.removeItem("token")
      window.location.href = "/login"
    }

    return Promise.reject(err)
  }
)

export default instance