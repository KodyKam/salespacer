// client/src/api/axios.js
import axios from "axios"

const instance = axios.create({
  baseURL: import.meta.env.DEV
    ? "http://localhost:5000/api"
    : "https://salespacer.onrender.com/api"
})

export default instance