// server/models/Season.js
import mongoose from "mongoose"

const SeasonSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    requiredVolume: { type: Number, required: true },
    commissionRate: { type: Number, required: true },
    taxRate: { type: Number, required: true, default: 0.13 },
    totalWorkDays: { type: Number, required: true },
    streak: { type: Number, default: 0 }
  },
  { timestamps: true }
)

export default mongoose.model("Season", SeasonSchema)