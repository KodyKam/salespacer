import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "../api/axios"
import { Box, Card, TextField, Button, Typography } from "@mui/material"

const ForgotPassword = () => {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    try {
      setLoading(true)
      await axios.post("/auth/forgot-password", { email })
      setSent(true)
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong")
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

        <Typography variant="h6" fontWeight="bold" sx={{ textAlign: "center", mb: 1 }}>
          Forgot Password
        </Typography>

        {sent ? (
          <>
            <Typography sx={{ textAlign: "center", opacity: 0.8, mt: 2 }}>
              ✅ Check your email for a reset link.
            </Typography>
            <Typography sx={{ textAlign: "center", fontSize: 13, mt: 1, opacity: 0.6 }}>
              The link expires in 1 hour.
            </Typography>
            <Button
              fullWidth variant="outlined"
              sx={{ mt: 3 }}
              component={Link}
              to="/login"
            >
              Back to Login
            </Button>
          </>
        ) : (
          <>
            <Typography variant="body2" sx={{ textAlign: "center", opacity: 0.6, mb: 3 }}>
              Enter your email and we'll send you a reset link.
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth label="Email" type="email"
                value={email} onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
              />
              {error && (
                <Typography color="error" sx={{ mb: 1 }}>{error}</Typography>
              )}
              <Button fullWidth variant="contained" type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
            <Typography sx={{ mt: 2, fontSize: 14, textAlign: "center" }}>
              <Link to="/login">Back to Login</Link>
            </Typography>
          </>
        )}
      </Card>
    </Box>
  )
}

export default ForgotPassword