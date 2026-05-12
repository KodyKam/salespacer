import { Box, Card, Typography, Button } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import axios from "../api/axios"

const ProSuccess = () => {
  const navigate = useNavigate()

  useEffect(() => {
    axios.get("/billing/status").then(res => {
      localStorage.setItem("isPro", res.data.isPro)
    })
  }, [])

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", p: 3 }}>
      <Card sx={{ p: 4, maxWidth: 420, textAlign: "center", borderRadius: 3 }}>
        <Typography variant="h4">🎉</Typography>
        <Typography variant="h5" fontWeight="bold" sx={{ mt: 2 }}>
          Welcome to SalesPacer Pro!
        </Typography>
        <Typography sx={{ mt: 2, opacity: 0.7 }}>
          Your account has been upgraded. All pro features are now unlocked.
        </Typography>
        <Button
          fullWidth variant="contained" size="large"
          sx={{ mt: 3 }}
          onClick={() => navigate("/")}
        >
          Go to Dashboard
        </Button>
      </Card>
    </Box>
  )
}

export default ProSuccess