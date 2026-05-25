// client/src/pages/SeasonHistory.jsx
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../api/axios"
import {
  Box, Card, Typography, IconButton,
  Chip, CircularProgress
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"

const SeasonHistory = () => {
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get("/season/history")
      .then(res => setHistory(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <Box sx={{ p: 2, maxWidth: 480, mx: "auto" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <IconButton onClick={() => navigate("/")}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" fontWeight="bold">Season History</Typography>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && history.length === 0 && (
        <Typography sx={{ opacity: 0.6, textAlign: "center", mt: 4 }}>
          No completed seasons yet.
        </Typography>
      )}

      {history.map(season => (
        <Card key={season._id} sx={{ p: 2.5, borderRadius: 3, mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
            <Typography fontWeight="bold">{season.name || "Unnamed Season"}</Typography>
            <Chip
              label={season.goalHit ? "Goal Hit ✅" : "Goal Missed"}
              size="small"
              sx={{
                bgcolor: season.goalHit ? "#e8f5e9" : "#fff3e0",
                color: season.goalHit ? "green" : "orange",
                fontWeight: "bold"
              }}
            />
          </Box>

          <Typography variant="caption" sx={{ opacity: 0.5, display: "block", mb: 2 }}>
            {new Date(season.startDate).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" })}
            {" → "}
            {new Date(season.endDate).toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" })}
          </Typography>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
            {[
              { label: "Gross Sales", value: `$${Number(season.totalGrossSales).toFixed(0)}` },
              { label: "Earnings", value: `$${Number(season.totalIncome).toFixed(0)}` },
              { label: "Days Worked", value: `${season.daysWorked}/${season.totalWorkDays}` },
              { label: "Win Rate", value: `${season.winRate}%` }
            ].map(({ label, value }) => (
              <Box key={label} sx={{ bgcolor: "#f5f5f5", borderRadius: 2, p: 1 }}>
                <Typography variant="caption" sx={{ opacity: 0.6 }}>{label}</Typography>
                <Typography fontWeight="bold">{value}</Typography>
              </Box>
            ))}
          </Box>
        </Card>
      ))}
    </Box>
  )
}

export default SeasonHistory