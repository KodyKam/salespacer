// server/controllers/dayController.js
import Season from "../models/Season.js"
import DailyEntry from "../models/DailyEntry.js"
import DailySummary from "../models/DailySummary.js"

export const endDay = async (req, res) => {
  try {
    const userId = req.user.id

    const season = await Season.findOne({ userId })
    if (!season) {
      return res.status(400).json({ message: "No season found" })
    }

    const today = new Date().toDateString()

    const existingSummary = await DailySummary.findOne({
      userId,
      seasonId: season._id,
      date: today
    })

    if (existingSummary) {
      return res.status(400).json({
        message: "Day already ended"
      })
    }

    const entries = await DailyEntry.find({
      userId,
      seasonId: season._id
    })

    const todaySales = entries
      .filter(e => new Date(e.date).toDateString() === today)
      .reduce((sum, e) => sum + e.salesVolume, 0)

    const target =
      season.totalWorkDays > 0
        ? season.requiredVolume / season.totalWorkDays
        : 0

    const difference = todaySales - target
    const isSuccess = todaySales >= target

    // 🔥 STREAK
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const yesterdaySummary = await DailySummary.findOne({
      userId,
      seasonId: season._id,
      date: yesterday.toDateString()
    })

    let newStreak = 0

    if (isSuccess) {
      if (yesterdaySummary?.status === "on-track") {
        newStreak = (season.streak || 0) + 1
      } else {
        newStreak = 1
      }
    }

    season.streak = newStreak
    await season.save()

    await DailySummary.create({
      userId,
      seasonId: season._id,
      date: today,
      sales: todaySales,
      target,
      difference,
      status: isSuccess ? "on-track" : "behind",
      isCompleted: true
    })

    res.json({
      todaySales,
      todayTarget: target,
      difference,
      streak: newStreak,
      isSuccess,
      message: isSuccess
        ? "🔥 Strong day"
        : "⚠️ Tomorrow is a reset"
    })

  } catch (err) {
    console.error("END DAY ERROR:", err)
    res.status(500).json({ message: "End day failed" })
  }
}