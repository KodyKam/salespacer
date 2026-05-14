// server/controllers/dayController.js
import Season from "../models/Season.js"
import DailyEntry from "../models/DailyEntry.js"
import DailySummary from "../models/DailySummary.js"
import { DateTime } from "luxon"

export const startDay = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const season = await Season.findOne({ userId })
    if (!season) {
      return res.status(400).json({ message: "No season found" })
    }

    const userTimezone = req.headers["x-timezone"] || "UTC"
    const now = DateTime.now().setZone(userTimezone)
    const startOfDay = now.startOf("day").toJSDate()
    const endOfDay = now.endOf("day").toJSDate()

    const deleted = await DailySummary.findOneAndDelete({
      userId,
      seasonId: season._id,
      date: { $gte: startOfDay, $lte: endOfDay }
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

    const userTimezone = req.headers["x-timezone"] || "UTC"
    const now = DateTime.now().setZone(userTimezone)
    const startOfDay = now.startOf("day").toJSDate()
    const endOfDay = now.endOf("day").toJSDate()

    const existingSummary = await DailySummary.findOne({
      userId,
      seasonId: season._id,
      date: { $gte: startOfDay, $lte: endOfDay }
    })

    if (existingSummary) {
      return res.status(400).json({ message: "Day already completed." })
    }

    const entries = await DailyEntry.find({
      userId,
      seasonId: season._id,
      date: { $gte: startOfDay, $lte: endOfDay }
    })

    console.log("END DAY - entries found:", entries.length)

    const todaySales = entries.reduce((sum, e) => sum + (e.salesVolume || 0), 0)

    // ✅ Dynamic target — same logic as dashboard
    const completedSummaries = await DailySummary.find({
      userId,
      seasonId: season._id,
      isCompleted: true,
      date: { $lt: startOfDay }  // only previous completed days
    })

    const completedDays = completedSummaries.length
    const completedVolume = completedSummaries.reduce(
      (sum, s) => sum + (s.sales || 0), 0
    )

    const remainingDays = Math.max(season.totalWorkDays - completedDays, 1)
    const remainingVolume = Math.max(season.requiredVolume - completedVolume, 0)
    const todayTarget = remainingVolume / remainingDays

    const difference = todaySales - todayTarget
    const isSuccess = todaySales >= todayTarget

    // Yesterday in user's timezone
    const yesterdayStart = now.minus({ days: 1 }).startOf("day").toJSDate()
    const yesterdayEnd = now.minus({ days: 1 }).endOf("day").toJSDate()

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
      target: todayTarget,  // ✅ now stores the dynamic target
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