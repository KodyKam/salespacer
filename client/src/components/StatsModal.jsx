// client/src/components/StatsModal.jsx
import {
  Dialog, DialogTitle, DialogContent,
  Typography, Box, List, ListItem, ListItemText,
  Divider, Tabs, Tab, ToggleButton, ToggleButtonGroup
} from "@mui/material"
import { useEffect, useState } from "react"
import {
  ComposedChart, Bar, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts"
import { useAuth } from "../context/AuthContext"

const StatsModal = ({ entries = [], todayTarget = 0 }) => {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState(0)
  const [range, setRange] = useState("7")
  const { isPro } = useAuth()

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener("open-stats", handler)
    return () => window.removeEventListener("open-stats", handler)
  }, [])

  // Group entries by date
  const grouped = entries.reduce((acc, entry) => {
    const d = new Date(entry.date)
    if (isNaN(d.getTime())) return acc
    const date = d.toDateString()
    if (!acc[date]) acc[date] = []
    acc[date].push(entry)
    return acc
  }, {})

  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(a) - new Date(b)
  )

  // Filter by range
  const getFilteredDates = () => {
    if (range === "all") return sortedDates
    const days = Number(range)
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)
    return sortedDates.filter(d => new Date(d) >= cutoff)
  }

  const filteredDates = getFilteredDates()

  // Build chart data
  const chartData = filteredDates.map(date => {
    const dayEntries = grouped[date]
    const sales = dayEntries.reduce((sum, e) => sum + (e.salesVolume || 0), 0)
    return {
      date: new Date(date).toLocaleDateString("en-CA", { month: "short", day: "numeric" }),
      Sales: Math.round(sales),
      Target: Math.round(todayTarget)
    }
  })

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
      <DialogTitle>📊 Your Stats</DialogTitle>

      <Tabs
        value={tab}
        onChange={(e, v) => setTab(v)}
        sx={{ px: 2, borderBottom: "1px solid #eee" }}
      >
        <Tab label="Activity" />
        <Tab
          label={isPro ? "Graph" : "📈 Graph (Pro)"}
          disabled={!isPro}
        />
      </Tabs>

      <DialogContent>
        {/* TAB 0 — Activity list */}
        {tab === 0 && (
          <>
            {sortedDates.length === 0 && (
              <Typography>No activity yet.</Typography>
            )}
            {[...sortedDates].reverse().map((date) => {
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

        {/* TAB 1 — Graph (Pro only) */}
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
              <Typography>No data for this range yet.</Typography>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={v => `$${v}`}
                  />
                  <Tooltip
                    formatter={(value) => `$${value}`}
                  />
                  <Legend />
                  <Bar dataKey="Sales" fill="#1976d2" radius={[4, 4, 0, 0]} />
                  <Line
                    type="monotone"
                    dataKey="Target"
                    stroke="#f44336"
                    strokeWidth={2}
                    dot={false}
                    strokeDasharray="5 5"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            )}

            <Typography variant="caption" sx={{ opacity: 0.5, mt: 2, display: "block" }}>
              Bars = daily sales · Dashed line = daily target
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default StatsModal