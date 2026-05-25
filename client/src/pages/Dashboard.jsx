// client/src/pages/Dashboard.jsx
import { useDashboard } from "../hooks/useDashboard"
import DayActionsBar from "../components/DayActionsBar"
import StatsModal from "../components/StatsModal"
import { useNavigate } from "react-router-dom"
import { Box, Card, Typography, Stack, Button } from "@mui/material"
import BottomNav from "../components/BottomNav"
import FloatingAddSale from "../components/FloatingAddSale"
import axios from "../api/axios"
import { useState, useEffect } from "react"
import { Snackbar, Alert } from "@mui/material"
import LogoutIcon from "@mui/icons-material/Logout"
import { IconButton } from "@mui/material"
import OnboardingTour from "../components/OnboardingTour"

const Dashboard = () => {
  const { data, refresh } = useDashboard()
  const navigate = useNavigate()

  const [scrolled, setScrolled] = useState(false)
  const [toast, setToast] = useState({ open: false, amount: 0 })
  const [openAdd, setOpenAdd] = useState(false)
  const [dismissedYesterday, setDismissedYesterday] = useState(false)
  const [showTour, setShowTour] = useState(false)

  // Add scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
  // Auto-show tour for first time users
  const tourDone = localStorage.getItem("tourCompleted")
  if (!tourDone) {
    setTimeout(() => setShowTour(true), 1000) // slight delay so dashboard loads first
  }

  // Manual trigger from Settings
  const tourHandler = () => setShowTour(true)
  window.addEventListener("start-tour", tourHandler)
  return () => window.removeEventListener("start-tour", tourHandler)
}, [])

  const isDayCompleted = data?.isDayCompleted ?? false

  const closeYesterday = async () => {
  try {
    await axios.post("/day/end-unclosed", { date: safe.unclosedDate })
    await refresh()
    setDismissedYesterday(true)
  } catch (err) {
    alert(err?.response?.data?.message || "Failed to close day")
  }
}

  const startNewDay = async () => {
    try {
      await axios.post("/day/start")
      await refresh()
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to start new day")
    }
  }

  const endDay = async ({ notes = "", bonus = 0 } = {}) => {
  try {
    const res = await axios.post("/day/end", { notes, bonus })

    const summary = {
      ...res.data,
      timestamp: new Date().toISOString()
    }

    await refresh()

    navigate("/day-summary", { state: { summary } })
    return true

  } catch (err) {
    console.error("END DAY FAILED:", err)
    alert(err?.response?.data?.message || "Failed to end day. Try again.")
    return false
  }
}

