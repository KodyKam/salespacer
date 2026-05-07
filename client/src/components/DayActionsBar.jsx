// client/src/components/DaysActionBar.jsx
import axios from "../api/axios"
import { useState } from "react"

const DayActionsBar = ({ onEndDay, disabled }) => {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    if (!confirm("This will lock in today's sales and you won't be able to add any more. Continue?")) return

    try {
      setLoading(true)
      await onEndDay()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginTop: "24px" }}>
      <button
        onClick={handleClick}
        disabled={disabled || loading}
        style={{
          width: "100%",
          padding: "14px",
          background: loading ? "#444" : "#111",
          color: "white",
          borderRadius: "8px",
          fontSize: "16px",
          opacity: disabled ? 0.5 : 1
        }}
      >
        {loading ? "Finishing..." : "🏁 Finish Day 🏁"}
      </button>
    </div>
  )
}

export default DayActionsBar