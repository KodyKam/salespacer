// server/controllers/seasonController.js

import Season from "../models/Season.js"
import { calculateRequiredVolume } from "../utils/calculations.js"

export const createSeason = async (req, res) => {
  const userId = req.user.id

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
}