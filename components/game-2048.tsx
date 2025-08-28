"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import WalletConnection from "./wallet-connection"
import { getBlockchainInstance } from "@/lib/blockchain"

type Board = number[][]
type Direction = "up" | "down" | "left" | "right"

const BOARD_SIZE = 4
const WINNING_TILE = 2048

export default function Game2048() {
  const [isPaid, setIsPaid] = useState(false)
  const [gameId, setGameId] = useState<string | null>(null)
  const [board, setBoard] = useState<Board>(() => initializeBoard())
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const { toast } = useToast()

  const handlePayment = (success: boolean) => {
    setIsPaid(success)
    if (success) {
      setGameId(Math.random().toString(36).substr(2, 9))
      resetGame()
    }
  }

  const completeGameOnBlockchain = async (finalScore: number, maxTile: number) => {
    if (!gameId) return

    try {
      const blockchain = getBlockchainInstance(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "")
      await blockchain.completeGame(gameId, finalScore, maxTile)
    } catch (error) {
      console.error("Error completing game on blockchain:", error)
    }
  }

  useEffect(() => {
    if (gameOver && gameId) {
      const maxTile = Math.max(...board.flat())
      completeGameOnBlockchain(score, maxTile)
    }
  }, [gameOver, score, gameId])

  function initializeBoard(): Board {
    const newBoard = Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(0))
    addRandomTile(newBoard)
    addRandomTile(newBoard)
    return newBoard
  }

  function addRandomTile(board: Board): void {
    const emptyCells: [number, number][] = []
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (board[i][j] === 0) {
          emptyCells.push([i, j])
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length)
      const [row, col] = emptyCells[randomIndex]
      board[row][col] = Math.random() < 0.9 ? 2 : 4
    }
  }

  function moveLeft(board: Board): { newBoard: Board; moved: boolean; scoreGained: number } {
    const newBoard = board.map((row) => [...row])
    let moved = false
    let scoreGained = 0

    for (let i = 0; i < BOARD_SIZE; i++) {
      const row = newBoard[i].filter((cell) => cell !== 0)

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2
          scoreGained += row[j]
          row[j + 1] = 0
        }
      }

      const filteredRow = row.filter((cell) => cell !== 0)
      while (filteredRow.length < BOARD_SIZE) {
        filteredRow.push(0)
      }

      if (JSON.stringify(newBoard[i]) !== JSON.stringify(filteredRow)) {
        moved = true
      }
      newBoard[i] = filteredRow
    }

    return { newBoard, moved, scoreGained }
  }

  function rotateBoard(board: Board): Board {
    const newBoard = Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(0))
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        newBoard[j][BOARD_SIZE - 1 - i] = board[i][j]
      }
    }
    return newBoard
  }

  function move(direction: Direction): void {
    if (gameOver || !isPaid) return

    let currentBoard = board.map((row) => [...row])
    let rotations = 0

    switch (direction) {
      case "up":
        rotations = 3
        break
      case "right":
        rotations = 2
        break
      case "down":
        rotations = 1
        break
      case "left":
        rotations = 0
        break
    }

    for (let i = 0; i < rotations; i++) {
      currentBoard = rotateBoard(currentBoard)
    }

    const { newBoard, moved, scoreGained } = moveLeft(currentBoard)

    for (let i = 0; i < (4 - rotations) % 4; i++) {
      currentBoard = rotateBoard(newBoard)
    }

    if (moved) {
      addRandomTile(currentBoard)
      setBoard(currentBoard)
      setScore((prev) => prev + scoreGained)

      // Check for winning condition
      if (!gameWon && currentBoard.some((row) => row.some((cell) => cell === WINNING_TILE))) {
        setGameWon(true)
        toast({
          title: "Congratulations! 🎉",
          description: "You reached 2048!",
        })
      }

      // Check for game over
      if (isGameOver(currentBoard)) {
        setGameOver(true)
        toast({
          title: "Game Over",
          description: `Your score: ${score + scoreGained}`,
          variant: "destructive",
        })
      }
    }
  }

  function isGameOver(board: Board): boolean {
    // Check for empty cells
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (board[i][j] === 0) return false
      }
    }

    // Check for possible merges
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        const current = board[i][j]
        if (
          (i < BOARD_SIZE - 1 && board[i + 1][j] === current) ||
          (j < BOARD_SIZE - 1 && board[i][j + 1] === current)
        ) {
          return false
        }
      }
    }

    return true
  }

  function resetGame(): void {
    const newBoard = initializeBoard()
    setBoard(newBoard)
    setScore(0)
    setGameOver(false)
    setGameWon(false)
    setIsPaid(false)
  }

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!isPaid) return

      switch (event.key) {
        case "ArrowUp":
          event.preventDefault()
          move("up")
          break
        case "ArrowDown":
          event.preventDefault()
          move("down")
          break
        case "ArrowLeft":
          event.preventDefault()
          move("left")
          break
        case "ArrowRight":
          event.preventDefault()
          move("right")
          break
      }
    },
    [board, gameOver, isPaid],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [handleKeyPress])

  useEffect(() => {
    const saved = localStorage.getItem("2048-best-score")
    if (saved) setBestScore(Number.parseInt(saved))
  }, [])

  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score)
      localStorage.setItem("2048-best-score", score.toString())
    }
  }, [score, bestScore])

  function getTileColor(value: number): string {
    const colors: { [key: number]: string } = {
      0: "bg-muted",
      2: "bg-slate-100 text-slate-800",
      4: "bg-slate-200 text-slate-800",
      8: "bg-orange-200 text-orange-800",
      16: "bg-orange-300 text-orange-900",
      32: "bg-orange-400 text-white",
      64: "bg-orange-500 text-white",
      128: "bg-yellow-400 text-white",
      256: "bg-yellow-500 text-white",
      512: "bg-yellow-600 text-white",
      1024: "bg-red-400 text-white",
      2048: "bg-red-500 text-white",
    }
    return colors[value] || "bg-red-600 text-white"
  }

  if (!isPaid) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <WalletConnection onPayment={handlePayment} gameType="2048" />
      </div>
    )
  }

  const progressValue = Math.min((score / 10000) * 100, 100)

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-6 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-black mb-2">2048</h1>
          <p className="text-black">Combine tiles to reach 2048!</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-white shadow-lg border-2 border-blue-200">
            <CardHeader className="pb-2 bg-blue-500 text-white rounded-t-lg">
              <CardTitle className="text-sm text-white">Score</CardTitle>
            </CardHeader>
            <CardContent className="pt-2 pb-4">
              <div className="text-2xl font-bold text-black">{score}</div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg border-2 border-blue-200">
            <CardHeader className="pb-2 bg-blue-500 text-white rounded-t-lg">
              <CardTitle className="text-sm text-white">Best</CardTitle>
            </CardHeader>
            <CardContent className="pt-2 pb-4">
              <div className="text-2xl font-bold text-black">{bestScore}</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-black">
            <span>Progress</span>
            <span>{Math.round(progressValue)}%</span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>

        <Card className="p-4 bg-white shadow-lg border-2 border-blue-200">
          <div className="grid grid-cols-4 gap-2 aspect-square bg-gray-200 p-2 rounded-lg">
            {board.map((row, i) =>
              row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  className={`
                    aspect-square rounded-lg flex items-center justify-center
                    text-lg font-bold transition-all duration-200 border-2
                    ${getTileColor(cell)}
                    ${cell === 0 ? "border-gray-300" : "border-gray-400 shadow-md"}
                    ${cell === 0 ? "" : "animate-in zoom-in-50 duration-200"}
                  `}
                >
                  {cell !== 0 && cell}
                </div>
              )),
            )}
          </div>
        </Card>

        <div className="grid grid-cols-3 gap-2">
          <div></div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => move("up")}
            disabled={gameOver}
            className="aspect-square bg-white hover:bg-blue-50 border-blue-300 text-blue-600"
          >
            ↑
          </Button>
          <div></div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => move("left")}
            disabled={gameOver}
            className="aspect-square bg-white hover:bg-blue-50 border-blue-300 text-blue-600"
          >
            ←
          </Button>
          <Button onClick={resetGame} className="aspect-square bg-blue-500 hover:bg-blue-600 text-white">
            🔄
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => move("right")}
            disabled={gameOver}
            className="aspect-square bg-white hover:bg-blue-50 border-blue-300 text-blue-600"
          >
            →
          </Button>

          <div></div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => move("down")}
            disabled={gameOver}
            className="aspect-square bg-white hover:bg-blue-50 border-blue-300 text-blue-600"
          >
            ↓
          </Button>
          <div></div>
        </div>

        <div className="text-center text-sm text-black">
          <p className="text-black">Use arrow keys or buttons to control</p>
          {gameOver && <p className="text-red-600 font-medium mt-2">Game Over! Press 🔄 for new game</p>}
          {gameWon && !gameOver && (
            <p className="text-green-600 font-medium mt-2">Congratulations! You reached 2048! 🎉</p>
          )}
        </div>
      </div>
    </div>
  )
}
