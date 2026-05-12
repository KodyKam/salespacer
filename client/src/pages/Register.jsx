// client/src/pages/Register.jsx
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "../api/axios"
import { Box, Card, TextField, Button, Typography } from "@mui/material"

const Register = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError("")
      const res = await axios.post("/auth/register", form)
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("isPro", res.data.isPro || false)
      navigate("/setup")
    } catch (err) {
      setError(err.response?.data?.message || "Register failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Card sx={{ p: 4, width: 350 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Box component="img" src="/logo.png" alt="SalesPacer" sx={{ width: 64, borderRadius: 2 }} />
        </Box>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, textAlign: "center" }}>
          Create Account
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth label="Email" name="email"
            value={form.email} onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth label="Password" type="password" name="password"
            value={form.password} onChange={handleChange}
            sx={{ mb: 2 }}
          />
          {error && (
            <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>
          )}
          <Button fullWidth variant="contained" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </Button>
        </form>
        <Typography sx={{ mt: 2, fontSize: 14, textAlign: "center" }}>
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </Card>
    </Box>
  )
}

export default Register