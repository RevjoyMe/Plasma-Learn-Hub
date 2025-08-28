"use client"

import { cn } from "@/lib/utils"

interface GameBoardProps {
  board: number[][]
}

export function GameBoard({ board }: GameBoardProps) {
  const getTileColor = (value: number) => {
    const colors: Record<number, string> = {
      0: "bg-gray-100 border-gray-200",
      2: "bg-gray-50 text-gray-800 border-gray-200",
      4: "bg-gray-100 text-gray-800 border-gray-300",
      8: "bg-orange-100 text-orange-800 border-orange-200",
      16: "bg-orange-200 text-orange-900 border-orange-300",
      32: "bg-orange-300 text-white border-orange-400",
      64: "bg-orange-400 text-white border-orange-500",
      128: "bg-yellow-200 text-yellow-900 border-yellow-300",
      256: "bg-yellow-300 text-yellow-900 border-yellow-400",
      512: "bg-yellow-400 text-white border-yellow-500",
      1024: "bg-yellow-500 text-white border-yellow-600",
      2048: "bg-yellow-600 text-white border-yellow-700",
    }
    return colors[value] || "bg-purple-500 text-white border-purple-600"
  }

  return (
    <div className="bg-gray-200 p-4 rounded-lg">
      <div className="grid grid-cols-4 gap-3 w-80 h-80">
        {board.flat().map((value, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center justify-center text-2xl font-bold rounded-md transition-all duration-200 border-2 min-h-[70px] min-w-[70px]",
              getTileColor(value),
              value === 0 ? "text-transparent" : "",
            )}
          >
            {value !== 0 && value}
          </div>
        ))}
      </div>
    </div>
  )
}
