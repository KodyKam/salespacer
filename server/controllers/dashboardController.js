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
        summaries: [],
        isOnTrackToday: true,
        isDayCompleted: false,
        hasUnclosedDays: false,
        unclosedYesterdaySales: 0,
        unclosedDate: null
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

    const summaries = await DailySummary.find({
      userId,
      seasonId: season._id,
      isCompleted: true
    }).sort({ date: 1 })

    // Check if all work days are used up
    const totalCompletedDays = summaries.length
    const seasonComplete = totalCompletedDays >= season.totalWorkDays

    // Check for any unclosed days (entries with no summary, excluding today)
    const entryDayMap = {}
    entries.forEach(e => {
      const dayKey = DateTime.fromJSDate(new Date(e.date))
        .setZone(userTimezone)
        .startOf("day")
        .toISO()
      if (!entryDayMap[dayKey]) entryDayMap[dayKey] = []
      entryDayMap[dayKey].push(e)
    })

    const unclosedDays = []
    for (const [dayKey, dayEntries] of Object.entries(entryDayMap)) {
      const dayStart = DateTime.fromISO(dayKey).setZone(userTimezone).startOf("day").toJSDate()
      const dayEnd = DateTime.fromISO(dayKey).setZone(userTimezone).endOf("day").toJSDate()

      // Skip today
      if (dayStart >= startOfDay) continue

      const daySummary = await DailySummary.findOne({
        userId,
        seasonId: season._id,
        date: { $gte: dayStart, $lte: dayEnd }
      })

      if (!daySummary) {
        unclosedDays.push({
          date: dayKey,
          sales: dayEntries.reduce((sum, e) => sum + (e.salesVolume || 0), 0)
        })
      }
    }

    const hasUnclosedDays = unclosedDays.length > 0
    const mostRecentUnclosed = unclosedDays.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )[0] || null

    const todayEntries = entries.filter(
      e => new Date(e.date) >= startOfDay && new Date(e.date) <= endOfDay
    )

    const todaySales = todayEntries.reduce(
      (sum, e) => sum + (e.salesVolume || 0), 0
    )

    const completedSummaries = summaries
    const completedDays = completedSummaries.length
    const completedVolume = completedSummaries.reduce(
      (sum, s) => sum + (s.sales || 0), 0
    )

    const remainingDays = Math.max(season.totalWorkDays - completedDays, 1)
    const remainingVolume = Math.max(season.requiredVolume - completedVolume, 0)
    const todayTarget = todaySummary
      ? todaySummary.target
      : remainingVolume / remainingDays

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
      entries,
      summaries,
      totalVolume,
      season: {
        commissionRate: season.commissionRate,
        taxRate: season.taxRate,
        requiredVolume: season.requiredVolume,
        totalWorkDays: season.totalWorkDays
      },
      hasUnclosedDays,
      unclosedYesterdaySales: mostRecentUnclosed?.sales || 0,
      unclosedDate: mostRecentUnclosed?.date || null,
      seasonComplete,
      totalCompletedDays
    })

  } catch (err) {
    console.error("DASHBOARD ERROR:", err)
    res.status(500).json({ message: "Dashboard crash", error: err.message })
  }
}