// server/controllers/dashboardController.js
import Season from "../models/Season.js"
import DailyEntry from "../models/DailyEntry.js"
// import { DEV_USER_ID } from "../config/devUser.js"
import DailySummary from "../models/DailySummary.js"

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const season = await Season.findOne({ userId })

    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

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

    // ✅ fixed: range query, not exact midnight
    const todaySummary = await DailySummary.findOne({
      userId,
      seasonId: season._id,
      date: { $gte: startOfDay, $lte: endOfDay }
    })

    // ✅ fixed: userId filter added
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

    const todayTarget = season.totalWorkDays > 0
      ? season.requiredVolume / season.totalWorkDays
      : 0

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