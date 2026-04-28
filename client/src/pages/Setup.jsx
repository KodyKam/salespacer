// client/src/pages/Setup.jsx
import { useState } from "react"
import axios from "../api/axios"
import { useNavigate } from "react-router-dom"

const Setup = () => {
  const navigate = useNavigate()

  // ✅ SAFE INITIAL STATE
  const [form, setForm] = useState({
    companyName: "",
    incomeGoal: Number(""),
    commissionRate: "",
    totalWorkDays: ""
  })

  const [loading, setLoading] = useState(false)

  // ✅ HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  // ✅ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault()

    // ✅ VALIDATION (correct place)
    if (
      !form.companyName ||
      !form.incomeGoal ||
      !form.commissionRate ||
      !form.totalWorkDays
    ) {
      alert("Please fill all fields")
      return
    }

    try {
      setLoading(true)

      await axios.post("/season", {
        companyName: form.companyName,
        incomeGoal: Number(form.incomeGoal),
        commissionRate: Number(form.commissionRate) / 100, // ✅ FIXED
        totalWorkDays: Number(form.totalWorkDays)
      })

      navigate("/")
      window.location.reload()
    } catch (err) {
      console.error("Create season failed:", err)
      alert("Failed to create season")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Setup Your Season</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="companyName"
          placeholder="Company Name"
          value={form.companyName}
          onChange={handleChange}
        />

        <br /><br />

        <input
          name="incomeGoal"
          placeholder="Income Goal ($)"
          type="number"
          value={form.incomeGoal}
          onChange={handleChange}
        />

        <br /><br />

        <input
          name="commissionRate"
          placeholder="Commission Rate (%)"
          type="number"
          step="0.01"
          value={form.commissionRate}
          onChange={handleChange}
        />

        <br /><br />

        <input
          name="totalWorkDays"
          placeholder="Number of Work Days"
          type="number"
          value={form.totalWorkDays}
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Season"}
        </button>
      </form>
    </div>
  )
}

export default Setup