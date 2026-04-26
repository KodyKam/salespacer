// client/src/pages/Dashboard.jsx
import { useDashboard } from "../hooks/useDashboard"
import DayActionsBar from "../components/DayActionsBar"
import { useNavigate } from "react-router-dom"
import { Box, Card, Typography, Stack } from "@mui/material"
import BottomNav from "../components/BottomNav"
import FloatingAddSale from "../components/FloatingAddSale"
import axios from "../api/axios"
import { useState } from "react"

const Dashboard = () => {
  const { data, refresh } = useDashboard()
  const navigate = useNavigate()

  const endDay = async () => {
    try {
      const res = await axios.post("/day/end")
      navigate("/day-summary", { state: { summary: res.data } })
    } catch (err) {
      console.error(err)
    }
  }

  if (!data) return <p style={{ padding: 16 }}>Loading...</p>

  const safe = {
    todaySales: Number(data?.todaySales ?? 0),
    todayTarget: Number(data?.todayTarget ?? 0),
    todayDifference: Number(data?.todayDifference ?? 0),
    dailyProgressPercent: Number(data?.dailyProgressPercent ?? 0),
    remainingToday: Number(data?.remainingToday ?? 0),
    streakStatus: data?.streakStatus ?? "",
    nextAction: data?.nextAction ?? "Make your first sale today",
    isOnTrackToday: data?.isOnTrackToday ?? true,
    isDayCompleted: data?.isDayCompleted ?? false
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f6f7fb", pb: 10 }}>
      
      {safe.isDayCompleted && (
        <Card sx={{ m: 2, p: 2, bgcolor: "#e8f5e9" }}>
          <Typography fontWeight="bold">✅ Day completed</Typography>
          <Typography variant="body2">
            Great work. Come back tomorrow.
          </Typography>
        </Card>
      )}

      <Box sx={{ px: 2, pt: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          SalesPacer
        </Typography>
      </Box>

      <Stack spacing={2} sx={{ px: 2, mt: 2 }}>
        <Card sx={{ p: 2, borderRadius: 3, bgcolor: "#111", color: "white" }}>
          <Typography variant="subtitle2">TODAY FOCUS</Typography>

          <Typography variant="h3" fontWeight="bold">
            ${safe.todaySales.toFixed(0)}
          </Typography>

          <Typography variant="body2">
            Target: ${safe.todayTarget.toFixed(0)}
          </Typography>

          <Typography sx={{ mt: 1, fontSize: 12, opacity: 0.7 }}>
            {safe.streakStatus}
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Box sx={{ height: 8, borderRadius: 5, background: "rgba(255,255,255,0.2)" }}>
              <Box
                sx={{
                  width: `${safe.dailyProgressPercent}%`,
                  height: "100%",
                  background: "#4caf50"
                }}
              />
            </Box>

            <Typography variant="caption">
              {safe.dailyProgressPercent.toFixed(0)}%
            </Typography>
          </Box>

          <Typography sx={{ mt: 1, fontWeight: "bold" }}>
            {safe.isOnTrackToday
              ? `🔥 Ahead by $${safe.todayDifference.toFixed(0)}`
              : `⚠️ $${safe.remainingToday.toFixed(0)} to goal`}
          </Typography>
        </Card>

        <Card sx={{ p: 2 }}>
          <Typography variant="subtitle2">NEXT ACTION</Typography>
          <Typography fontWeight="bold">
            👉 {safe.nextAction}
          </Typography>
        </Card>

        <DayActionsBar
          onEndDay={endDay}
          disabled={safe.isDayCompleted}
        />
      </Stack>

      {/* 🔥 THIS IS THE KEY */}
      <FloatingAddSale
        onSuccess={refresh}
        disabled={safe.isDayCompleted}
      />

      <BottomNav />
    </Box>
  )
}

export default Dashboard