const endSeason = async () => {
  if (!confirm("Are you sure you want to end this season? This cannot be undone.")) return
  try {
    const res = await axios.post("/season/end")
    navigate("/season-complete", { state: { stats: res.data } })
  } catch (err) {
    alert(err?.response?.data?.message || "Failed to end season")
  }
}

  const loading = data === undefined

  if (loading) return <p>Loading...</p>

  if (data === null) {
    return <p>Server error / auth issue</p>
  }

  const safe = {
    todaySales: Number(data?.todaySales ?? 0),
    todayTarget: Number(data?.todayTarget ?? 0),
    todayDifference: Number(data?.todayDifference ?? 0),
    dailyProgressPercent: Number(data?.dailyProgressPercent ?? 0),
    remainingToday: Number(data?.remainingToday ?? 0),
    streakStatus: data?.streakStatus ?? "",
    nextAction: data?.nextAction ?? "Make your first sale today",
    isOnTrackToday: data?.isOnTrackToday ?? true,
    isDayCompleted: data?.isDayCompleted ?? false,
    entries: data?.entries ?? [],
    summaries: data?.summaries ?? [],
    streak: data?.streak ?? 0,
    hasUnclosedYesterday: data?.hasUnclosedYesterday ?? false,
    unclosedYesterdaySales: Number(data?.unclosedYesterdaySales ?? 0),
    progressPercent: Number(data?.progressPercent ?? 0),
    totalVolume: Number(data?.totalVolume ?? 0),
    unclosedDate: data?.unclosedDate || null,
    seasonComplete: data?.seasonComplete ?? false,
    completedDays: Number(data?.completedDays ?? 0)
  }

  const isComplete = safe.todaySales >= safe.todayTarget
  const hasSeason = Boolean(data?.seasonId || data?.todayTarget)

  if (!hasSeason) {
    return (
      <Box sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3
      }}>
        <Card sx={{ p: 4, textAlign: "center", maxWidth: 420 }}>
          <Typography variant="h5" fontWeight="bold">
            Welcome to SalesPacer
          </Typography>

          <Typography sx={{ mt: 1, opacity: 0.7 }}>
            Let's set your income target and start tracking.
          </Typography>

          <Button
            variant="contained"
            sx={{ mt: 3 }}
            onClick={() => navigate("/setup")}
          >
            Create Your First Season
          </Button>
        </Card>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f6f7fb", pb: 10 }}>

      {/* HEADER */}
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
  <Box sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    px: 2,
    py: scrolled ? 1 : 2
  }}>
    <Box sx={{ width: 40 }} /> {/* spacer for centering */}

    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      <Box
        component="img"
        src="/logo.png"
        alt="SalesPacer Logo"
        sx={{
          width: scrolled ? 28 : 48,
          height: scrolled ? 28 : 48,
          transition: "all 0.25s ease",
          borderRadius: 2
        }}
      />
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

    <IconButton
      onClick={() => {
        localStorage.removeItem("token")
        window.location.href = "/welcome"
      }}
      sx={{ color: "text.secondary" }}
    >
      <LogoutIcon fontSize="small" />
    </IconButton>
  </Box>
</Box>

{/* UNCLOSED YESTERDAY BANNER */}
{safe.hasUnclosedYesterday && !dismissedYesterday && (
  <Box sx={{
    mx: 2, mt: 2,
    p: 2,
    borderRadius: 2,
    bgcolor: "#fff3e0",
    border: "1px solid #ffe0b2",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 1
  }}>
    <Box>
      <Typography variant="body2" fontWeight="bold">
        ⚠️ You have an unclosed sales day
      </Typography>
      <Typography variant="caption" sx={{ opacity: 0.7 }}>
        ${safe.unclosedYesterdaySales.toFixed(0)} in sales from{" "}
  {safe.unclosedDate
    ? new Date(safe.unclosedDate).toLocaleDateString("en-CA", { month: "short", day: "numeric" })
    : "a previous day"
  } — close it to update your stats
</Typography>
    </Box>
    <Box sx={{ display: "flex", gap: 1 }}>
      <Button
        size="small"
        variant="contained"
        color="warning"
        onClick={closeYesterday}
      >
        Close Yesterday
      </Button>
      <Button
        size="small"
        onClick={() => setDismissedYesterday(true)}
      >
        Dismiss
      </Button>
    </Box>
  </Box>
)}

