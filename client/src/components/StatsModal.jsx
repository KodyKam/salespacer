// client/src/components/StatsModal.jsx
import { Dialog, Box, Typography } from "@mui/material"
import { useState, useEffect } from "react"

const StatsModal = () => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener("open-stats", handler)

    return () => window.removeEventListener("open-stats", handler)
  }, [])

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Stats (Coming Soon)</Typography>
        <Typography sx={{ mt: 1 }}>
          Daily history + performance breakdown will go here.
        </Typography>
      </Box>
    </Dialog>
  )
}

export default StatsModal