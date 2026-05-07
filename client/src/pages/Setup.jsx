// client/src/pages/Setup.jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../api/axios"
import { Box, Card, TextField, Button, Typography } from "@mui/material"

const Setup = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    requiredVolume: "",
    commissionRate: "",
    totalWorkDays: ""
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    const payload = {
      requiredVolume: Number(form.requiredVolume),
      commissionRate: Number(form.commissionRate) / 100,
      totalWorkDays: Number(form.totalWorkDays)
    }

    if (!payload.requiredVolume || !payload.commissionRate || !payload.totalWorkDays) {
      setError("Please fill in all fields")
      return
    }

    try {
      setLoading(true)
      await axios.post("/season", payload)
      navigate("/")
    } catch (err) {
      setError(err.response?.data?.message || "Setup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
      <Card sx={{ p: 4, width: "100%", maxWidth: 420, borderRadius: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Box component="img" src="/logo.png" alt="SalesPacer" sx={{ width: 64, borderRadius: 2 }} />
        </Box>
        <Typography variant="h5" fontWeight="bold" sx={{ textAlign: "center" }}>
          Set Up Your Season
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, mb: 3, opacity: 0.6, textAlign: "center" }}>
          Define your income goal and we'll pace you to it.
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth label="Income Goal ($)" name="requiredVolume"
            type="number" value={form.requiredVolume}
            onChange={handleChange} sx={{ mb: 2 }}
          />
          <TextField
            fullWidth label="Commission Rate (%)" name="commissionRate"
            type="number" inputProps={{ step: "0.01" }}
            value={form.commissionRate} onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth label="Number of Work Days" name="totalWorkDays"
            type="number" value={form.totalWorkDays}
            onChange={handleChange} sx={{ mb: 2 }}
          />
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
          )}
          <Button fullWidth variant="contained" type="submit" disabled={loading} size="large">
            {loading ? "Creating..." : "Let's Go"}
          </Button>
        </form>
      </Card>
    </Box>
  )
}

export default Setup