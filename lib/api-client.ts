"use client"

interface GameStats {
  totalGames: number
  bestScore: number
  totalSpent: string
  gamesHistory: Array<{
    gameId: string
    score: number
    maxTile: number
    timestamp: string
    spent: string
  }>
}

interface LeaderboardEntry {
  address: string
  bestScore: number
  totalGames: number
  lastPlayed: string
}

interface AppConfig {
  contractAddress: string
  plasmaNetwork: {
    chainId: string
    chainName: string
    rpcUrl: string
    explorerUrl: string
    nativeCurrency: {
      name: string
      symbol: string
      decimals: number
    }
  }
  gameSettings: {
    defaultGamePrice: string
    maxRetries: number
    transactionTimeout: number
  }
}

class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = typeof window !== "undefined" ? window.location.origin : ""
  }

  async getConfig(): Promise<AppConfig> {
    const response = await fetch(`${this.baseUrl}/api/config`)
    if (!response.ok) {
      throw new Error("Failed to fetch configuration")
    }
    return response.json()
  }

  async getStats(address: string): Promise<GameStats> {
    const response = await fetch(`${this.baseUrl}/api/stats?address=${encodeURIComponent(address)}`)
    if (!response.ok) {
      throw new Error("Failed to fetch stats")
    }
    return response.json()
  }

  async updateStats(
    address: string,
    gameId: string,
    score: number,
    maxTile: number,
    spent: string,
  ): Promise<GameStats> {
    const response = await fetch(`${this.baseUrl}/api/stats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address,
        gameId,
        score,
        maxTile,
        spent,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to update stats")
    }

    const result = await response.json()
    return result.stats
  }

  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    const response = await fetch(`${this.baseUrl}/api/leaderboard`)
    if (!response.ok) {
      throw new Error("Failed to fetch leaderboard")
    }
    const result = await response.json()
    return result.leaderboard
  }

  async updateLeaderboard(address: string, score: number, gameId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/api/leaderboard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address,
        score,
        gameId,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to update leaderboard")
    }
  }

  async healthCheck(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/health`)
    if (!response.ok) {
      throw new Error("Health check failed")
    }
    return response.json()
  }
}

export const apiClient = new ApiClient()
