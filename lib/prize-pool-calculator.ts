import { getBlockchainInstance } from "./blockchain"

export interface PrizePoolData {
  totalPool: number
  participants: number
  endDate: string
  rewards: {
    position: number
    percentage: number
    amount: number
    color: string
  }[]
  lastUpdated: Date
}

// Calculate weekly prize pool based on contract data
export async function calculateWeeklyPrizePool(): Promise<PrizePoolData> {
  try {
    const blockchain = getBlockchainInstance()
    
    // Get contract instance
    const contract = blockchain.getContract()
    
    // Get total fees collected this week (this would need to be implemented in the contract)
    // For now, we'll simulate this with a placeholder value
    // In a real implementation, you would call a contract method like:
    // const totalFees = await contract.methods.getWeeklyFees().call()
    
    // Simulate total fees collected (replace with actual contract call)
    const totalFees = 0.0085 // This represents 8.5 paid games at 0.001 XPL each
    
    // Calculate prize pool (10% of total fees)
    const prizePool = totalFees * 0.1
    
    // Calculate end date (next Monday at 00:00 UTC)
    const now = new Date()
    const daysUntilMonday = (8 - now.getUTCDay()) % 7
    const endDate = new Date(now.getTime() + daysUntilMonday * 24 * 60 * 60 * 1000)
    endDate.setUTCHours(0, 0, 0, 0)
    
    // Format end date
    const endDateString = endDate.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC'
    }) + ' at 00:00 UTC'
    
    // Calculate rewards distribution
    const rewards = [
      { position: 1, percentage: 50, amount: prizePool * 0.5, color: "bg-yellow-500" },
      { position: 2, percentage: 25, amount: prizePool * 0.25, color: "bg-gray-400" },
      { position: 3, percentage: 15, amount: prizePool * 0.15, color: "bg-orange-600" },
      { position: 4, percentage: 7, amount: prizePool * 0.07, color: "bg-blue-500" },
      { position: 5, percentage: 3, amount: prizePool * 0.03, color: "bg-green-500" },
    ]
    
    // Estimate participants based on total fees (assuming 0.001 XPL per game)
    const estimatedParticipants = Math.floor(totalFees / 0.001)
    
    return {
      totalPool: prizePool,
      participants: estimatedParticipants,
      endDate: endDateString,
      rewards,
      lastUpdated: new Date()
    }
  } catch (error) {
    console.error("Error calculating prize pool:", error)
    
    // Return fallback data
    return {
      totalPool: 0.85,
      participants: 850,
      endDate: "Monday at 00:00 UTC",
      rewards: [
        { position: 1, percentage: 50, amount: 0.425, color: "bg-yellow-500" },
        { position: 2, percentage: 25, amount: 0.2125, color: "bg-gray-400" },
        { position: 3, percentage: 15, amount: 0.1275, color: "bg-orange-600" },
        { position: 4, percentage: 7, amount: 0.0595, color: "bg-blue-500" },
        { position: 5, percentage: 3, amount: 0.0255, color: "bg-green-500" },
      ],
      lastUpdated: new Date()
    }
  }
}

// Get cached prize pool data (to avoid repeated calculations)
let cachedPrizePool: PrizePoolData | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function getCachedPrizePool(): Promise<PrizePoolData> {
  const now = Date.now()
  
  // Return cached data if it's still valid
  if (cachedPrizePool && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedPrizePool
  }
  
  // Calculate new data
  const newData = await calculateWeeklyPrizePool()
  cachedPrizePool = newData
  cacheTimestamp = now
  
  return newData
}

// Reset cache (useful for testing or manual refresh)
export function resetPrizePoolCache(): void {
  cachedPrizePool = null
  cacheTimestamp = 0
}
