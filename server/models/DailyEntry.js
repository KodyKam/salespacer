// server/models/DailyEntry.js
import mongoose from "mongoose"

const DailyEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    seasonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Season",
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    salesVolume: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
)

export default mongoose.model("DailyEntry", DailyEntrySchema)