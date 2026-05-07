// client/src/components/FloatingAddSale.jsx
import { Drawer, Box, Button, TextField, Typography, Fab } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import { useState } from "react"
import axios from "../api/axios"


const FloatingAddSale = ({ onSuccess, disabled, open, onClose, onOpen }) => {
  const [value, setValue] = useState("")

  const handleSubmit = async () => {
    if (!value) return
    try {
      await axios.post("/entry", { salesVolume: Number(value) })
      setValue("")
      onClose?.()
      onSuccess?.(Number(value))
    } catch (err) {
      console.error("Add sale failed:", err)
      alert(err.response?.data?.message || "Sale blocked")
    }
  }

  const handleClose = () => {
    setValue("")
    onClose?.()
  }

  return (
    <>
      <Fab
        color="primary"
        onClick={onOpen}
        disabled={disabled}
        sx={{
          position: "fixed",
          bottom: 72,
          right: 16,
          zIndex: 1000
        }}
      >
        <AddIcon />
      </Fab>

      <Drawer anchor="bottom" open={open} onClose={handleClose}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold">Add Sale</Typography>
          <Typography variant="body2" sx={{ opacity: 0.6, mb: 2 }}>
            Enter the sale volume in dollars
          </Typography>
          <TextField
            fullWidth
            type="number"
            placeholder="e.g. 5000"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <Button
            fullWidth variant="contained"
            sx={{ mt: 2 }} onClick={handleSubmit}
            disabled={disabled || !value}
          >
            Save Sale
          </Button>
          <Button fullWidth sx={{ mt: 1 }} onClick={handleClose}>
            Cancel
          </Button>
        </Box>
      </Drawer>
    </>
  )
}

export default FloatingAddSale