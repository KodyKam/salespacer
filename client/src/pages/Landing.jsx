// client/src/pages/Landing.jsx
import { Box, Typography, Button, Stack, Divider } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import Footer from "../components/Footer"

const Landing = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) navigate("/")
  }, [navigate])

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#111", color: "white" }}>

      {/* HERO */}
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        px: 3,
        pt: 8,
        pb: 6
      }}>
        <Box
          component="img"
          src="/logo.png"
          alt="SalesPacer"
          sx={{ width: 80, borderRadius: 2, mb: 2 }}
        />

        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ opacity: 0.6, letterSpacing: 2, mb: 1, fontSize: 13 }}
        >
          SALESPACER
        </Typography>

        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{ fontSize: { xs: "2rem", sm: "2.5rem" }, mb: 2 }}
        >
          Your Personal Sales Coach
        </Typography>

        <Typography sx={{ opacity: 0.6, maxWidth: 360, mb: 1, fontSize: 16, lineHeight: 1.7 }}>
          Know exactly how much you need to sell today to hit your income goal. No spreadsheets. No guesswork.
        </Typography>

        <Typography sx={{ opacity: 0.4, mb: 4, fontSize: 13 }}>
          Built for commission-based salespeople. In the field. On the move.
        </Typography>

        <Stack spacing={1.5} sx={{ width: "100%", maxWidth: 340 }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => navigate("/register")}
            sx={{
              py: 1.8,
              fontSize: 16,
              fontWeight: "bold",
              borderRadius: 2,
              bgcolor: "#1976d2"
            }}
          >
            Start Free — 7 Day Pro Trial
          </Button>

          <Typography variant="caption" sx={{ opacity: 0.4, textAlign: "center" }}>
            No charge for 7 days. Then $4.99/month. Cancel anytime.
          </Typography>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            onClick={() => navigate("/login")}
            sx={{
              py: 1.5,
              borderRadius: 2,
              borderColor: "rgba(255,255,255,0.2)",
              color: "white",
              "&:hover": { borderColor: "rgba(255,255,255,0.4)" }
            }}
          >
            Log In
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mx: 3 }} />

      {/* HOW IT WORKS */}
      <Box sx={{ px: 3, py: 6, maxWidth: 480, mx: "auto" }}>
        <Typography
          variant="overline"
          sx={{ opacity: 0.4, display: "block", textAlign: "center", mb: 4 }}
        >
          How it works
        </Typography>

        <Stack spacing={3}>
          {[
            {
              icon: "🎯",
              title: "Set your season",
              body: "Enter your income goal, commission rate, tax rate and working days. SalesPacer calculates exactly what you need to sell."
            },
            {
              icon: "➕",
              title: "Log sales in seconds",
              body: "Tap the + button after each sale. The whole interaction takes under 10 seconds so it fits inside your sales day."
            },
            {
              icon: "📊",
              title: "Track your pace",
              body: "Your daily target adjusts automatically. Crush it today and tomorrow's number drops. Slow day? It recalibrates."
            },
            {
              icon: "🏁",
              title: "Finish strong",
              body: "End each day with a summary. Track your streak, win rate, and season progress. Know where you stand at all times."
            }
          ].map(({ icon, title, body }) => (
            <Box key={title} sx={{ display: "flex", gap: 2 }}>
              <Typography sx={{ fontSize: 24, mt: 0.3 }}>{icon}</Typography>
              <Box>
                <Typography fontWeight="bold" sx={{ mb: 0.5 }}>{title}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.5, lineHeight: 1.7 }}>
                  {body}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mx: 3 }} />

      {/* PRICING */}
      <Box sx={{ px: 3, py: 6, maxWidth: 480, mx: "auto", textAlign: "center" }}>
        <Typography
          variant="overline"
          sx={{ opacity: 0.4, display: "block", mb: 4 }}
        >
          Pricing
        </Typography>

        <Stack spacing={2}>
          {/* Free */}
          <Box sx={{
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 3, p: 3, textAlign: "left"
          }}>
            <Typography fontWeight="bold" sx={{ mb: 0.5 }}>Free</Typography>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>$0</Typography>
            {[
              "Daily sales tracking",
              "Dynamic daily target",
              "Streak tracking",
              "Finish day summary"
            ].map(f => (
              <Typography key={f} variant="body2" sx={{ opacity: 0.5, mb: 0.5 }}>
                ✓ {f}
              </Typography>
            ))}
          </Box>

          {/* Pro */}
          <Box sx={{
            border: "1px solid #1976d2",
            borderRadius: 3, p: 3, textAlign: "left",
            bgcolor: "rgba(25,118,210,0.08)"
          }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
              <Typography fontWeight="bold">Pro</Typography>
              <Box sx={{
                bgcolor: "#1976d2", borderRadius: 1,
                px: 1, py: 0.3
              }}>
                <Typography variant="caption" fontWeight="bold">7 DAYS FREE</Typography>
              </Box>
            </Box>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 0.5 }}>
              $4.99<Typography component="span" variant="body2" sx={{ opacity: 0.5 }}>/month</Typography>
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.4, display: "block", mb: 2 }}>
              or $49.99/year — save 17%
            </Typography>
            {[
              "Everything in Free",
              "Performance graphs",
              "Win rate & streaks",
              "Calendar view",
              "Pace projections",
              "CSV export for income reporting",
              "Season history"
            ].map(f => (
              <Typography key={f} variant="body2" sx={{ opacity: 0.6, mb: 0.5 }}>
                ✓ {f}
              </Typography>
            ))}
          </Box>
        </Stack>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mx: 3 }} />

      {/* FINAL CTA */}
      <Box sx={{ px: 3, py: 6, textAlign: "center", maxWidth: 480, mx: "auto" }}>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
          Ready to stop guessing?
        </Typography>
        <Typography sx={{ opacity: 0.5, mb: 4, fontSize: 14 }}>
          Join salespeople who track smarter, pace better, and finish stronger.
        </Typography>
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={() => navigate("/register")}
          sx={{
            py: 1.8,
            fontSize: 16,
            fontWeight: "bold",
            borderRadius: 2,
            maxWidth: 340
          }}
        >
          Start Free — 7 Day Pro Trial
        </Button>
        <Typography variant="caption" sx={{ opacity: 0.4, display: "block", mt: 1 }}>
          No charge for 7 days. Then $4.99/month. Cancel anytime.
        </Typography>
      </Box>

      <Footer />
    </Box>
  )
}

export default Landing