// server/controllers/entryController.js
import DailyEntry from "../models/DailyEntry.js"
import Season from "../models/Season.js"
import DailySummary from "../models/DailySummary.js"
import { DateTime } from "luxon"

export const addEntry = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { salesVolume } = req.body

    const season = await Season.findOne({ userId })
    if (!season) {
      return res.status(400).json({ message: "No active season" })
    }

    const userTimezone = req.headers["x-timezone"] || "UTC"
    const now = DateTime.now().setZone(userTimezone)
    const startOfDay = now.startOf("day").toJSDate()
    const endOfDay = now.endOf("day").toJSDate()

    const existingSummary = await DailySummary.findOne({
      userId,
      seasonId: season._id,
      date: { $gte: startOfDay, $lte: endOfDay }
    })

    if (existingSummary?.isCompleted === true) {
      return res.status(400).json({ message: "Day is locked" })
    }

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