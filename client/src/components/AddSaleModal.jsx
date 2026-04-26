// client/src/components/AddSaleModal.jsx
import { useState } from "react"
import axios from "../api/axios"

const AddSaleModal = ({ onSuccess }) => {
  const [value, setValue] = useState("")

  const handleAdd = async () => {
    if (!value) return

    try {
      await axios.post("/entry", {
        salesVolume: Number(value)
      })

      setValue("")
      onSuccess?.()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <input
        type="number"
        placeholder="Sale amount"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <button onClick={handleAdd}>Add Sale</button>
    </div>
  )
}

export default AddSaleModal