// server/controllers/seasonController.js
import Season from "../models/Season.js"
import { calculateRequiredVolume } from "../utils/calculations.js"
import DailySummary from "../models/DailySummary.js"
import DailyEntry from "../models/DailyEntry.js"

export const createSeason = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const { incomeGoal, commissionRate, taxRate, totalWorkDays, name } = req.body

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

    // Mark any existing active season as completed
    await Season.updateMany(
      { userId, status: "active" },
      { status: "completed", endDate: new Date() }
    )

    const season = await Season.create({
      userId,
      name: name || "",
      requiredVolume,
      commissionRate: commissionDecimal,
      taxRate: taxDecimal,
      totalWorkDays: Number(totalWorkDays),
      streak: 0,
      status: "active",
      startDate: new Date()
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
    const season = await Season.findOne({ userId, status: "active" })
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

    const { incomeGoal, commissionRate, taxRate, totalWorkDays, name } = req.body

    const commissionDecimal = Number(commissionRate) / 100
    const taxDecimal = Number(taxRate) / 100

    const requiredVolume = calculateRequiredVolume(
      Number(incomeGoal),
      commissionDecimal,
      taxDecimal
    )

    const season = await Season.findOneAndUpdate(
      { userId, status: "active" },
      {
        name: name || "",
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

export const endSeason = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const season = await Season.findOne({ userId, status: "active" })
    if (!season) return res.status(404).json({ message: "No active season found" })

    // Get all summaries for this season
    const summaries = await DailySummary.find({
      userId,
      seasonId: season._id,
      isCompleted: true
    })

    // Calculate season stats
    const totalGrossSales = summaries.reduce((sum, s) => sum + (s.sales || 0), 0)
    const preTaxSales = totalGrossSales / (1 + season.taxRate)
    const totalIncome = preTaxSales * season.commissionRate
    const totalBonus = summaries.reduce((sum, s) => sum + (s.bonus || 0), 0)
    const totalEarnings = totalIncome + totalBonus
    const wins = summaries.filter(s => s.status === "on-track").length
    const winRate = summaries.length > 0
      ? Math.round((wins / summaries.length) * 100)
      : 0

    let bestStreak = 0
    let currentStreak = 0
    summaries.forEach(s => {
      if (s.status === "on-track") {
        currentStreak++
        bestStreak = Math.max(bestStreak, currentStreak)
      } else {
        currentStreak = 0
      }
    })

    // Mark season as completed
    season.status = "completed"
    season.endDate = new Date()
    await season.save()

    res.json({
      seasonName: season.name || "Season",
      startDate: season.startDate,
      endDate: season.endDate,
      totalWorkDays: season.totalWorkDays,
      daysWorked: summaries.length,
      totalGrossSales,
      totalIncome,
      totalBonus,
      totalEarnings,
      requiredVolume: season.requiredVolume,
      goalHit: totalGrossSales >= season.requiredVolume,
      winRate,
      bestStreak
    })

  } catch (err) {
    console.error("END SEASON ERROR:", err)
    res.status(500).json({ message: err.message })
  }
}

export const getSeasonHistory = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })

    const seasons = await Season.find({
      userId,
      status: "completed"
    }).sort({ endDate: -1 })

    const history = await Promise.all(seasons.map(async (season) => {
      const summaries = await DailySummary.find({
        userId,
        seasonId: season._id,
        isCompleted: true
      })

      const totalGrossSales = summaries.reduce((sum, s) => sum + (s.sales || 0), 0)
      const preTaxSales = totalGrossSales / (1 + season.taxRate)
      const totalIncome = preTaxSales * season.commissionRate
      const totalBonus = summaries.reduce((sum, s) => sum + (s.bonus || 0), 0)
      const wins = summaries.filter(s => s.status === "on-track").length
      const winRate = summaries.length > 0
        ? Math.round((wins / summaries.length) * 100)
        : 0

      return {
        _id: season._id,
        name: season.name || "Unnamed Season",
        startDate: season.startDate,
        endDate: season.endDate,
        totalWorkDays: season.totalWorkDays,
        daysWorked: summaries.length,
        totalGrossSales,
        totalIncome: totalIncome + totalBonus,
        winRate,
        goalHit: totalGrossSales >= season.requiredVolume
      }
    }))

    res.json(history)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const deleteSeason = async (req, res) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ message: "Unauthorized" })
    const season = await Season.findOne({ userId, status: "active" })
    if (season) {
      await DailySummary.deleteMany({ userId, seasonId: season._id })
      await DailyEntry.deleteMany({ userId, seasonId: season._id })
      await Season.deleteOne({ _id: season._id })
    }
    res.json({ message: "Season reset" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}