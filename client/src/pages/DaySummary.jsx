import { useLocation, useNavigate } from "react-router-dom"
import { Box, Card, Typography, Button } from "@mui/material"

const DaySummary = () => {
  const { state } = useLocation()
  const navigate = useNavigate()

  const summary = state?.summary

  if (!summary) {
    return <p style={{ padding: 20 }}>No summary found</p>
  }

  const isWin = summary.difference >= 0

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: isWin ? "#e8f5e9" : "#ffebee",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2
      }}
    >
      <Card sx={{ p: 3, width: "100%", borderRadius: 4, textAlign: "center" }}>
        
        <Typography variant="h5" fontWeight="bold">
          {isWin ? "🎉 Day Complete!" : "📉 Day Finished"}
        </Typography>

        <Typography sx={{ mt: 2 }}>
          Sales: ${summary.todaySales}
        </Typography>

        <Typography>
          Target: ${summary.todayTarget}
        </Typography>

        <Typography
          sx={{
            mt: 2,
            fontWeight: "bold",
            color: isWin ? "green" : "red"
          }}
        >
          {isWin
            ? `You beat your goal by $${summary.difference}`
            : `You were $${Math.abs(summary.difference)} behind`}
        </Typography>

        <Typography sx={{ mt: 2 }}>
          🔥 Streak: {summary.streak} days
        </Typography>

        <Typography sx={{ mt: 2, fontStyle: "italic" }}>
          {summary.message || "Keep building momentum."}
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 3, width: "100%" }}
          onClick={() => navigate("/")}
        >
          Back to Dashboard
        </Button>
      </Card>
    </Box>
  )
}

export default DaySummary