// client/src/components/ProgressBar.jsx

const ProgressBar = ({ percent = 0 }) => {
  return (
    <div style={{ width: "100%", background: "#eee", height: "20px" }}>
      <div
        style={{
          width: `${percent}%`,
          height: "100%",
          background: "green"
        }}
      />
    </div>
  )
}

export default ProgressBar