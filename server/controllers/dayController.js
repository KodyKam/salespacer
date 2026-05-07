// server/controllers/dayController.js
import Season from "../models/Season.js"
import DailyEntry from "../models/DailyEntry.js"
import DailySummary from "../models/DailySummary.js"
// import { DEV_USER_ID } from "../config/devUser.js"

export const startDay = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const season = await Season.findOne({ userId })
    if (!season) {
      return res.status(400).json({ message: "No season found" })
    }

    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)

    const todayEnd = new Date()
    todayEnd.setHours(23, 59, 59, 999)

    // Remove today's summary lock so user can add more entries
    // Never delete entries — always preserve history
    const deleted = await DailySummary.findOneAndDelete({
      userId,
      seasonId: season._id,
      date: { $gte: todayStart, $lte: todayEnd }
    })

    console.log("START DAY - unlocked:", !!deleted)

    res.json({ message: deleted ? "Day unlocked" : "Day already active" })

  } catch (err) {
    console.error("START DAY ERROR:", err)
    res.status(500).json({ message: "Start day failed" })
  }
}

export const endDay = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })
    const season = await Season.findOne({ userId })
    if (!season) {
      return res.status(400).json({ message: "No season found" })
    }

    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    // If already completed, just return current state — don't block
    const existingSummary = await DailySummary.findOne({
      userId,
      seasonId: season._id,
      date: { $gte: startOfDay, $lte: endOfDay }
    })

    if (existingSummary) {
      return res.status(400).json({
        message: "Day already completed."
      })
    }

    const entries = await DailyEntry.find({
      userId,
      seasonId: season._id,
      date: { $gte: startOfDay, $lte: endOfDay }
    })

    console.log("END DAY - entries found:", entries.length)

    const todaySales = entries.reduce((sum, e) => sum + (e.salesVolume || 0), 0)

    const todayTarget = season.totalWorkDays > 0
      ? season.requiredVolume / season.totalWorkDays
      : 0

    const difference = todaySales - todayTarget
    const isSuccess = todaySales >= todayTarget

    const yesterdayStart = new Date()
    yesterdayStart.setDate(yesterdayStart.getDate() - 1)
    yesterdayStart.setHours(0, 0, 0, 0)

    const yesterdayEnd = new Date(yesterdayStart)
    yesterdayEnd.setHours(23, 59, 59, 999)

    const yesterdaySummary = await DailySummary.findOne({
      userId,
      seasonId: season._id,
      date: { $gte: yesterdayStart, $lte: yesterdayEnd }
    })

    let newStreak = 0
    if (isSuccess) {
      newStreak = yesterdaySummary?.status === "on-track"
        ? (season.streak || 0) + 1
        : 1
    }

    season.streak = newStreak
    await season.save()

    const saved = await DailySummary.create({
      userId,
      seasonId: season._id,
      date: new Date(),
      sales: todaySales,
      target: todayTarget,
      difference,
      status: isSuccess ? "on-track" : "behind",
      isCompleted: true
    })

    console.log("END DAY - summary saved:", saved._id)

    res.json({
      todaySales,
      todayTarget,
      difference,
      streak: newStreak,
      isSuccess,
      message: isSuccess ? "🔥 Strong day" : "⚠️ Tomorrow is a reset opportunity"
    })

  } catch (err) {
    console.error("END DAY ERROR:", err)
    res.status(500).json({ message: "End day failed" })
  }
}