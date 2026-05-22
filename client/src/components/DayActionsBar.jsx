// client/src/components/DayActionsBar.jsx
import axios from "../api/axios"
import { useState } from "react"

const DayActionsBar = ({ onEndDay, disabled }) => {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState("")
  const [bonus, setBonus] = useState("")

  const handleClick = () => {
    setOpen(true)
  }

  const handleConfirm = async () => {
    try {
      setLoading(true)
      await onEndDay({ notes, bonus: Number(bonus) || 0 })
      setOpen(false)
      setNotes("")
      setBonus("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Box sx={{ mt: 3 }}>
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={handleClick}
          disabled={disabled || loading}
          sx={{
            bgcolor: "#111",
            color: "white",
            borderRadius: 2,
            py: 1.5,
            fontSize: 16,
            "&:hover": { bgcolor: "#333" },
            opacity: disabled ? 0.5 : 1
          }}
        >
          {loading ? "Finishing..." : "🏁 Finish Day 🏁"}
        </Button>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Finish Day</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ opacity: 0.6, mb: 2 }}>
            Optional — add any notes or bonuses before locking in today.
          </Typography>
          <TextField
            fullWidth
            label="Bonus ($)"
            type="number"
            value={bonus}
            onChange={(e) => setBonus(e.target.value)}
            sx={{ mb: 2 }}
            helperText="Leave blank if unknown — you can add it tomorrow"
          />
          <TextField
            fullWidth
            label="Notes"
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Strong closing day, new client signed..."
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Saving..." : "Lock In Day"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default DayActionsBar