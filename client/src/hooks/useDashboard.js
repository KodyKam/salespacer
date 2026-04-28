// client/src/hooks/useDashboard.js
import { useEffect, useState, useCallback } from "react"
import axios from "../api/axios"

export const useDashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const res = await axios.get("/dashboard")
      setData(res.data)
    } catch (err) {
      console.error("Dashboard error:", err)
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    refresh: fetchData
  }
}