// client/src/components/FloatingAddSale.jsx
import { Drawer, Box, Button, TextField, Typography } from "@mui/material"
import { useState } from "react"
import axios from "../api/axios"

const AddSaleSheet = ({ open, onClose, onSuccess }) => {
  const [value, setValue] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!value) return

    try {
      setLoading(true)

      await axios.post("/entry", {
        salesVolume: Number(value)
      })

      setValue("")

      // 🔥 CRITICAL: refresh dashboard
      onSuccess?.()

      onClose?.()
    } catch (err) {
      console.error("Add sale failed:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Drawer anchor="bottom" open={open} onClose={onClose}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">Add Sale</Typography>

        <TextField
          fullWidth
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          sx={{ mt: 2 }}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Sale"}
        </Button>
      </Box>
    </Drawer>
  )
}

export default AddSaleSheet