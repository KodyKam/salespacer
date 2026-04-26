// server/models/DailySummary.js
import mongoose from "mongoose"

const DailySummarySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    seasonId: { type: mongoose.Schema.Types.ObjectId, ref: "Season" },

    date: { type: String, required: true }, // "2026-04-24"

    sales: { type: Number, default: 0 },
    target: { type: Number, default: 0 },
    difference: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["on-track", "behind", "ahead"],
      default: "behind"
    },

    isCompleted: { type: Boolean, default: true }
  },
  { timestamps: true }
)

export default mongoose.model("DailySummary", DailySummarySchema)