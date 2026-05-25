// server/models/Season.js
import mongoose from "mongoose"

const SeasonSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    name: { type: String, default: "" },
    requiredVolume: { type: Number, required: true },
    commissionRate: { type: Number, required: true },
    taxRate: { type: Number, required: true, default: 0.13 },
    totalWorkDays: { type: Number, required: true },
    streak: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "completed"], default: "active" },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: null }
  },
  { timestamps: true }
)

export default mongoose.model("Season", SeasonSchema)