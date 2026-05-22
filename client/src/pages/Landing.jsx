// client/src/pages/Landing.jsx
import { Box, Card, Typography, Button, Stack } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import Footer from "../components/Footer"

const Landing = () => {
  const navigate = useNavigate()

  // If already logged in, skip to dashboard
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) navigate("/")
  }, [navigate])

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#111",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3
      }}
    >
      <Card sx={{ p: 4, width: "100%", maxWidth: 400, borderRadius: 4, textAlign: "center" }}>
        <Box
          component="img"
          src="/logo.png"
          alt="SalesPacer"
          sx={{ width: 80, borderRadius: 2, mb: 2 }}
        />

        <Typography variant="h4" fontWeight="bold">
          SalesPacer
        </Typography>

        <Typography sx={{ mt: 1, mb: 3, opacity: 0.6 }}>
          Track your sales. Hit your targets. Build your streak.
        </Typography>

        <Stack spacing={2}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => navigate("/register")}
          >
            Get Started
          </Button>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            onClick={() => navigate("/login")}
          >
            Log In
          </Button>
        </Stack>
      </Card>
      <Footer />
    </Box>
  )
}

export default Landing