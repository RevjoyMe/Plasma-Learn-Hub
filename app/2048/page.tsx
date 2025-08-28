"use client"

import { useEffect, useState } from "react"
import { useGame2048, type Direction } from "@/hooks/use-game-2048"
import { useBlockchain } from "@/hooks/use-blockchain"
import { GameBoard } from "@/components/game-board"
import { ScoreBoard } from "@/components/score-board"
import { WalletConnection } from "@/components/wallet-connection"
import { PlayerStats } from "@/components/player-stats"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Gamepad2, Coins, Home } from "lucide-react"
import Link from "next/link"
import { addTo2048Leaderboard } from "@/lib/leaderboard"

// Contract address - should be set via environment variable in production
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0xB9C509d0aA9ca8B083E73531Ab06Fb81B26DC918"

export default function Game2048Page() {
  const { gameState, move, startNewGame, endGame } = useGame2048()
  const { walletState, playerStats, gamePrice, connectWallet, purchaseGame, completeGame, refreshBalance } =
    useBlockchain(CONTRACT_ADDRESS)

  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [showGameOverModal, setShowGameOverModal] = useState(false)
  const [showWinModal, setShowWinModal] = useState(false)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameState.isGameActive) return

      const keyMap: Record<string, Direction> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
      }

      const direction = keyMap[e.key]
      if (direction) {
        e.preventDefault()
        move(direction)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [gameState.isGameActive, move])

  useEffect(() => {
    let startX: number, startY: number

    const handleTouchStart = (e: TouchEvent) => {
      if (!gameState.isGameActive) return
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (!gameState.isGameActive || !startX || !startY) return

      const endX = e.changedTouches[0].clientX
      const endY = e.changedTouches[0].clientY

      const diffX = startX - endX
      const diffY = startY - endY

      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) move("left")
        else move("right")
      } else {
        if (diffY > 0) move("up")
        else move("down")
      }
    }

    document.addEventListener("touchstart", handleTouchStart)
    document.addEventListener("touchend", handleTouchEnd)

    return () => {
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [gameState.isGameActive, move])

  useEffect(() => {
    if (gameState.isGameOver && gameState.isGameActive === false) {
      setShowGameOverModal(true)
    }
  }, [gameState.isGameOver, gameState.isGameActive])

  useEffect(() => {
    if (gameState.hasWon) {
      setShowWinModal(true)
    }
  }, [gameState.hasWon])

  const handlePurchaseGame = async () => {
    if (!walletState.isConnected) {
      await connectWallet()
      return
    }

    setShowPurchaseModal(true)
  }

  const confirmPurchase = async () => {
    setIsPurchasing(true)
    try {
      const gameId = await purchaseGame()
      startNewGame(gameId)
      setShowPurchaseModal(false)
    } catch (error) {
      console.error("Purchase failed:", error)
      alert(error instanceof Error ? error.message : "Failed to purchase game")
    } finally {
      setIsPurchasing(false)
    }
  }

  const handleCompleteGame = async () => {
    if (!gameState.gameId || !walletState.isConnected) return

    setIsCompleting(true)
    try {
      if (walletState.address) {
        const existingEntries = JSON.parse(localStorage.getItem("leaderboard_2048_global") || "[]")
        const existingPlayerIndex = existingEntries.findIndex(
          (entry: any) => entry.walletAddress === walletState.address,
        )

        const timesReached2048 = gameState.maxTile >= 2048 ? 1 : 0

        if (existingPlayerIndex >= 0) {
          existingEntries[existingPlayerIndex].score = Math.max(
            existingEntries[existingPlayerIndex].score,
            gameState.score,
          )
          existingEntries[existingPlayerIndex].gamesPlayed += 1
          existingEntries[existingPlayerIndex].timesReached2048 += timesReached2048
          existingEntries[existingPlayerIndex].timestamp = Date.now()
          existingEntries[existingPlayerIndex].date = new Date().toISOString().split("T")[0]

          const types = ["global", "weekly", "daily"]
          types.forEach((type) => {
            const key = `leaderboard_2048_${type}`
            const entries = JSON.parse(localStorage.getItem(key) || "[]")
            const playerIndex = entries.findIndex((entry: any) => entry.walletAddress === walletState.address)
            if (playerIndex >= 0) {
              entries[playerIndex] = existingEntries[existingPlayerIndex]
              localStorage.setItem(key, JSON.stringify(entries))
            }
          })
        } else {
          addTo2048Leaderboard({
            nickname: `Player ${walletState.address.slice(0, 6)}`,
            score: gameState.score,
            maxTile: gameState.maxTile,
            walletAddress: walletState.address,
            gamesPlayed: 1,
            timesReached2048: timesReached2048,
          })
        }
      }

      try {
        await completeGame(gameState.gameId, gameState.score, gameState.maxTile)
      } catch (blockchainError) {
        console.warn("Blockchain completion failed, but local save succeeded:", blockchainError)
      }

      alert("Game completed successfully! Your score has been saved to the leaderboard.")
    } catch (error) {
      console.error("Complete game failed:", error)
      alert("Game completed locally, but blockchain save failed. Score is still recorded!")
    } finally {
      setIsCompleting(false)
    }
  }

  const handleSaveAndClose = async () => {
    await handleCompleteGame()
    setShowGameOverModal(false)
    setShowWinModal(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-black text-teal-600">PLASMA</div>
              <h1 className="text-2xl font-bold text-gray-900">2048 Game</h1>
            </div>
            <Link href="/">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent">
                <Home className="mr-2 w-4 h-4" />
                Back to Menu
              </Button>
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {!gameState.isGameActive && (
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center mb-4">
                    <Gamepad2 className="w-12 h-12 text-teal-600 mr-4" />
                    <div>
                      <div className="text-2xl font-bold text-gray-900">2048 Game</div>
                      <div className="text-gray-600">Blockchain-powered puzzle game</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-xl font-bold text-teal-600">Merge Tiles</div>
                      <div className="text-sm text-gray-500">Reach 2048</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-yellow-600">{gamePrice}</div>
                      <div className="text-sm text-gray-500">Price per Game</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-purple-600">Blockchain</div>
                      <div className="text-sm text-gray-500">Verified Scores</div>
                    </div>
                  </div>
                </div>

                <WalletConnection
                  isConnected={walletState.isConnected}
                  address={walletState.address}
                  balance={walletState.balance}
                  isConnecting={walletState.isConnecting}
                  error={walletState.error}
                  onConnect={connectWallet}
                  onRefreshBalance={refreshBalance}
                  gameType="2048"
                  price={gamePrice}
                  onPayment={handlePurchaseGame}
                />
              </CardContent>
            </Card>
          )}

          {walletState.isConnected && gameState.isGameActive && (
            <div className="text-center mb-3">
              <p className="text-sm text-gray-500 font-medium">🎮 Game in progress...</p>
            </div>
          )}

          {gameState.isGameActive && (
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-4">
                <ScoreBoard score={gameState.score} bestScore={gameState.bestScore} maxTile={gameState.maxTile} />
              </CardContent>
            </Card>
          )}

          {gameState.isGameActive && (
            <div className="flex justify-center gap-4">
              <Button
                onClick={handlePurchaseGame}
                disabled={gameState.isGameActive}
                className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 text-lg font-semibold"
              >
                <Coins className="w-5 h-5 mr-2" />
                Buy New Game ({gamePrice})
              </Button>

              {gameState.gameId && (
                <Button
                  onClick={handleCompleteGame}
                  disabled={isCompleting}
                  variant="outline"
                  className="border-teal-600 text-teal-600 hover:bg-teal-50 px-6 py-3 text-lg font-semibold bg-transparent"
                >
                  <Gamepad2 className="w-5 h-5 mr-2" />
                  {isCompleting ? "Completing..." : "Complete Game"}
                </Button>
              )}
            </div>
          )}

          {gameState.isGameActive && (
            <div className="flex justify-center">
              <Card className="bg-white border-gray-200 shadow-lg">
                <CardContent className="p-6">
                  <GameBoard board={gameState.board} />
                </CardContent>
              </Card>
            </div>
          )}

          {gameState.gameId && (
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-4 text-center">
                <p className="text-gray-600">
                  <strong>Current Game ID:</strong> {gameState.gameId}
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">How to Play</h3>
              <div className="space-y-2 text-gray-600">
                <p>
                  <strong>Desktop:</strong> Use arrow keys to move tiles
                </p>
                <p>
                  <strong>Mobile:</strong> Swipe in any direction to move tiles
                </p>
                <p>When two tiles with the same number touch, they merge into one!</p>
                <p className="text-teal-600 font-semibold">
                  Purchase games with XPL tokens and record your high scores on the blockchain!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showPurchaseModal} onOpenChange={setShowPurchaseModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Purchase New Game</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-lg">
                Cost: <strong>{gamePrice}</strong>
              </p>
              <p className="text-sm text-muted-foreground">Your balance: {walletState.balance}</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={confirmPurchase}
                disabled={isPurchasing}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                {isPurchasing ? "Purchasing..." : "Confirm Purchase"}
              </Button>
              <Button
                onClick={() => setShowPurchaseModal(false)}
                variant="outline"
                className="flex-1"
                disabled={isPurchasing}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showGameOverModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-md mx-4 bg-white border-gray-200 shadow-xl">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Game Over!</h2>
              <div className="space-y-2 mb-6">
                <p className="text-lg text-gray-700">
                  Final Score: <strong className="text-teal-600">{gameState.score.toLocaleString()}</strong>
                </p>
                <p className="text-lg text-gray-700">
                  Max Tile: <strong className="text-teal-600">{gameState.maxTile}</strong>
                </p>
                {gameState.gameId && <p className="text-sm text-gray-500">Game ID: {gameState.gameId}</p>}
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowGameOverModal(false)
                    handlePurchaseGame()
                  }}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                >
                  Play Again
                </Button>
                <Button
                  onClick={handleSaveAndClose}
                  disabled={isCompleting}
                  variant="outline"
                  className="flex-1 border-teal-600 text-teal-600 hover:bg-teal-50 bg-transparent"
                >
                  {isCompleting ? "Saving..." : "Save & Close"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showWinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-md mx-4 bg-white border-gray-200 shadow-xl">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold text-yellow-600 mb-4">You Win!</h2>
              <p className="text-lg text-gray-700 mb-6">
                You reached the 2048 tile! Keep playing to get an even higher score.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowWinModal(false)
                    startNewGame(gameState.gameId || undefined)
                  }}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                >
                  Continue Playing
                </Button>
                <Button
                  onClick={handleSaveAndClose}
                  disabled={isCompleting}
                  variant="outline"
                  className="flex-1 border-teal-600 text-teal-600 hover:bg-teal-50 bg-transparent"
                >
                  {isCompleting ? "Saving..." : "Save & Close"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
