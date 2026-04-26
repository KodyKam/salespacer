// client/src/api/axios.js
import axios from "axios"

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://salespacer.onrender.com/api" || "http://localhost:5000/api"
})

export default instance