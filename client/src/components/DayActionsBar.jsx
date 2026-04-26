// client/src/components/DaysActionBar.jsx
import axios from "../api/axios"

const DayActionsBar = ({ onEndDay, disabled }) => {
  return (
    <div style={{ marginTop: "24px" }}>
      <button
        onClick={onEndDay}
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
        🏁 End Day & See Summary
      </button>
    </div>
  )
}

export default DayActionsBar