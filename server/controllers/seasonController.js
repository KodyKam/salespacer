// server/controllers/seasonController.js
import Season from "../models/Season.js"
import { calculateRequiredVolume } from "../utils/calculations.js"
import { DEV_USER_ID } from "../config/devUser.js"

export const createSeason = async (req, res) => {
  try {
    const userId = "DEV_USER_ID" // DEV ONLY - use fake user if not authenticated

    const {
      companyName,
      incomeGoal,
      commissionRate,
      totalWorkDays
    } = req.body

    const requiredVolume = calculateRequiredVolume(
      incomeGoal,
      commissionRate
    )

    const season = await Season.create({
      userId,
      companyName,
      incomeGoal,
      commissionRate,
      totalWorkDays,
      requiredVolume
    })

    res.json(season)
  } catch (err) {
    console.error("CREATE SEASON ERROR:", err)
    res.status(500).json({ message: "Failed to create season" })
  }
}