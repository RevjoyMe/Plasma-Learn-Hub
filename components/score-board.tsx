"use client"

import { Card } from "@/components/ui/card"

interface ScoreBoardProps {
  score: number
  bestScore: number
  maxTile: number
}

export function ScoreBoard({ score, bestScore, maxTile }: ScoreBoardProps) {
  return (
    <div className="flex justify-center gap-3">
      <Card className="bg-white border-gray-200 p-3 text-center min-w-[100px] shadow-sm">
        <div className="text-gray-600 text-xs font-medium mb-1">SCORE</div>
        <div className="text-gray-900 text-xl font-bold">{score.toLocaleString()}</div>
      </Card>

      <Card className="bg-white border-gray-200 p-3 text-center min-w-[100px] shadow-sm">
        <div className="text-gray-600 text-xs font-medium mb-1">BEST</div>
        <div className="text-gray-900 text-xl font-bold">{bestScore.toLocaleString()}</div>
      </Card>

      <Card className="bg-white border-gray-200 p-3 text-center min-w-[100px] shadow-sm">
        <div className="text-gray-600 text-xs font-medium mb-1">MAX TILE</div>
        <div className="text-gray-900 text-xl font-bold">{maxTile}</div>
      </Card>
    </div>
  )
}
