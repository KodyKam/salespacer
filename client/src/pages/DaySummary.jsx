// client/src/pages/DaySummary.jsx
import { useLocation, useNavigate } from "react-router-dom"
import { Box, Card, Typography, Button, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import axios from "../api/axios"

const DaySummary = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [summary, setSummary] = useState(location.state?.summary || null)
  const [editingBonus, setEditingBonus] = useState(false)
  const [bonusValue, setBonusValue] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!summary) {
      axios.get("/dashboard")
        .then(res => {
          if (res.data?.isDayCompleted) {
            setSummary({
              todaySales: res.data.todaySales,
              todayTarget: res.data.todayTarget,
              difference: res.data.todayDifference,
              streak: res.data.streak,
              message: "Loaded from server"
            })
          }
        })
        .catch(() => {})
    }
  }, [summary])

  if (!summary) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography>No summary available.</Typography>
        <Button onClick={() => navigate("/")} sx={{ mt: 2 }}>
          Back to Dashboard
        </Button>
      </Box>
    )
  }

  const num = (v) => {
    const n = Number(v)
    return isNaN(n) ? 0 : n
  }

  const sales = num(summary.todaySales)
  const target = num(summary.todayTarget)
  const diff = num(summary.difference ?? (sales - target))
  const absDiff = Math.abs(diff)
  const isWin = diff >= 0
  const performanceRatio = target > 0 ? sales / target : 0
  const bonus = num(summary.bonus)

  const getMessage = () => {
    if (isWin && performanceRatio >= 1.2) return `🔥 You crushed your target by $${diff.toFixed(0)} — elite performance`
    if (isWin) return `✅ You beat your target by $${diff.toFixed(0)} — solid day`
    if (!isWin && performanceRatio >= 0.9) return `⚡ So close — only $${absDiff.toFixed(0)} away from your target`
    if (!isWin && performanceRatio >= 0.75) return `📊 You missed your target by $${absDiff.toFixed(0)} — you're in striking distance`
    return `📉 You missed your target by $${absDiff.toFixed(0)} — tomorrow is a reset opportunity`
  }

  const getTitle = () => {
    if (isWin && performanceRatio >= 1.2) return "🔥 Elite Day!"
    if (isWin) return "🎉 Strong Finish!"
    if (performanceRatio >= 0.9) return "⚡ Very Close Day"
    return "📊 Day Complete"
  }

  const handleSaveBonus = async () => {
    if (!summary.summaryId) return
    try {
      setSaving(true)
      await axios.put("/day/summary", {
        summaryId: summary.summaryId,
        bonus: Number(bonusValue)
      })
      setSummary({ ...summary, bonus: Number(bonusValue) })
      setEditingBonus(false)
    } catch (err) {
      alert("Failed to save bonus")
    } finally {
      setSaving(false)
    }
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

        <Typography sx={{ mt: 2, fontWeight: "bold", color: isWin ? "green" : "orange" }}>
          {getMessage()}
        </Typography>

        <Typography sx={{ mt: 2 }}>
          🔥 Streak: {summary.streak || 0} days
        </Typography>

        {/* Bonus section */}
        <Box sx={{ mt: 3, p: 2, bgcolor: "#f9f9f9", borderRadius: 2 }}>
          {editingBonus ? (
            <>
              <TextField
                fullWidth
                label="Bonus ($)"
                type="number"
                value={bonusValue}
                onChange={(e) => setBonusValue(e.target.value)}
                size="small"
                sx={{ mb: 1 }}
              />
              <Button
                variant="contained"
                size="small"
                onClick={handleSaveBonus}
                disabled={saving}
                sx={{ mr: 1 }}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button size="small" onClick={() => setEditingBonus(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Typography variant="body2" sx={{ opacity: 0.6 }}>
                Bonus
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                ${bonus.toFixed(0)}
              </Typography>
              <Button
                size="small"
                sx={{ mt: 0.5 }}
                onClick={() => {
                  setBonusValue(bonus)
                  setEditingBonus(true)
                }}
              >
                {bonus > 0 ? "Edit Bonus" : "+ Add Bonus"}
              </Button>
            </>
          )}
        </Box>

        {/* Notes */}
        {summary.notes && (
          <Box sx={{ mt: 2, p: 2, bgcolor: "#f9f9f9", borderRadius: 2, textAlign: "left" }}>
            <Typography variant="caption" sx={{ opacity: 0.6 }}>NOTES</Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {summary.notes}
            </Typography>
          </Box>
        )}

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