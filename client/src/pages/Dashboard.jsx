// client/src/pages/Dashboard.jsx
import { useDashboard } from "../hooks/useDashboard"
import DayActionsBar from "../components/DayActionsBar"
import StatsModal from "../components/StatsModal"
import { useNavigate } from "react-router-dom"
import { Box, Card, Typography, Stack } from "@mui/material"
import BottomNav from "../components/BottomNav"
import FloatingAddSale from "../components/FloatingAddSale"
import axios from "../api/axios"
import { useState, useEffect } from "react"
import { Snackbar, Alert } from "@mui/material"

const Dashboard = () => {
  const { data, refresh } = useDashboard()
  const navigate = useNavigate()

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 20)
  }

  window.addEventListener("scroll", handleScroll)
  return () => window.removeEventListener("scroll", handleScroll)
}, [])

  const endDay = async () => {
    try {
      const res = await axios.post("/day/end")
      navigate("/day-summary", { state: { summary: res.data } })
    } catch (err) {
      console.error(err)
    }
  }

  const [toast, setToast] = useState({
    open: false,
    amount: 0
  })

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

    const isComplete = safe.todaySales >= safe.todayTarget

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f6f7fb", pb: 10 }}>
      
      {safe.isDayCompleted && (
        <Card sx={{ m: 2, p: 2, bgcolor: "#e8f5e9" }}>
          <Typography fontWeight="bold">🔒 Day locked</Typography>
          <Typography variant="body2">
            Great work. Come back tomorrow.
          </Typography>
        </Card>
      )}

      <Box
  sx={{
    position: "sticky",
    top: 0,
    zIndex: 1000,
    transition: "all 0.25s ease",
    backdropFilter: scrolled ? "blur(8px)" : "none",
    backgroundColor: scrolled ? "rgba(246,247,251,0.85)" : "transparent",
    boxShadow: scrolled ? "0 4px 12px rgba(0,0,0,0.08)" : "none"
  }}
>
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 1.5,
      py: scrolled ? 1 : 2,
      transition: "all 0.25s ease"
    }}
  >
    {/* LOGO */}
    <Box
      component="img"
      src="/logo.png"
      alt="SalesPacer Logo"
      sx={{
        width: scrolled ? 36 : 70,
        height: scrolled ? 36 : 70,
        transition: "all 0.25s ease",
        borderRadius: 2
      }}
    />

    {/* TITLE */}
    <Typography
      variant="h5"
      fontWeight="bold"
      sx={{
        fontSize: scrolled ? "1rem" : "1.25rem",
        transition: "all 0.25s ease"
      }}
    >
      🔥 Sales Pacer 🔥
    </Typography>
  </Box>
</Box>

      <Stack spacing={2} sx={{ px: 2, mt: 2 }}>
        <Card
  sx={{
    p: 2,
    borderRadius: 3,
    bgcolor: isComplete ? "#1b5e20" : "#111",
    color: "white",
    transition: "all 0.3s ease"
  }}
>
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

  {/* PROGRESS BAR */}
  <Box sx={{ mt: 2 }}>
    <Box
      sx={{
        height: 8,
        borderRadius: 5,
        background: "rgba(255,255,255,0.2)"
      }}
    >
      <Box
        sx={{
          width: `${safe.dailyProgressPercent}%`,
          height: "100%",
          background: isComplete ? "#66bb6a" : "#4caf50",
          transition: "width 0.3s ease"
        }}
      />
    </Box>

    <Typography variant="caption">
      {safe.dailyProgressPercent.toFixed(0)}%
    </Typography>
  </Box>

  {/* STATUS */}
  <Typography sx={{ mt: 1, fontWeight: "bold" }}>
    {isComplete
      ? "✅ Target hit — everything now is bonus"
      : safe.isOnTrackToday
      ? `🔥 Ahead by $${safe.todayDifference.toFixed(0)}`
      : `⚠️ $${safe.remainingToday.toFixed(0)} to goal`}
  </Typography>
</Card>

        <Card sx={{ p: 2 }}>
          <Typography variant="subtitle2">NEXT ACTION</Typography>
          <Typography fontWeight="bold">
            👉 {isComplete
              ? "You're done for today. Add extra if you want to get ahead."
              : safe.nextAction}
          </Typography>
        </Card>

        <DayActionsBar
          onEndDay={endDay}
          disabled={safe.isDayCompleted}
        />
      </Stack>

      {/* 🔥 THIS IS THE KEY */}
      <FloatingAddSale
        disabled={safe.isDayCompleted}
        onSuccess={(amount) => {
          refresh()

          setToast({
            open: true,
            amount
          })
        }}
      />

      <BottomNav />
      <Snackbar
        open={toast.open}
        autoHideDuration={2000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled">
          +${toast.amount} added
        </Alert>
      </Snackbar>
      <StatsModal entries={data.entries} />
    </Box>
  )
}

export default Dashboard