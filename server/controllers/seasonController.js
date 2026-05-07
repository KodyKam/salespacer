// server/controllers/seasonController.js
import Season from "../models/Season.js"
// import { DEV_USER_ID } from "../config/devUser.js"
import DailySummary from "../models/DailySummary.js"
import DailyEntry from "../models/DailyEntry.js"

export const createSeason = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { requiredVolume, totalWorkDays, commissionRate } = req.body

    if (
      requiredVolume === undefined || totalWorkDays === undefined ||
      commissionRate === undefined || isNaN(requiredVolume) ||
      isNaN(totalWorkDays) || isNaN(commissionRate)
    ) {
      return res.status(400).json({ message: "Missing or invalid fields" })
    }

    await Season.deleteMany({ userId })

    const season = await Season.create({
      userId,
      requiredVolume: Number(requiredVolume),
      totalWorkDays: Number(totalWorkDays),
      commissionRate: Number(commissionRate),
      streak: 0
    })

    return res.status(201).json(season)
  } catch (err) {
    console.error("CREATE SEASON ERROR:", err)
    return res.status(500).json({ message: err.message })
  }
}

export const getSeason = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })
    const season = await Season.findOne({ userId })
    if (!season) return res.status(404).json({ message: "No season found" })
    res.json(season)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const updateSeason = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })
    const { requiredVolume, commissionRate, totalWorkDays } = req.body

    const season = await Season.findOneAndUpdate(
      { userId },
      {
        requiredVolume: Number(requiredVolume),
        commissionRate: Number(commissionRate) / 100,
        totalWorkDays: Number(totalWorkDays)
      },
      { new: true }
    )

    if (!season) return res.status(404).json({ message: "No season to update" })
    res.json(season)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const deleteSeason = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })
    await Season.deleteMany({ userId })
    await DailySummary.deleteMany({ userId })
    await DailyEntry.deleteMany({ userId })
    res.json({ message: "Season reset" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}