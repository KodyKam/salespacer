// client/src/components/StatsModal.jsx
import {
  Dialog, DialogTitle, DialogContent,
  Typography, Box, List, ListItem, ListItemText,
  Divider, Tabs, Tab, ToggleButton, ToggleButtonGroup,
  IconButton, Button
} from "@mui/material"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import { useEffect, useState } from "react"
import {
  ComposedChart, Bar, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts"
import { useAuth } from "../context/AuthContext"

const StatsModal = ({ entries = [], summaries = [], todayTarget = 0, season = null }) => {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState(0)
  const [range, setRange] = useState("7")
  const { isPro } = useAuth()

  const today = new Date()
  const [calendarDate, setCalendarDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  )

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener("open-stats", handler)
    return () => window.removeEventListener("open-stats", handler)
  }, [])

  // Group entries by date for activity tab
  const grouped = entries.reduce((acc, entry) => {
    const d = new Date(entry.date)
    if (isNaN(d.getTime())) return acc
    const date = d.toDateString()
    if (!acc[date]) acc[date] = []
    acc[date].push(entry)
    return acc
  }, {})

  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(b) - new Date(a)
  )

  // Build summary lookup by date string
  const summaryByDate = summaries.reduce((acc, s) => {
    const key = new Date(s.date).toDateString()
    acc[key] = s
    return acc
  }, {})

  // Build chart data from summaries
  const getChartData = () => {
    let data = summaries.map(s => ({
      date: new Date(s.date).toLocaleDateString("en-CA", {
        month: "short", day: "numeric"
      }),
      Sales: Math.round(s.sales),
      Target: Math.round(s.target)
    }))

    if (range !== "all") {
      const days = Number(range)
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - days)
      data = data.filter((_, i) => {
        const summaryDate = new Date(summaries[i]?.date)
        return summaryDate >= cutoff
      })
    }

    return data
  }

  // Win rate calculations
  const getWinRate = (days) => {
    let filtered = summaries
    if (days !== "all") {
      const cutoff = new Date()
      cutoff.setDate(cutoff.getDate() - Number(days))
      filtered = summaries.filter(s => new Date(s.date) >= cutoff)
    }
    if (filtered.length === 0) return { wins: 0, total: 0, rate: 0 }
    const wins = filtered.filter(s => s.status === "on-track").length
    return {
      wins,
      total: filtered.length,
      rate: Math.round((wins / filtered.length) * 100)
    }
  }

  const getBestStreak = () => {
    let best = 0
    let current = 0
    summaries.forEach(s => {
      if (s.status === "on-track") {
        current++
        best = Math.max(best, current)
      } else {
        current = 0
      }
    })
    return best
  }

  const overall = getWinRate("all")
  const last7 = getWinRate("7")
  const last30 = getWinRate("30")
  const bestStreak = getBestStreak()

  const donutData = overall.total > 0
    ? [
        { name: "Won", value: overall.wins },
        { name: "Missed", value: overall.total - overall.wins }
      ]
    : [{ name: "No data", value: 1 }]

  const COLORS = ["#4caf50", "#f44336"]
  const chartData = getChartData()

  // Calendar helpers
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getDayColor = (date) => {
    const isToday = date.toDateString() === today.toDateString()
    const isFuture = date > today
    const summary = summaryByDate[date.toDateString()]

    if (isFuture) return { bg: "#f5f5f5", text: "#bbb" }
    if (isToday) return { bg: "#1976d2", text: "white" }
    if (!summary) return { bg: "#f5f5f5", text: "#999" }
    if (summary.status === "on-track") return { bg: "#4caf50", text: "white" }
    return { bg: "#f44336", text: "white" }
  }

  const prevMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))
  }

  const daysInMonth = getDaysInMonth(calendarDate)
  const firstDay = getFirstDayOfMonth(calendarDate)
  const monthName = calendarDate.toLocaleDateString("en-CA", { month: "long", year: "numeric" })

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle>📊 Your Stats</DialogTitle>

      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
        sx={{ px: 2, borderBottom: "1px solid #eee" }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Activity" />
        <Tab label={isPro ? "📈 Graph" : "📈 Graph (Pro)"} disabled={!isPro} />
        <Tab label={isPro ? "🏆 Win Rate" : "🏆 Win Rate (Pro)"} disabled={!isPro} />
        <Tab label={isPro ? "📅 Calendar" : "📅 Calendar (Pro)"} disabled={!isPro} />
        <Tab label={isPro ? "📤 Export" : "📤 Export (Pro)"} disabled={!isPro} />
      </Tabs>

      <DialogContent>
        {/* TAB 0 — Activity list */}
        {tab === 0 && (
          <>
            {sortedDates.length === 0 && (
              <Typography>No activity yet.</Typography>
            )}
            {sortedDates.map((date) => {
              const total = grouped[date].reduce(
                (sum, e) => sum + (e.salesVolume || 0), 0
              )
              return (
                <Box key={date} sx={{ mb: 2 }}>
                  <Typography fontWeight="bold">{date}</Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Total: ${total.toFixed(0)}
                  </Typography>
                  <List dense>
                    {grouped[date].map((e, i) => (
                      <ListItem key={i}>
                        <ListItemText
                          primary={`$${Number(e.salesVolume || 0).toFixed(0)}`}
                          secondary={new Date(e.date).toLocaleTimeString()}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Divider />
                </Box>
              )
            })}
          </>
        )}

        {/* TAB 1 — Graph */}
        {tab === 1 && isPro && (
          <Box>
            <ToggleButtonGroup
              value={range}
              exclusive
              onChange={(e, v) => v && setRange(v)}
              size="small"
              sx={{ mb: 3, mt: 1 }}
            >
              <ToggleButton value="7">7 Days</ToggleButton>
              <ToggleButton value="30">30 Days</ToggleButton>
              <ToggleButton value="all">Full Season</ToggleButton>
            </ToggleButtonGroup>

            {chartData.length === 0 ? (
              <Typography sx={{ opacity: 0.6 }}>
                No completed days in this range yet.
              </Typography>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
                  <Tooltip formatter={(value) => `$${value}`} />
                  <Legend />
                  <Bar dataKey="Sales" fill="#1976d2" radius={[4, 4, 0, 0]} />
                  <Line
                    type="monotone" dataKey="Target"
                    stroke="#f44336" strokeWidth={2}
                    dot={false} strokeDasharray="5 5"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}
            <Typography variant="caption" sx={{ opacity: 0.5, mt: 2, display: "block" }}>
              Bars = daily sales · Dashed line = daily target
            </Typography>
          </Box>
        )}

        {/* TAB 2 — Win Rate */}
        {tab === 2 && isPro && (
          <Box>
            {overall.total === 0 ? (
              <Typography sx={{ opacity: 0.6, mt: 2 }}>
                No completed days yet. Finish a day to see your win rate.
              </Typography>
            ) : (
              <>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                  <PieChart width={200} height={200}>
                    <Pie
                      data={donutData}
                      cx={100} cy={100}
                      innerRadius={60} outerRadius={90}
                      paddingAngle={3} dataKey="value"
                    >
                      {donutData.map((entry, index) => (
                        <Cell key={index} fill={overall.total > 0 ? COLORS[index] : "#e0e0e0"} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value, name]} />
                  </PieChart>
                </Box>

                <Typography variant="h3" fontWeight="bold" sx={{ textAlign: "center", mt: -2 }}>
                  {overall.rate}%
                </Typography>
                <Typography sx={{ textAlign: "center", opacity: 0.6, mb: 3 }}>
                  Overall Win Rate
                </Typography>

                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
                  {[
                    { label: "Last 7 Days", data: last7 },
                    { label: "Last 30 Days", data: last30 }
                  ].map(({ label, data }) => (
                    <Box key={label} sx={{ p: 2, borderRadius: 2, bgcolor: "#f3f4f6", textAlign: "center" }}>
                      <Typography variant="h5" fontWeight="bold">{data.rate}%</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.6 }}>{label}</Typography>
                      <Typography variant="body2">{data.wins}/{data.total} days</Typography>
                    </Box>
                  ))}
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: "#f3f4f6", textAlign: "center" }}>
                    <Typography variant="h5" fontWeight="bold">{overall.wins}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.6 }}>Total Wins</Typography>
                    <Typography variant="body2">out of {overall.total} days</Typography>
                  </Box>
                  <Box sx={{ p: 2, borderRadius: 2, bgcolor: "#f3f4f6", textAlign: "center" }}>
                    <Typography variant="h5" fontWeight="bold">🔥 {bestStreak}</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.6 }}>Best Streak</Typography>
                    <Typography variant="body2">days in a row</Typography>
                  </Box>
                </Box>
              </>
            )}
          </Box>
        )}

        {/* TAB 3 — Calendar */}
        {tab === 3 && isPro && (
          <Box>
            {/* Month navigation */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2, mt: 1 }}>
              <IconButton onClick={prevMonth}><ChevronLeftIcon /></IconButton>
              <Typography fontWeight="bold">{monthName}</Typography>
              <IconButton onClick={nextMonth} disabled={
                calendarDate.getMonth() === today.getMonth() &&
                calendarDate.getFullYear() === today.getFullYear()
              }>
                <ChevronRightIcon />
              </IconButton>
            </Box>

            {/* Day headers */}
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", mb: 1 }}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                <Typography key={d} variant="caption" sx={{ textAlign: "center", opacity: 0.5, fontWeight: "bold" }}>
                  {d}
                </Typography>
              ))}
            </Box>

            {/* Calendar grid */}
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0.5 }}>
              {/* Empty cells for first day offset */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <Box key={`empty-${i}`} />
              ))}

              {/* Day cells */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const date = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day)
                const { bg, text } = getDayColor(date)
                const summary = summaryByDate[date.toDateString()]

                return (
                  <Box
                    key={day}
                    sx={{
                      bgcolor: bg,
                      color: text,
                      borderRadius: 2,
                      p: 0.5,
                      textAlign: "center",
                      minHeight: 48,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: summary ? "pointer" : "default"
                    }}
                    title={summary ? `$${Math.round(summary.sales)} / $${Math.round(summary.target)}` : ""}
                  >
                    <Typography variant="caption" fontWeight="bold">{day}</Typography>
                    {summary && (
                      <Typography sx={{ fontSize: 9, opacity: 0.9 }}>
                        ${Math.round(summary.sales)}
                      </Typography>
                    )}
                  </Box>
                )
              })}
            </Box>

            {/* Legend */}
            <Box sx={{ display: "flex", gap: 2, mt: 3, justifyContent: "center" }}>
              {[
                { color: "#4caf50", label: "Hit target" },
                { color: "#f44336", label: "Missed" },
                { color: "#1976d2", label: "Today" },
                { color: "#f5f5f5", label: "No data" }
              ].map(({ color, label }) => (
                <Box key={label} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: color, border: "1px solid #ddd" }} />
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>{label}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
        {/* TAB 4 — CSV Export */}
        {tab === 4 && isPro && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ opacity: 0.6, mb: 3 }}>
              Export your season data for income reporting. Includes gross sales, pre-tax sales, commission earned, and bonuses.
            </Typography>

            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                if (!summaries.length) {
                  alert("No completed days to export yet.")
                  return
                }

                const rows = [
                  ["Date", "Gross Sales", "Pre-tax Sales", "Commission Earned", "Bonus", "Total Earnings"]
                ]

                summaries.forEach(s => {
                  const grossSales = s.sales || 0
                  const taxRate = season?.taxRate || 0.13 // fallback — ideally pass from season
                  const commissionRate = season?.commissionRate || 0.32
                  const preTax = grossSales / (1 + taxRate)
                  const commission = preTax * commissionRate
                  const bonus = s.bonus || 0
                  const total = commission + bonus

                  rows.push([
                    new Date(s.date).toLocaleDateString("en-CA"),
                    grossSales.toFixed(2),
                    preTax.toFixed(2),
                    commission.toFixed(2),
                    bonus.toFixed(2),
                    total.toFixed(2)
                  ])
                })

                const csv = rows.map(r => r.join(",")).join("\n")
                const blob = new Blob([csv], { type: "text/csv" })
                const url = URL.createObjectURL(blob)
                const a = document.createElement("a")
                a.href = url
                a.download = `salespacer-export-${new Date().toISOString().split("T")[0]}.csv`
                a.click()
                URL.revokeObjectURL(url)
              }}
            >
              Download CSV
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default StatsModal