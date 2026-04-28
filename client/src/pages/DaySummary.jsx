// client/src/pages/DaySummary.jsx
import { useLocation, useNavigate } from "react-router-dom"
import { Box, Card, Typography, Button } from "@mui/material"

const DaySummary = () => {
  const { state } = useLocation()
  const navigate = useNavigate()

  const summary = state?.summary

  if (!summary) {
    return <p style={{ padding: 20 }}>No summary found</p>
  }

  // 🛡 SAFE NUMBER NORMALIZATION (CRITICAL FIX)
  const num = (v) => {
    const n = Number(v)
    return isNaN(n) ? 0 : n
  }

  const sales = num(summary.todaySales)
  const target = num(summary.todayTarget)

  // 🚨 FIX: NEVER TRUST RAW DIFFERENCE WITHOUT FALLBACK
  const diff = num(
    summary.difference ?? (sales - target)
  )

  const absDiff = Math.abs(diff)
  const isWin = diff >= 0

  const performanceRatio = target > 0 ? sales / target : 0

  // 🧠 MESSAGE LOGIC (CLEAN + CONSISTENT)
  const getMessage = () => {
    if (isWin && performanceRatio >= 1.2) {
      return `🔥 You crushed your target by $${diff.toFixed(0)} — elite performance`
    }

    if (isWin) {
      return `✅ You beat your target by $${diff.toFixed(0)} — solid day`
    }

    if (!isWin && performanceRatio >= 0.9) {
      return `⚡ So close — only $${absDiff.toFixed(0)} away from your target`
    }

    if (!isWin && performanceRatio >= 0.75) {
      return `📊 You missed your target by $${absDiff.toFixed(0)} — you're in striking distance`
    }

    return `📉 You missed your target by $${absDiff.toFixed(0)} — tomorrow is a reset opportunity`
  }

  const getTitle = () => {
    if (isWin && performanceRatio >= 1.2) return "🔥 Elite Day!"
    if (isWin) return "🎉 Strong Finish!"
    if (performanceRatio >= 0.9) return "⚡ Very Close Day"
    return "📊 Day Complete"
  }

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
          {getTitle()}
        </Typography>

        <Typography sx={{ mt: 2 }}>
          Sales: ${sales.toFixed(0)}
        </Typography>

        <Typography>
          Target: ${target.toFixed(0)}
        </Typography>

        <Typography
          sx={{
            mt: 2,
            fontWeight: "bold",
            color: isWin ? "green" : "orange"
          }}
        >
          {getMessage()}
        </Typography>

        <Typography sx={{ mt: 2 }}>
          🔥 Streak: {summary.streak || 0} days
        </Typography>

        <Typography sx={{ mt: 2, fontStyle: "italic", opacity: 0.8 }}>
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