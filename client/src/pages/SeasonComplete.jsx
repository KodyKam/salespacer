// client/src/pages/SeasonComplete.jsx
import { useLocation, useNavigate } from "react-router-dom"
import { Box, Card, Typography, Button, Divider } from "@mui/material"
import axios from "../api/axios"
import { useState } from "react"

const SeasonComplete = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const stats = location.state?.stats
  const [starting, setStarting] = useState(false)

  if (!stats) {
    navigate("/")
    return null
  }

  const formatCurrency = (n) => `$${Number(n).toFixed(0)}`

  return (
    <Box sx={{
      minHeight: "100vh",
      bgcolor: stats.goalHit ? "#e8f5e9" : "#fff3e0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      p: 2
    }}>
      <Card sx={{ p: 3, width: "100%", maxWidth: 440, borderRadius: 4 }}>

        <Typography variant="h4" sx={{ textAlign: "center", mb: 1 }}>
          {stats.goalHit ? "🏆" : "📊"}
        </Typography>

        <Typography variant="h5" fontWeight="bold" sx={{ textAlign: "center", mb: 0.5 }}>
          Season Complete
        </Typography>

        <Typography variant="body2" sx={{ textAlign: "center", opacity: 0.6, mb: 3 }}>
          {stats.seasonName}
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {[
          { label: "Days Worked", value: `${stats.daysWorked} / ${stats.totalWorkDays}` },
          { label: "Total Gross Sales", value: formatCurrency(stats.totalGrossSales) },
          { label: "Commission Earned", value: formatCurrency(stats.totalIncome) },
          { label: "Bonus", value: formatCurrency(stats.totalBonus) },
          { label: "Total Earnings", value: formatCurrency(stats.totalEarnings), bold: true },
          { label: "Win Rate", value: `${stats.winRate}%` },
          { label: "Best Streak", value: `${stats.bestStreak} days 🔥` },
          {
            label: "Goal",
            value: stats.goalHit ? "✅ Hit!" : "⚠️ Not reached",
            color: stats.goalHit ? "green" : "orange"
          }
        ].map(({ label, value, bold, color }) => (
          <Box key={label} sx={{
            display: "flex",
            justifyContent: "space-between",
            mb: 1.5
          }}>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>{label}</Typography>
            <Typography
              variant="body2"
              fontWeight={bold ? "bold" : "normal"}
              color={color || "inherit"}
            >
              {value}
            </Typography>
          </Box>
        ))}

        <Divider sx={{ my: 3 }} />

        <Button
          fullWidth
          variant="contained"
          size="large"
          disabled={starting}
          onClick={() => navigate("/setup")}
          sx={{ mb: 1.5 }}
        >
          🚀 Start New Season
        </Button>

        <Button
          fullWidth
          variant="outlined"
          onClick={() => navigate("/")}
        >
          Back to Dashboard
        </Button>

      </Card>
    </Box>
  )
}

export default SeasonComplete