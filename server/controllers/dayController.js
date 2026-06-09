// server/controllers/dayController.js
import Season from "../models/Season.js"
import DailyEntry from "../models/DailyEntry.js"
import DailySummary from "../models/DailySummary.js"
import { DateTime } from "luxon"

export const startDay = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const season = await Season.findOne({ userId, status: "active" })
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

    const season = await Season.findOne({ userId, status: "active" })
    if (!season) {
      return res.status(400).json({ message: "No season found" })
    }

    const userTimezone = req.headers["x-timezone"] || "UTC"
    const now = DateTime.now().setZone(userTimezone)
    const startOfDay = now.startOf("day").toJSDate()
    const endOfDay = now.endOf("day").toJSDate()  // ← this is dayEnd

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

    const completedSummaries = await DailySummary.find({
      userId,
      seasonId: season._id,
      isCompleted: true,
      date: { $lt: startOfDay }
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

    const { notes = "", bonus = 0 } = req.body

    const saved = await DailySummary.create({
      userId,
      seasonId: season._id,
      date: endOfDay,  // ✅ use endOfDay — saves as end of user's local day, not UTC now()
      sales: todaySales,
      target: todayTarget,
      difference,
      status: isSuccess ? "on-track" : "behind",
      isCompleted: true,
      notes,
      bonus: Number(bonus) || 0
    })

    console.log("END DAY - summary saved:", saved._id)

    res.json({
      todaySales,
      todayTarget,
      difference,
      streak: newStreak,
      isSuccess,
      notes,
      bonus: Number(bonus) || 0,
      message: isSuccess ? "🔥 Strong day" : "⚠️ Tomorrow is a reset opportunity"
    })

  } catch (err) {
    console.error("END DAY ERROR:", err)
    res.status(500).json({ message: "End day failed" })
  }
}

export const updateSummary = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { summaryId, bonus, notes } = req.body

    const summary = await DailySummary.findOneAndUpdate(
      { _id: summaryId, userId },
      {
        ...(bonus !== undefined && { bonus: Number(bonus) }),
        ...(notes !== undefined && { notes })
      },
      { new: true }
    )

    if (!summary) return res.status(404).json({ message: "Summary not found" })

    res.json(summary)
  } catch (err) {
    console.error("UPDATE SUMMARY ERROR:", err)
    res.status(500).json({ message: "Failed to update summary" })
  }
}

export const endUnclosedDay = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { date } = req.body // ISO date string of the day to close
    if (!date) return res.status(400).json({ message: "Date required" })

    const season = await Season.findOne({ userId, status: "active" })
    if (!season) return res.status(400).json({ message: "No season found" })

    const userTimezone = req.headers["x-timezone"] || "UTC"
    const now = DateTime.now().setZone(userTimezone)

    const dayStart = DateTime.fromISO(date).setZone(userTimezone).startOf("day").toJSDate()
    const dayEnd = DateTime.fromISO(date).setZone(userTimezone).endOf("day").toJSDate()

    // Check if already closed
    const existingSummary = await DailySummary.findOne({
      userId,
      seasonId: season._id,
      date: { $gte: dayStart, $lte: dayEnd }
    })

    if (existingSummary) {
      return res.status(400).json({ message: "That day is already closed." })
    }

    const entries = await DailyEntry.find({
      userId,
      seasonId: season._id,
      date: { $gte: dayStart, $lte: dayEnd }
    })

    if (entries.length === 0) {
      return res.status(400).json({ message: "No entries found for that day." })
    }

    const todaySales = entries.reduce((sum, e) => sum + (e.salesVolume || 0), 0)

    // Dynamic target for that day
    const completedSummaries = await DailySummary.find({
      userId,
      seasonId: season._id,
      isCompleted: true,
      date: { $lt: dayStart }
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

    // Streak
    const prevDayStart = DateTime.fromISO(date)
      .setZone(userTimezone)
      .minus({ days: 1 })
      .startOf("day")
      .toJSDate()
    const prevDayEnd = DateTime.fromISO(date)
      .setZone(userTimezone)
      .minus({ days: 1 })
      .endOf("day")
      .toJSDate()

    const previousSummary = await DailySummary.findOne({
      userId,
      seasonId: season._id,
      date: { $gte: prevDayStart, $lte: prevDayEnd }
    })

    let newStreak = 0
    if (isSuccess) {
      newStreak = previousSummary?.status === "on-track"
        ? (season.streak || 0) + 1
        : 1
    }

    season.streak = newStreak
    await season.save()

    await DailySummary.create({
      userId,
      seasonId: season._id,
      date: dayEnd,
      sales: todaySales,
      target: todayTarget,
      difference,
      status: isSuccess ? "on-track" : "behind",
      isCompleted: true,
      notes,
      bonus: Number(bonus) || 0
    })

    res.json({ 
      message: "Day closed successfully", 
      todaySales, 
      todayTarget, 
      isSuccess, 
      notes, 
      bonus: Number(bonus) || 0 
    })

  } catch (err) {
    console.error("END UNCLOSED DAY ERROR:", err)
    res.status(500).json({ message: "Failed to close day" })
  }
}