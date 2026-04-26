// client/src/components/DaysActionBar.jsx
import axios from "../api/axios"

const DayActionsBar = ({ onEndDay, disabled }) => {
  return (
    <div style={{ marginTop: "24px" }}>
      <button
        onClick={() => {
          if (confirm("This will lock in today's sales and you won't be able to add any more. Continue?")) {
            onEndDay()
          }
        }}
        disabled={disabled}
        style={{
          width: "100%",
          padding: "14px",
          background: "#111",
          color: "white",
          borderRadius: "8px",
          fontSize: "16px"
        }}
      >
        🏁 Finish Day 🏁
      </button>
    </div>
  )
}

export default DayActionsBar