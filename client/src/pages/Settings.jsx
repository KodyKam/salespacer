// client/src/pages/Settings.jsx
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../api/axios"
import { Box, TextField, Button, Typography, IconButton, Divider } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { useAuth } from "../context/AuthContext"

const Settings = () => {
  const { isPro } = useAuth()
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
      navigate("/")
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
        {loading ? "Saving..." : "Save Changes"}
      </Button>

      <Divider sx={{ my: 3 }} />

      <Divider sx={{ my: 3 }} />

<Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.6 }}>APP TOUR</Typography>

<Button
  fullWidth
  variant="outlined"
  sx={{ mb: 1 }}
  onClick={() => {
    localStorage.removeItem("tourCompleted")
    navigate("/")
    setTimeout(() => window.dispatchEvent(new Event("start-tour")), 300)
  }}
>
  🎯 Take the App Tour
</Button>

<Divider sx={{ my: 3 }} />

<Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.6 }}>YOUR PLAN</Typography>

{isPro ? (
  <Box sx={{
    p: 2, borderRadius: 2,
    bgcolor: "#e8f5e9", border: "1px solid #c8e6c9",
    mb: 2
  }}>
    <Typography fontWeight="bold">✅ SalesPacer Pro</Typography>
    <Typography variant="body2" sx={{ opacity: 0.7, mt: 0.5 }}>
      You have full access to all pro features.
    </Typography>
  </Box>
) : (
  <Box sx={{
    p: 2, borderRadius: 2,
    bgcolor: "#f3f4f6", border: "1px solid #e0e0e0",
    mb: 2
  }}>
    
    <Typography fontWeight="bold">Free Plan</Typography>
    <Typography variant="body2" sx={{ opacity: 0.7, mt: 0.5, mb: 2 }}>
      Upgrade to Pro to unlock graphs, trends, win rate, pace projections and more.
    </Typography>

    <Button
      fullWidth variant="contained" color="primary"
      sx={{ mb: 1 }}
      onClick={async () => {
        try {
          const res = await axios.post("/billing/create-checkout-session", {
            plan: "monthly"
          })
          window.location.href = res.data.url
        } catch (err) {
          alert("Failed to start checkout")
        }
      }}
    >
      Upgrade — $4.99/month
    </Button>

    <Button
      fullWidth variant="outlined" color="primary"
      onClick={async () => {
        try {
          const res = await axios.post("/billing/create-checkout-session", {
            plan: "yearly"
          })
          window.location.href = res.data.url
        } catch (err) {
          alert("Failed to start checkout")
        }
      }}
    >
      Upgrade — $49.99/year
    </Button>

    <Typography variant="caption" sx={{ display: "block", mt: 1, opacity: 0.5, textAlign: "center" }}>
      Save 17% with yearly billing
    </Typography>
  </Box>
)}

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