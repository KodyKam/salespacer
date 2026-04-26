// client/src/hooks/useDashboard.js
import { useEffect, useState } from "react"
import axios from "../api/axios"

export const useDashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
  try {
    const res = await axios.get("/dashboard", {
      headers: {
        "Cache-Control": "no-cache"
      }
    })

    setData({ ...res.data })
  } catch (err) {
    console.error(err)
  } finally {
    setLoading(false)
  }
}

  useEffect(() => {
    fetchData()
  }, [])

  return { data, loading, refresh: fetchData }
}