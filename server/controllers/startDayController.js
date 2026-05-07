// server/controllers/startDayController.js
import Season from "../models/Season.js"
import DailySummary from "../models/DailySummary.js"

export const startDay = async (req, res) => {
  try {
    const userId = req.user?.id || "dev-user-123"

    const season = await Season.findOne({ userId })
    if (!season) {
      return res.status(400).json({ message: "No season found" })
    }

    const today = new Date().toDateString()

    // check if already started today
    const existing = await DailySummary.findOne({
      userId,
      seasonId: season._id,
      date: today
    })

    if (existing) {
      return res.json({
        message: "Day already active",
        isNew: false
      })
    }

    // create empty “active day marker”
    const summary = await DailySummary.create({
      userId,
      seasonId: season._id,
      date: today,
      sales: 0,
      target:
        season.totalWorkDays > 0
          ? season.requiredVolume / season.totalWorkDays
          : 0,
      difference: 0,
      status: "on-track",
      isCompleted: false
    })

    res.json({
      message: "New day started",
      isNew: true,
      summary
    })

  } catch (err) {
    console.error("START DAY ERROR:", err)
    res.status(500).json({ message: "Start day failed" })
  }
}