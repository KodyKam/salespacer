// server/utils/calculations.js
// How much gross sales volume needed to hit income goal
export const calculateRequiredVolume = (incomeGoal, commissionRate, taxRate) => {
  const preTaxVolumeNeeded = incomeGoal / commissionRate
  const grossVolumeNeeded = preTaxVolumeNeeded * (1 + taxRate)
  return grossVolumeNeeded
}

// Daily gross sales target
export const calculateDailyTarget = (season) => {
  if (!season?.requiredVolume || !season?.totalWorkDays) return 0
  return season.requiredVolume / season.totalWorkDays
}

// Income earned from a gross sale amount
export const calculateIncomeFromSale = (grossSale, commissionRate, taxRate) => {
  const preTax = grossSale / (1 + taxRate)
  return preTax * commissionRate
}