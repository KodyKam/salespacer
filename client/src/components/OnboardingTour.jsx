import { useState, useEffect } from "react"
import {
  Box, Typography, Button, Backdrop
} from "@mui/material"

const steps = [
  {
    title: "Welcome to SalesPacer 🔥",
    description: "Your personal sales coach. Let's take a quick tour so you know exactly how to use it.",
    position: "center",
    target: null
  },
  {
    title: "Add a Sale ➕",
    description: "Tap the + button in the bottom nav or the floating button to log a sale. Takes less than 10 seconds.",
    position: "bottom",
    target: "bottom-nav-add"
  },
  {
    title: "Finish Your Day 🏁",
    description: "When you're done selling for the day, tap Finish Day to lock in your results and update your stats.",
    position: "bottom",
    target: "finish-day"
  },
  {
    title: "Track Your Stats 📊",
    description: "Tap the Stats icon to see your activity, graphs, win rate and calendar. Pro users get full access.",
    position: "bottom",
    target: "bottom-nav-stats"
  }
]

const OnboardingTour = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const [visible, setVisible] = useState(true)

  const current = steps[step]
  const isLast = step === steps.length - 1

  const handleNext = () => {
    if (isLast) {
      setVisible(false)
      localStorage.setItem("tourCompleted", "true")
      onComplete?.()
    } else {
      setStep(step + 1)
    }
  }

  const handleSkip = () => {
    setVisible(false)
    localStorage.setItem("tourCompleted", "true")
    onComplete?.()
  }

  if (!visible) return null

  return (
    <Backdrop
      open={visible}
      sx={{ zIndex: 2000, alignItems: "flex-end", pb: step === 0 ? 0 : 10 }}
    >
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: step === 0 ? "16px 16px 16px 16px" : "16px 16px 0 0",
          p: 3,
          mx: 2,
          mb: step === 0 ? "auto" : 0,
          mt: step === 0 ? "auto" : 0,
          maxWidth: 420,
          width: "100%",
          boxShadow: 6
        }}
      >
        {/* Step indicator */}
        <Box sx={{ display: "flex", gap: 0.5, mb: 2 }}>
          {steps.map((_, i) => (
            <Box
              key={i}
              sx={{
                height: 4,
                flex: 1,
                borderRadius: 2,
                bgcolor: i <= step ? "#1976d2" : "#e0e0e0",
                transition: "background 0.3s"
              }}
            />
          ))}
        </Box>

        <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
          {current.title}
        </Typography>

        <Typography variant="body2" sx={{ opacity: 0.7, mb: 3, lineHeight: 1.7 }}>
          {current.description}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Button
            size="small"
            sx={{ opacity: 0.5 }}
            onClick={handleSkip}
          >
            Skip tour
          </Button>

          <Button
            variant="contained"
            onClick={handleNext}
            size="large"
          >
            {isLast ? "Let's go! 🚀" : "Next →"}
          </Button>
        </Box>
      </Box>
    </Backdrop>
  )
}

export default OnboardingTour