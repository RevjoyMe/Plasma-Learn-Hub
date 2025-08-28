"use client"

import { Card } from "@/components/ui/card"
import { Trophy, Gamepad2, Coins } from "lucide-react"

interface PlayerStatsProps {
  totalGames: number
  bestScore: number
  totalSpent: string
}

export function PlayerStats({ totalGames, bestScore, totalSpent }: PlayerStatsProps) {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6">
      <h3 className="text-lg font-semibold text-white mb-4 text-center">Player Statistics</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <Gamepad2 className="w-6 h-6 text-blue-300" />
          </div>
          <div className="text-white/70 text-sm font-medium">TOTAL GAMES</div>
          <div className="text-white text-xl font-bold">{totalGames}</div>
        </div>

        <div className="text-center">
          <div className="flex justify-center mb-2">
            <Trophy className="w-6 h-6 text-yellow-300" />
          </div>
          <div className="text-white/70 text-sm font-medium">BEST SCORE</div>
          <div className="text-white text-xl font-bold">{bestScore.toLocaleString()}</div>
        </div>

        <div className="text-center">
          <div className="flex justify-center mb-2">
            <Coins className="w-6 h-6 text-green-300" />
          </div>
          <div className="text-white/70 text-sm font-medium">TOTAL SPENT</div>
          <div className="text-white text-xl font-bold">{totalSpent}</div>
        </div>
      </div>
    </Card>
  )
}
