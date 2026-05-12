// server/controllers/dashboardController.js
import Season from "../models/Season.js"
import DailyEntry from "../models/DailyEntry.js"
import DailySummary from "../models/DailySummary.js"
import { DateTime } from "luxon"

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const userTimezone = req.headers["x-timezone"] || "UTC"
    const now = DateTime.now().setZone(userTimezone)
    const startOfDay = now.startOf("day").toJSDate()
    const endOfDay = now.endOf("day").toJSDate()

    const season = await Season.findOne({ userId })

    if (!season) {
      return res.json({
        todayTarget: 0,
        todaySales: 0,
        todayDifference: 0,
        progressPercent: 0,
        remainingToday: 0,
        dailyProgressPercent: 0,
        streak: 0,
        streakStatus: "",
        nextAction: "Create a season to begin",
        entries: [],
        isOnTrackToday: true,
        isDayCompleted: false
      })
    }

    const todaySummary = await DailySummary.findOne({
      userId,
      seasonId: season._id,
      date: { $gte: startOfDay, $lte: endOfDay }
    })

    const entries = await DailyEntry.find({
      userId,
      seasonId: season._id
    }).sort({ date: -1 })

    const todayEntries = entries.filter(
      e => new Date(e.date) >= startOfDay && new Date(e.date) <= endOfDay
    )

    const todaySales = todayEntries.reduce(
      (sum, e) => sum + (e.salesVolume || 0), 0
    )

    // Get all completed daily summaries
    const completedSummaries = await DailySummary.find({
      userId,
      seasonId: season._id,
      isCompleted: true
    })

    const completedDays = completedSummaries.length

    // Use the sales figures recorded in summaries for completed days
    // This is consistent with what was locked in when Finish Day was clicked
    const completedVolume = completedSummaries.reduce(
      (sum, s) => sum + (s.sales || 0), 0
    )

    const remainingDays = Math.max(season.totalWorkDays - completedDays, 1)
    const remainingVolume = Math.max(season.requiredVolume - completedVolume, 0)
    const todayTarget = remainingDays > 0 ? remainingVolume / remainingDays : 0

    const todayDifference = todaySales - todayTarget
    const remainingToday = Math.max(todayTarget - todaySales, 0)

    const dailyProgressPercent = todayTarget > 0
      ? Math.min((todaySales / todayTarget) * 100, 100)
      : 0

    const totalVolume = entries.reduce(
      (sum, e) => sum + (e.salesVolume || 0), 0
    )

    const progressPercent = season.requiredVolume > 0
      ? (totalVolume / season.requiredVolume) * 100
      : 0

    const isOnTrackToday = todayDifference >= 0

    const streakStatus = season.streak >= 5
      ? "🔥 You're on fire"
      : season.streak >= 3
      ? "⚡ Momentum building"
      : "Start your streak today"

    return res.json({
      hasSeason: true,
      todayTarget,
      todaySales,
      todayDifference,
      remainingToday,
      dailyProgressPercent,
      progressPercent,
      streak: season.streak || 0,
      streakStatus,
      nextAction: isOnTrackToday
        ? "You're ahead — maintain pace"
        : `You need $${remainingToday.toFixed(0)} more today`,
      isOnTrackToday,
      isDayCompleted: !!todaySummary,
      entries
    })

  } catch (err) {
    console.error("DASHBOARD ERROR:", err)
    res.status(500).json({ message: "Dashboard crash", error: err.message })
  }
}