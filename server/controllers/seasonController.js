// server/controllers/seasonController.js
import Season from "../models/Season.js"
import { calculateRequiredVolume } from "../utils/calculations.js"
import DailySummary from "../models/DailySummary.js"
import DailyEntry from "../models/DailyEntry.js"

export const createSeason = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { incomeGoal, commissionRate, taxRate, totalWorkDays } = req.body

    if (
      incomeGoal === undefined || commissionRate === undefined ||
      taxRate === undefined || totalWorkDays === undefined ||
      isNaN(incomeGoal) || isNaN(commissionRate) ||
      isNaN(taxRate) || isNaN(totalWorkDays)
    ) {
      return res.status(400).json({ message: "Missing or invalid fields" })
    }

    const commissionDecimal = Number(commissionRate) / 100
    const taxDecimal = Number(taxRate) / 100

    const requiredVolume = calculateRequiredVolume(
      Number(incomeGoal),
      commissionDecimal,
      taxDecimal
    )

    await Season.deleteMany({ userId })

    const season = await Season.create({
      userId,
      requiredVolume,
      commissionRate: commissionDecimal,
      taxRate: taxDecimal,
      totalWorkDays: Number(totalWorkDays),
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

    const { incomeGoal, commissionRate, taxRate, totalWorkDays } = req.body

    const commissionDecimal = Number(commissionRate) / 100
    const taxDecimal = Number(taxRate) / 100

    const requiredVolume = calculateRequiredVolume(
      Number(incomeGoal),
      commissionDecimal,
      taxDecimal
    )

    const season = await Season.findOneAndUpdate(
      { userId },
      {
        requiredVolume,
        commissionRate: commissionDecimal,
        taxRate: taxDecimal,
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