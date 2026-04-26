// client/src/components/StatsModal.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider
} from "@mui/material"
import { useEffect, useState } from "react"

const StatsModal = ({ entries = [] }) => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setOpen(true)

    window.addEventListener("open-stats", handler)
    return () => window.removeEventListener("open-stats", handler)
  }, [])

  // group entries by date
  const grouped = entries.reduce((acc, entry) => {
    const date = new Date(entry.date).toDateString()

    if (!acc[date]) acc[date] = []
    acc[date].push(entry)

    return acc
  }, {})

  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(b) - new Date(a)
  )

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
      <DialogTitle>📊 Your Stats</DialogTitle>

      <DialogContent>
        {sortedDates.length === 0 && (
          <Typography>No activity yet.</Typography>
        )}

        {sortedDates.map((date) => {
          const total = grouped[date].reduce(
            (sum, e) => sum + e.salesVolume,
            0
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
                      primary={`$${e.salesVolume}`}
                      secondary={new Date(e.date).toLocaleTimeString()}
                    />
                  </ListItem>
                ))}
              </List>

              <Divider />
            </Box>
          )
        })}
      </DialogContent>
    </Dialog>
  )
}

export default StatsModal