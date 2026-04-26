// client/src/components/StatCard.jsx
const StatCard = ({ title, value }) => {
  return (
    <div style={{ border: "1px solid #ccc", padding: "10px" }}>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  )
}

export default StatCard