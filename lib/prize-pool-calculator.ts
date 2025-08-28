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

// Get the start of the current week (Monday 00:00 UTC)
function getCurrentWeekStart(): Date {
  const now = new Date()
  const daysUntilMonday = (8 - now.getUTCDay()) % 7
  const weekStart = new Date(now.getTime() - daysUntilMonday * 24 * 60 * 60 * 1000)
  weekStart.setUTCHours(0, 0, 0, 0)
  return weekStart
}

// Get the start of the previous week (Monday 00:00 UTC)
function getPreviousWeekStart(): Date {
  const currentWeekStart = getCurrentWeekStart()
  const previousWeekStart = new Date(currentWeekStart.getTime() - 7 * 24 * 60 * 60 * 1000)
  return previousWeekStart
}

// Calculate weekly prize pool based on contract data
export async function calculateWeeklyPrizePool(): Promise<PrizePoolData> {
  try {
    const blockchain = getBlockchainInstance()
    
    // Get contract instance
    const contract = blockchain.getContract()
    
    // Get current week start
    const weekStart = getCurrentWeekStart()
    const weekStartTimestamp = Math.floor(weekStart.getTime() / 1000)
    
    // Get all purchase events from the contract for the current week
    // This would require the contract to emit events for purchases
    // For now, we'll simulate this with localStorage data
    const purchaseEvents = await getPurchaseEventsFromStorage(weekStartTimestamp)
    
    // Calculate total fees collected this week
    const totalFees = purchaseEvents.reduce((sum, event) => sum + event.amount, 0)
    
    // Calculate prize pool (10% of total fees)
    const prizePool = totalFees * 0.1
    
    // Get unique participants (unique wallet addresses)
    const uniqueParticipants = new Set(purchaseEvents.map(event => event.walletAddress)).size
    
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
    
    return {
      totalPool: prizePool,
      participants: uniqueParticipants,
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

// Interface for purchase events
interface PurchaseEvent {
  walletAddress: string
  amount: number
  timestamp: number
  gameType: string
}

// Get purchase events from localStorage (simulating contract events)
async function getPurchaseEventsFromStorage(weekStartTimestamp: number): Promise<PurchaseEvent[]> {
  try {
    // Get all purchase events from localStorage
    const allEvents = JSON.parse(localStorage.getItem('purchaseEvents') || '[]')
    
    // Filter events for the current week
    const currentWeekEvents = allEvents.filter((event: PurchaseEvent) => 
      event.timestamp >= weekStartTimestamp
    )
    
    return currentWeekEvents
  } catch (error) {
    console.error("Error getting purchase events:", error)
    return []
  }
}

// Add purchase event to localStorage (called when user purchases a game)
export function addPurchaseEvent(walletAddress: string, amount: number, gameType: string): void {
  try {
    const event: PurchaseEvent = {
      walletAddress,
      amount,
      timestamp: Math.floor(Date.now() / 1000),
      gameType
    }
    
    const existingEvents = JSON.parse(localStorage.getItem('purchaseEvents') || '[]')
    existingEvents.push(event)
    localStorage.setItem('purchaseEvents', JSON.stringify(existingEvents))
    
    // Reset cache to force recalculation
    resetPrizePoolCache()
  } catch (error) {
    console.error("Error adding purchase event:", error)
  }
}

// Interface for previous week data
export interface PreviousWeekData {
  totalPool: number
  participants: number
  winners: {
    position: number
    walletAddress: string
    amount: number
    nickname?: string
  }[]
  weekStart: string
  weekEnd: string
}

// Get previous week's prize pool data
export async function getPreviousWeekData(): Promise<PreviousWeekData | null> {
  try {
    const previousWeekStart = getPreviousWeekStart()
    const currentWeekStart = getCurrentWeekStart()
    const previousWeekStartTimestamp = Math.floor(previousWeekStart.getTime() / 1000)
    const currentWeekStartTimestamp = Math.floor(currentWeekStart.getTime() / 1000)
    
    // Get purchase events from previous week
    const allEvents = JSON.parse(localStorage.getItem('purchaseEvents') || '[]')
    const previousWeekEvents = allEvents.filter((event: PurchaseEvent) => 
      event.timestamp >= previousWeekStartTimestamp && event.timestamp < currentWeekStartTimestamp
    )
    
    if (previousWeekEvents.length === 0) {
      return null
    }
    
    // Calculate total fees and participants
    const totalFees = previousWeekEvents.reduce((sum, event) => sum + event.amount, 0)
    const totalPool = totalFees * 0.1
    const uniqueParticipants = new Set(previousWeekEvents.map(event => event.walletAddress)).size
    
    // Get winners from leaderboard (simulate based on highest scores)
    const winners = await getPreviousWeekWinners(previousWeekStartTimestamp, currentWeekStartTimestamp)
    
    return {
      totalPool,
      participants: uniqueParticipants,
      winners,
      weekStart: previousWeekStart.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC'
      }),
      weekEnd: currentWeekStart.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC'
      })
    }
  } catch (error) {
    console.error("Error getting previous week data:", error)
    return null
  }
}

// Get previous week winners (simulate based on leaderboard data)
async function getPreviousWeekWinners(weekStart: number, weekEnd: number): Promise<PreviousWeekData['winners']> {
  try {
    // Get XPL Quiz leaderboard data
    const leaderboardData = JSON.parse(localStorage.getItem('leaderboard_xpl_quiz_global') || '[]')
    
    // Filter for previous week and sort by score
    const previousWeekEntries = leaderboardData
      .filter((entry: any) => {
        const entryTime = new Date(entry.timestamp || Date.now()).getTime() / 1000
        return entryTime >= weekStart && entryTime < weekEnd
      })
      .sort((a: any, b: any) => b.score - a.score)
    
    // Take top 5 winners
    const top5 = previousWeekEntries.slice(0, 5)
    
    // Calculate reward amounts (same distribution as current week)
    const totalPool = 0.85 // This would be calculated from actual data
    const rewards = [
      { position: 1, percentage: 50, amount: totalPool * 0.5 },
      { position: 2, percentage: 25, amount: totalPool * 0.25 },
      { position: 3, percentage: 15, amount: totalPool * 0.15 },
      { position: 4, percentage: 7, amount: totalPool * 0.07 },
      { position: 5, percentage: 3, amount: totalPool * 0.03 },
    ]
    
    return top5.map((entry: any, index: number) => ({
      position: index + 1,
      walletAddress: entry.walletAddress || 'Unknown',
      amount: rewards[index]?.amount || 0,
      nickname: entry.nickname || 'Anonymous'
    }))
  } catch (error) {
    console.error("Error getting previous week winners:", error)
    return []
  }
}
