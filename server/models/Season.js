// server/models/Season.js
import mongoose from "mongoose"

const SeasonSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },

    companyName: String,

    incomeGoal: {
      type: Number,
      required: true
    },

    commissionRate: {
      type: Number,
      required: true
    },

    totalWorkDays: {
      type: Number,
      required: true
    },

    requiredVolume: {
      type: Number,
      required: true
    },

    streak: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
)

export default mongoose.model("Season", SeasonSchema)