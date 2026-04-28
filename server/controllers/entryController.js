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

export const endDay = async (req, res) => {
  try {
    const userId = DEV_USER_ID

    const season = await Season.findOne({ userId })

    if (!season) {
      return res.status(400).json({ message: "No season found" })
    }

    const seasonId = season._id

    const entries = await DailyEntry.find({
      userId,
      seasonId
    })

    const today = new Date().toDateString()

    const existingSummary = await DailySummary.findOne({
      userId,
      seasonId,
      date: today
    })

    if (existingSummary) {
      return res.status(400).json({
        message: "Day already completed"
      })
    }

    const todaySales = entries
      .filter(e => new Date(e.date).toDateString() === today)
      .reduce((sum, e) => sum + e.salesVolume, 0)

    const todayTarget = calculateDailyTarget(season, entries)

    const isSuccess = todaySales >= todayTarget

    let newStreak = season.streak || 0
    newStreak = isSuccess ? newStreak + 1 : 0

    season.streak = newStreak
    await season.save()

    const summary = {
      todaySales,
      todayTarget,
      difference: todaySales - todayTarget,
      isSuccess,
      streak: newStreak,
      message: isSuccess
        ? "🔥 Day completed successfully"
        : "⚠️ Day ended below target"
    }

    res.json(summary)

  } catch (err) {
    console.error("END DAY ERROR:", err)
    res.status(500).json({ message: "Failed to end day" })
  }
}