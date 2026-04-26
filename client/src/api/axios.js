// client/src/api/axios.js
import axios from "axios"

const instance = axios.create({
  baseURL: "/api", // uses Vite proxy
})

export default instance