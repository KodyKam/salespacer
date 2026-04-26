// server/utils/calculations.js
export const calculateRequiredVolume = (incomeGoal, commissionRate) => {
  return incomeGoal / commissionRate
}

export const calculateDailyTarget = (season) => {
  if (!season?.requiredVolume || !season?.totalWorkDays) return 0

  return season.requiredVolume / season.totalWorkDays
}