{safe.seasonComplete && (
  <Box sx={{
    mx: 2, mt: 2, p: 2,
    borderRadius: 2,
    bgcolor: "#e8f5e9",
    border: "1px solid #c8e6c9",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 1
  }}>
    <Box>
      <Typography variant="body2" fontWeight="bold">
        🏆 Season Complete!
      </Typography>
      <Typography variant="caption" sx={{ opacity: 0.7 }}>
        You've worked all {safe.completedDays} planned days — ready to wrap up?
      </Typography>
    </Box>
    <Button
      size="small"
      variant="contained"
      color="success"
      onClick={endSeason}
    >
      End Season
    </Button>
  </Box>
)}

      {/* MAIN */}
      <Stack spacing={2} sx={{ px: 2, mt: 2 }}>

        <Card sx={{
          p: 2,
          borderRadius: 3,
          bgcolor: isComplete ? "#1b5e20" : "#111",
          color: "white"
        }}>
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
                  background: isComplete ? "#66bb6a" : "#4caf50"
                }}
              />
            </Box>

            <Typography variant="caption">
              {safe.dailyProgressPercent.toFixed(0)}%
            </Typography>
          </Box>

          <Typography sx={{ mt: 1, fontWeight: "bold" }}>
            {isComplete
              ? "✅ Target hit — bonus mode"
              : safe.isOnTrackToday
              ? `🔥 Ahead by $${safe.todayDifference.toFixed(0)}`
              : `⚠️ $${safe.remainingToday.toFixed(0)} to goal`}
          </Typography>
        </Card>

        {/* SEASON PROGRESS */}
{hasSeason && (
  <Card sx={{ p: 2, borderRadius: 3 }}>
    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
      <Typography variant="subtitle2" sx={{ opacity: 0.6 }}>
        SEASON PROGRESS
      </Typography>
      <Typography variant="subtitle2" fontWeight="bold">
        {safe.progressPercent.toFixed(1)}%
      </Typography>
    </Box>

    <Box sx={{
      height: 10,
      borderRadius: 5,
      bgcolor: "#e0e0e0",
      overflow: "hidden"
    }}>
      <Box sx={{
        width: `${Math.min(safe.progressPercent, 100)}%`,
        height: "100%",
        borderRadius: 5,
        bgcolor: safe.progressPercent >= 100 ? "#4caf50" : "#1976d2",
        transition: "width 0.5s ease"
      }} />
    </Box>

    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
      <Typography variant="caption" sx={{ opacity: 0.6 }}>
        ${Number(data?.totalVolume ?? 0).toFixed(0)} sold
      </Typography>
      <Typography variant="caption" sx={{ opacity: 0.6 }}>
        Goal: ${Number(data?.season?.requiredVolume ?? 0).toFixed(0)}
      </Typography>
    </Box>
  </Card>
)}

        {/* ACTION AREA (STATE SWITCH) */}
        {safe.isDayCompleted ? (
  <Card
    sx={{
      p: 3,
      borderRadius: 3,
      textAlign: "center",
      bgcolor: "#e8f5e9",
      border: "1px solid #c8e6c9"
    }}
  >
    <Typography variant="h6" fontWeight="bold">
      🔒 Day Complete
    </Typography>

    <Typography sx={{ mt: 1, opacity: 0.8 }}>
      Nice work today — everything is locked in.
    </Typography>

    <Typography sx={{ mt: 2, fontWeight: "bold" }}>
      Streak: {safe.streak} 🔥
    </Typography>

    <Button
      variant="outlined"
      sx={{ mt: 2, mr: 1 }}
      onClick={() => navigate("/day-summary", { state: { summary: { ...safe } } })}
    >
      View Summary
    </Button>

    <Button
      variant="contained"
      sx={{ mt: 2 }}
      onClick={async () => {
        await startNewDay()
        await refresh()
      }}
    >
      + Forgot a Sale?
    </Button>

    <Typography sx={{ mt: 2, fontSize: 12, opacity: 0.6 }}>
      Unlocking will let you add missed sales to today's total.
    </Typography>
  </Card>
) : (
  <>
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
  </>
)}
      </Stack>

      {/* ADD SALE */}
      <FloatingAddSale
  open={openAdd}
  onOpen={() => setOpenAdd(true)}
  onClose={() => setOpenAdd(false)}
  disabled={safe.isDayCompleted || !hasSeason}
  onSuccess={async (amount) => {
    setOpenAdd(false)
    await refresh()
    setToast({ open: true, amount })
  }}
/>

      <BottomNav
        isDayCompleted={safe.isDayCompleted}
        onAddSale={() => setOpenAdd(true)}
        onStartDay={startNewDay}
      />

      {/* TOAST */}
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

      <StatsModal entries={safe.entries} summaries={safe.summaries} todayTarget={safe.todayTarget} season={data?.season} />
    {showTour && (
      <OnboardingTour onComplete={() => setShowTour(false)} />
    )}
    </Box>
  )
}

export default Dashboard