// client/src/pages/Setup.jsx
import { useState } from "react"
import axios from "../api/axios"
import { useNavigate } from "react-router-dom"

const Setup = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    companyName: "",
    incomeGoal: "",
    commissionRate: Number(form.commissionRate) / 100,
    totalWorkDays: ""
  })

  if (!form.incomeGoal || !form.totalWorkDays) {
  alert("Please fill all fields")
  return
}

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await axios.post("/season/create", {
        ...form,
        incomeGoal: Number(form.incomeGoal),
        commissionRate: Number(form.commissionRate),
        totalWorkDays: Number(form.totalWorkDays)
      })

      navigate("/")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <h1>Setup Your Season</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="companyName"
          placeholder="Company Name"
          onChange={handleChange}
        />

        <input
          name="incomeGoal"
          placeholder="Income Goal ($)"
          type="number"
          onChange={handleChange}
        />

        <input
          name="commissionRate"
          placeholder="Commission Rate (%)"
          type="number"
          step="0.01"
          onChange={handleChange}
        />

        <input
          name="totalWorkDays"
          placeholder="Number of Work Days"
          type="number"
          onChange={handleChange}
        />

        <button type="submit">Create Season</button>
      </form>
    </div>
  )
}

export default Setup