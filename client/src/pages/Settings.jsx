// client/src/pages/Settings.jsx
import { useState, useEffect } from "react"
import axios from "../api/axios"
import { useNavigate } from "react-router-dom"
import { Box, TextField, Button, Typography, IconButton } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"

const Settings = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    incomeGoal: "",
    commissionRate: "",
    totalWorkDays: ""
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    try {
      await axios.put("/season/update", {
        ...form,
        incomeGoal: Number(form.incomeGoal),
        commissionRate: Number(form.commissionRate),
        totalWorkDays: Number(form.totalWorkDays)
      })

      navigate("/")
    } catch (err) {
      console.error(err)
    }
    useEffect(() => {
    axios.get("/season").then(res => {
      setForm({
        incomeGoal: res.data.incomeGoal,
        commissionRate: res.data.commissionRate * 100,
        totalWorkDays: res.data.totalWorkDays
      })
    })
  }, [])
  }
  

  return (
    <Box sx={{ p: 2 }}>
      {/* HEADER */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <IconButton onClick={() => navigate("/")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6">Settings</Typography>
      </Box>

      <TextField
        fullWidth
        label="Income Goal"
        name="incomeGoal"
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Commission Rate"
        name="commissionRate"
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Work Days"
        name="totalWorkDays"
        onChange={handleChange}
        sx={{ mb: 2 }}
      />

      <Button fullWidth variant="contained" onClick={handleSave}>
        Save Changes
      </Button>

      <Button
        color="error"
        fullWidth
        sx={{ mt: 2 }}
        onClick={async () => {
          if (confirm("This will delete all progress. Continue?")) {
            await axios.delete("/season")
            navigate("/setup")
          }
        }}
      >
        Reset Season
      </Button>
    </Box>
  )
}

export default Settings