// server/controllers/dayController.js
import Season from "../models/Season.js"
import DailyEntry from "../models/DailyEntry.js"
import DailySummary from "../models/DailySummary.js"

export const endDay = async (req, res) => {
  try {
    const userId = "dev-user-123"

    const season = await Season.findOne({ userId })
    if (!season) {
      return res.status(400).json({ message: "No season found" })
    }

    const today = new Date().toDateString()

    // 🚫 prevent double closing
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

    // 📊 get entries FIRST
    const entries = await DailyEntry.find({
      userId,
      seasonId: season._id
    })

    const todaySalesRaw = entries
      .filter(e => new Date(e.date).toDateString() === today)
      .reduce((sum, e) => sum + (e.salesVolume || 0), 0)

    const todaySales = Number(todaySalesRaw || 0)

    const todayTarget =
      season.totalWorkDays > 0
        ? Number(season.requiredVolume / season.totalWorkDays)
        : 0

    const difference = todaySales - todayTarget
    const isSuccess = todaySales >= todayTarget

    // 🔥 STREAK LOGIC
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    const yesterdaySummary = await DailySummary.findOne({
      userId,
      seasonId: season._id,
      date: yesterday.toDateString()
    })

    let newStreak = 0

    if (isSuccess) {
      newStreak =
        yesterdaySummary?.status === "on-track"
          ? (season.streak || 0) + 1
          : 1
    }

    season.streak = newStreak
    await season.save()

    // 💾 SAVE SUMMARY (SOURCE OF TRUTH)
    await DailySummary.create({
      userId,
      seasonId: season._id,
      date: today,
      sales: todaySales,
      target: todayTarget,
      difference,
      status: isSuccess ? "on-track" : "behind",
      isCompleted: true
    })

    // 📤 RESPONSE (FRONTEND TRUSTS THIS ONLY)
    res.json({
      todaySales,
      todayTarget,
      difference,
      streak: newStreak,
      isSuccess,
      message: isSuccess
        ? "🔥 Strong day"
        : "⚠️ Tomorrow is a reset reset opportunity"
    })

  } catch (err) {
    console.error("END DAY ERROR:", err)
    res.status(500).json({ message: "End day failed" })
  }
}