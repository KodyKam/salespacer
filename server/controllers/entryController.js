// server/controllers/entryController.js
import DailyEntry from "../models/DailyEntry.js"
import Season from "../models/Season.js"
import { calculateDailyTarget } from "../utils/calculations.js"
import DailySummary from "../models/DailySummary.js"
import { DEV_USER_ID } from "../config/devUser.js"

export const addEntry = async (req, res) => {
  try {
    const userId = DEV_USER_ID
    const { salesVolume } = req.body

    const season = await Season.findOne({ userId })

    if (!season) {
      return res.status(400).json({ message: "No active season" })
    }

    const today = new Date().toDateString()

    // ✅ CHECK FIRST
    const existingSummary = await DailySummary.findOne({
      userId,
      seasonId: season._id,
      date: today
    })

    if (existingSummary) {
      return res.status(400).json({
        message: "Day is locked"
      })
    }

    // ✅ ONLY CREATE IF ALLOWED
    const entry = await DailyEntry.create({
      userId,
      seasonId: season._id,
      salesVolume,
      date: new Date()
    })

    res.json(entry)

  } catch (err) {
    console.error("ADD ENTRY ERROR:", err)
    res.status(500).json({ message: "Failed to add entry" })
  }
}

