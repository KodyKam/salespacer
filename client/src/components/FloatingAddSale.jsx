// client/src/components/FloatingAddSale.jsx
import {
  Drawer,
  Box,
  Button,
  TextField,
  Typography,
  Fab
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { useState } from "react"
import axios from "../api/axios"

const FloatingAddSale = ({ onSuccess, disabled }) => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  const handleSubmit = async () => {
    if (!value) return

    try {
      await axios.post("/entry", {
        salesVolume: Number(value)
      })

      setValue("")
      setOpen(false)

      // 🔥 THIS is the refresh trigger
      onSuccess?.()

    } catch (err) {
      console.error("Add sale failed:", err)
    }
  }

  return (
    <>
      <Fab
        variant="extended"
        color="primary"
        onClick={() => setOpen(true)}
        disabled={disabled}
        sx={{
          position: "fixed",
          bottom: 80,
          right: 16,
          zIndex: 1000
        }}
      >
        <AddIcon sx={{ mr: 1 }} />
        Add Sale
      </Fab>

      <Drawer anchor="bottom" open={open} onClose={() => setOpen(false)}>
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
          >
            Save Sale
          </Button>
        </Box>
      </Drawer>
    </>
  )
}

export default FloatingAddSale