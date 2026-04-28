// server/controllers/dashboardController.js
import Season from "../models/Season.js"
import DailyEntry from "../models/DailyEntry.js"
import { DEV_USER_ID } from "../config/devUser.js"
import DailySummary from "../models/DailySummary.js"

export const getDashboard = async (req, res) => {
  try {
    const userId = DEV_USER_ID

    const season = await Season.findOne({ userId })

    const todayStr = new Date().toDateString()

    // ✅ check if day already completed
    let todaySummary = null

    if (season) {
      todaySummary = await DailySummary.findOne({
        userId,
        seasonId: season._id,
        date: todayStr
      })
    }

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

    const entries = await DailyEntry.find({
      seasonId: season._id
    })

    const todayEntries = entries.filter(
      e => new Date(e.date).toDateString() === todayStr
    )

    const todaySales = todayEntries.reduce(
      (sum, e) => sum + (e.salesVolume || 0),
      0
    )

    const todayTarget =
      season.totalWorkDays > 0
        ? season.requiredVolume / season.totalWorkDays
        : 0

    const todayDifference = todaySales - todayTarget

    const remainingToday = Math.max(todayTarget - todaySales, 0)

    const dailyProgressPercent =
      todayTarget > 0
        ? Math.min((todaySales / todayTarget) * 100, 100)
        : 0

    const totalVolume = entries.reduce(
      (sum, e) => sum + (e.salesVolume || 0),
      0
    )

    const progressPercent =
      season.requiredVolume > 0
        ? (totalVolume / season.requiredVolume) * 100
        : 0

    const isOnTrackToday = todayDifference >= 0

    const streakStatus =
      season.streak >= 5
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
      isDayCompleted: !!todaySummary, // 🔥 THIS is the lock
      entries
    })
  } catch (err) {
    console.error("DASHBOARD ERROR:", err)
    res.status(500).json({ message: "Dashboard crash", error: err.message })
  }
}

