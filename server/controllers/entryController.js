// server/controllers/entryController.js
import DailyEntry from "../models/DailyEntry.js"
import Season from "../models/Season.js"
import { calculateDailyTarget } from "../utils/calculations.js"
import DailySummary from "../models/DailySummary.js"
// import { DEV_USER_ID } from "../config/devUser.js"

export const addEntry = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { salesVolume } = req.body

    const season = await Season.findOne({ userId })

    if (!season) {
      return res.status(400).json({ message: "No active season" })
    }

    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    // ✅ CHECK FIRST
    const todayStart = new Date()
todayStart.setHours(0, 0, 0, 0)

const todayEnd = new Date()
todayEnd.setHours(23, 59, 59, 999)

const existingSummary = await DailySummary.findOne({
  userId,
  seasonId: season._id,
  date: {
    $gte: todayStart,
    $lte: todayEnd
  }
})

// 🔥 only block if day is actually completed TODAY
if (existingSummary?.isCompleted === true) {
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

