export interface LeaderboardEntry {
  nickname: string
  points: number
  streak: number
  questionsAnswered: number
  correctAnswers: number
  timestamp: number
  date: string
  gameType?: string // Added to distinguish between different games
  walletAddress?: string
  gamesPlayed?: number
}

export interface GameSession {
  nickname: string
  currentStreak: number
  currentMultiplier: number
  totalPoints: number
  questionsAnswered: number
  correctAnswers: number
  recentQuestions: number[]
}

export function calculateStreakPoints(streak: number): number {
  if (streak < 3) return 0

  const streakGroups = Math.floor(streak / 3)
  const multiplier = 1 + (streakGroups - 1) * 0.1
  return Math.round(multiplier * 10) / 10 // Round to 1 decimal place
}

export function shouldAwardPoints(oldStreak: number, newStreak: number): boolean {
  const oldGroups = Math.floor(oldStreak / 3)
  const newGroups = Math.floor(newStreak / 3)
  return newGroups > oldGroups
}

export function getLeaderboard(type: "global" | "weekly" | "daily", gameType?: string): LeaderboardEntry[] {
  const key = gameType ? `leaderboard_${gameType}_${type}` : `leaderboard_${type}`
  const stored = localStorage.getItem(key)

  if (!stored) return []

  const entries: LeaderboardEntry[] = JSON.parse(stored)

  // Filter based on type
  const now = new Date()
  const filtered = entries.filter((entry) => {
    const entryDate = new Date(entry.timestamp)

    switch (type) {
      case "daily":
        return entryDate.toDateString() === now.toDateString()
      case "weekly":
        const weekStart = new Date(now)
        weekStart.setDate(now.getDate() - now.getDay())
        weekStart.setHours(0, 0, 0, 0)
        return entryDate >= weekStart
      case "global":
      default:
        return true
    }
  })

  return filtered.sort((a, b) => b.points - a.points).slice(0, 10)
}

export function addToLeaderboard(entry: Omit<LeaderboardEntry, "timestamp" | "date">): void {
  const now = new Date()
  const fullEntry: LeaderboardEntry = {
    ...entry,
    timestamp: now.getTime(),
    date: now.toISOString().split("T")[0],
  }

  // Add to all leaderboards
  const types = ["global", "weekly", "daily"]
  const gameType = entry.gameType || "quiz" // Default to quiz for backward compatibility

  types.forEach((type) => {
    // Add to game-specific leaderboard
    const gameKey = `leaderboard_${gameType}_${type}`
    const gameStored = localStorage.getItem(gameKey)
    const gameEntries: LeaderboardEntry[] = gameStored ? JSON.parse(gameStored) : []
    gameEntries.push(fullEntry)
    localStorage.setItem(gameKey, JSON.stringify(gameEntries))

    // Also add to general leaderboard for backward compatibility (quiz only)
    if (gameType === "quiz") {
      const key = `leaderboard_${type}`
      const stored = localStorage.getItem(key)
      const entries: LeaderboardEntry[] = stored ? JSON.parse(stored) : []
      entries.push(fullEntry)
      localStorage.setItem(key, JSON.stringify(entries))
    }
  })
}

export function getCurrentSession(): GameSession | null {
  const stored = localStorage.getItem("currentSession")
  return stored ? JSON.parse(stored) : null
}

export function saveCurrentSession(session: GameSession): void {
  localStorage.setItem("currentSession", JSON.stringify(session))
}

export function clearCurrentSession(): void {
  localStorage.removeItem("currentSession")
}

export function get2048Leaderboard(type: "global" | "weekly" | "daily"): any[] {
  const key = `leaderboard_2048_${type}`
  const stored = localStorage.getItem(key)

  if (!stored) return []

  const entries: any[] = JSON.parse(stored)

  // Filter based on type
  const now = new Date()
  const filtered = entries.filter((entry) => {
    const entryDate = new Date(entry.timestamp)

    switch (type) {
      case "daily":
        return entryDate.toDateString() === now.toDateString()
      case "weekly":
        const weekStart = new Date(now)
        weekStart.setDate(now.getDate() - now.getDay())
        weekStart.setHours(0, 0, 0, 0)
        return entryDate >= weekStart
      case "global":
      default:
        return true
    }
  })

  return filtered.sort((a, b) => b.score - a.score).slice(0, 10)
}

export function addTo2048Leaderboard(entry: {
  nickname: string
  score: number
  maxTile: number
  walletAddress?: string
  gamesPlayed?: number
  timesReached2048?: number
}): void {
  const now = new Date()
  const fullEntry = {
    ...entry,
    timestamp: now.getTime(),
    date: now.toISOString().split("T")[0],
    gameType: "2048",
  }

  // Add to all 2048 leaderboards
  const types = ["global", "weekly", "daily"]

  types.forEach((type) => {
    const key = `leaderboard_2048_${type}`
    const stored = localStorage.getItem(key)
    const entries: any[] = stored ? JSON.parse(stored) : []

    entries.push(fullEntry)
    localStorage.setItem(key, JSON.stringify(entries))
  })
}

export function getXPLQuizLeaderboard(type: "global" | "weekly" | "daily"): any[] {
  const key = `leaderboard_xpl-quiz_${type}`
  const stored = localStorage.getItem(key)

  if (!stored) return []

  const entries: any[] = JSON.parse(stored)

  // Filter based on type
  const now = new Date()
  const filtered = entries.filter((entry) => {
    const entryDate = new Date(entry.timestamp)

    switch (type) {
      case "daily":
        return entryDate.toDateString() === now.toDateString()
      case "weekly":
        const weekStart = new Date(now)
        weekStart.setDate(now.getDate() - now.getDay())
        weekStart.setHours(0, 0, 0, 0)
        return entryDate >= weekStart
      case "global":
      default:
        return true
    }
  })

  return filtered.sort((a, b) => b.points - a.points).slice(0, 10)
}
