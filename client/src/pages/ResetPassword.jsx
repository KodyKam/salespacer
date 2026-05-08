import { useState } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import axios from "../api/axios"
import { Box, Card, TextField, Button, Typography } from "@mui/material"

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const navigate = useNavigate()

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (password !== confirm) {
      setError("Passwords don't match")
      return
    }

    try {
      setLoading(true)
      await axios.post("/auth/reset-password", { token, password })
      setDone(true)
      setTimeout(() => navigate("/login"), 2500)
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed")
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Card sx={{ p: 4, width: 350, textAlign: "center" }}>
          <Typography color="error">Invalid reset link.</Typography>
          <Button component={Link} to="/login" sx={{ mt: 2 }}>
            Back to Login
          </Button>
        </Card>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Card sx={{ p: 4, width: 350 }}>
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Box component="img" src="/logo.png" alt="SalesPacer" sx={{ width: 64, borderRadius: 2 }} />
        </Box>

        <Typography variant="h6" fontWeight="bold" sx={{ textAlign: "center", mb: 1 }}>
          Set New Password
        </Typography>

        {done ? (
          <Typography sx={{ textAlign: "center", mt: 2 }}>
            ✅ Password reset! Redirecting to login...
          </Typography>
        ) : (
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth label="New Password" type="password"
              value={password} onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 2, mt: 2 }}
            />
            <TextField
              fullWidth label="Confirm Password" type="password"
              value={confirm} onChange={(e) => setConfirm(e.target.value)}
              sx={{ mb: 2 }}
            />
            {error && (
              <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>
            )}
            <Button fullWidth variant="contained" type="submit" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        )}
      </Card>
    </Box>
  )
}

export default ResetPassword