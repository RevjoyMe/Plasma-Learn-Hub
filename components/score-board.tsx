"use client"

import { Card } from "@/components/ui/card"

interface ScoreBoardProps {
  score: number
  bestScore: number
  maxTile: number
}

export function ScoreBoard({ score, bestScore, maxTile }: ScoreBoardProps) {
  return (
    <div className="flex justify-center gap-4">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4 text-center min-w-[120px]">
        <div className="text-white/70 text-sm font-medium">SCORE</div>
        <div className="text-white text-2xl font-bold">{score.toLocaleString()}</div>
      </Card>

      <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4 text-center min-w-[120px]">
        <div className="text-white/70 text-sm font-medium">BEST</div>
        <div className="text-white text-2xl font-bold">{bestScore.toLocaleString()}</div>
      </Card>

      <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4 text-center min-w-[120px]">
        <div className="text-white/70 text-sm font-medium">MAX TILE</div>
        <div className="text-white text-2xl font-bold">{maxTile}</div>
      </Card>
    </div>
  )
}
