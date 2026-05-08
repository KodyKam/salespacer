// client/src/pages/Settings.jsx
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../api/axios"
import { Box, TextField, Button, Typography, IconButton, Divider } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"

const Settings = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    incomeGoal: "",
    commissionRate: "",
    taxRate: "",
    totalWorkDays: ""
  })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    axios.get("/season").then(res => {
      const { requiredVolume, commissionRate, taxRate, totalWorkDays } = res.data
      // Back-calculate incomeGoal from stored requiredVolume
      const incomeGoal = requiredVolume * commissionRate / (1 + taxRate)
      setForm({
        incomeGoal: incomeGoal.toFixed(2),
        commissionRate: (commissionRate * 100).toFixed(2),
        taxRate: (taxRate * 100).toFixed(2),
        totalWorkDays
      })
    }).catch(() => {})
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    setError("")
    try {
      setLoading(true)
      await axios.put("/season/update", {
        incomeGoal: Number(form.incomeGoal),
        commissionRate: Number(form.commissionRate),
        taxRate: Number(form.taxRate),
        totalWorkDays: Number(form.totalWorkDays)
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err.response?.data?.message || "Save failed")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/welcome")
  }

  return (
    <Box sx={{ p: 2, maxWidth: 480, mx: "auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={() => navigate("/")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" fontWeight="bold">Settings</Typography>
      </Box>

      <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.6 }}>SEASON GOALS</Typography>

      <TextField
        fullWidth label="Income Goal ($)" name="incomeGoal"
        type="number" value={form.incomeGoal}
        onChange={handleChange} sx={{ mb: 2 }}
      />
      <TextField
        fullWidth label="Commission Rate (%)" name="commissionRate"
        type="number" slotProps={{ input: { step: "0.01" } }}
        value={form.commissionRate}
        onChange={handleChange} sx={{ mb: 2 }}
      />
      <TextField
        fullWidth label="Tax Rate (%)" name="taxRate"
        type="number" slotProps={{ input: { step: "0.01" } }}
        value={form.taxRate}
        onChange={handleChange}
        helperText="e.g. 13 for Ontario HST, 5 for GST only"
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth label="Work Days" name="totalWorkDays"
        type="number" value={form.totalWorkDays}
        onChange={handleChange} sx={{ mb: 2 }}
      />

      {error && <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>}

      <Button fullWidth variant="contained" onClick={handleSave} disabled={loading} sx={{ mb: 1 }}>
        {saved ? "✅ Saved!" : loading ? "Saving..." : "Save Changes"}
      </Button>

      <Divider sx={{ my: 3 }} />

      <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.6 }}>DANGER ZONE</Typography>

      <Button
        fullWidth color="error" variant="outlined" sx={{ mb: 2 }}
        onClick={async () => {
          if (confirm("This will delete all your progress. Are you sure?")) {
            await axios.delete("/season")
            navigate("/setup")
          }
        }}
      >
        Reset Season
      </Button>

      <Button fullWidth color="warning" variant="outlined" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  )
}

export default Settings