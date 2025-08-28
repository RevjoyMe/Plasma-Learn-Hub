"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, RotateCcw, Share2, Home, Users } from "lucide-react"
import Link from "next/link"
import { addToLeaderboard } from "@/lib/leaderboard"
import { useBlockchain } from "@/hooks/use-blockchain"

interface GameResults {
  nickname: string
  points: number
  streak: number
  questionsAnswered: number
  correctAnswers: number
  gameType?: string
}

export default function ResultsPage() {
  const [results, setResults] = useState<GameResults | null>(null)
  const { walletState } = useBlockchain()

  useEffect(() => {
    const savedResults = localStorage.getItem("lastGameResults")
    if (savedResults) {
      const parsedResults = JSON.parse(savedResults)
      setResults(parsedResults)

      if (parsedResults.gameType === "xpl-quiz" && walletState.address) {
        const existingEntries = JSON.parse(localStorage.getItem("leaderboard_xpl-quiz_global") || "[]")
        const existingPlayerIndex = existingEntries.findIndex(
          (entry: any) => entry.walletAddress === walletState.address,
        )

        if (existingPlayerIndex >= 0) {
          existingEntries[existingPlayerIndex].points += parsedResults.points
          existingEntries[existingPlayerIndex].gamesPlayed += 1
          existingEntries[existingPlayerIndex].timestamp = Date.now()
          existingEntries[existingPlayerIndex].date = new Date().toISOString().split("T")[0]

          const types = ["global", "weekly", "daily"]
          types.forEach((type) => {
            const key = `leaderboard_xpl-quiz_${type}`
            const entries = JSON.parse(localStorage.getItem(key) || "[]")
            const playerIndex = entries.findIndex((entry: any) => entry.walletAddress === walletState.address)
            if (playerIndex >= 0) {
              entries[playerIndex] = existingEntries[existingPlayerIndex]
              localStorage.setItem(key, JSON.stringify(entries))
            }
          })
        } else {
          const leaderboardEntry = {
            nickname: parsedResults.nickname,
            points: parsedResults.points,
            streak: parsedResults.streak,
            questionsAnswered: parsedResults.questionsAnswered,
            correctAnswers: parsedResults.correctAnswers,
            gameType: "xpl-quiz",
            walletAddress: walletState.address,
            gamesPlayed: 1,
          }
          addToLeaderboard(leaderboardEntry)
        }
      } else if (parsedResults.gameType !== "xpl-quiz") {
        addToLeaderboard(parsedResults)
      }
    }
  }, [walletState.address])

  const getScoreMessage = (points: number) => {
    if (points >= 10) return { message: "Stablecoin Master! 🏆", color: "text-yellow-600" }
    if (points >= 5) return { message: "DeFi Expert! 🚀", color: "text-teal-600" }
    if (points >= 2) return { message: "Crypto Enthusiast! 💪", color: "text-blue-600" }
    if (points >= 1) return { message: "Getting Started! 📚", color: "text-purple-600" }
    return { message: "Keep Learning! 🎯", color: "text-gray-600" }
  }

  const handleShare = () => {
    if (!results) return

    const text = `I just scored ${results.points} points on the StableCoin Quiz with a ${results.streak} streak! 🎯 Test your crypto knowledge too!`

    if (navigator.share) {
      navigator.share({
        title: "StableCoin Quiz Results",
        text: text,
        url: window.location.origin,
      })
    } else {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.origin)}`
      window.open(twitterUrl, "_blank")
    }
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No results found</p>
          <Link href="/">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">Go Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const scoreMessage = getScoreMessage(results.points)
  const accuracy =
    results.questionsAnswered > 0 ? Math.round((results.correctAnswers / results.questionsAnswered) * 100) : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="text-4xl font-black text-teal-600 text-center mb-6">PLASMA</div>
          </div>

          <div className="mb-8">
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 rounded-full w-fit mx-auto mb-6">
              <Trophy className="w-16 h-16 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">Great Job, {results.nickname}!</h1>
          </div>

          <Card className="bg-white border-gray-200 shadow-xl mb-8">
            <CardContent className="p-8">
              <div className="mb-6">
                <div className="text-6xl md:text-8xl font-black mb-2 text-teal-600">{results.points}</div>
                <div className="text-xl md:text-2xl font-bold mb-4 text-gray-900">Points Earned</div>
                <div className={`text-2xl font-bold ${scoreMessage.color}`}>{scoreMessage.message}</div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{results.correctAnswers}</div>
                  <div className="text-sm text-gray-500">Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {results.questionsAnswered - results.correctAnswers}
                  </div>
                  <div className="text-sm text-gray-500">Incorrect</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{results.streak}</div>
                  <div className="text-sm text-gray-500">Best Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{accuracy}%</div>
                  <div className="text-sm text-gray-500">Accuracy</div>
                </div>
              </div>

              <div className="text-gray-600 mb-6 text-lg">
                {results.points >= 5
                  ? "Excellent work! You have a solid understanding of stablecoins and DeFi protocols."
                  : results.points >= 2
                    ? "Good job! Keep exploring the world of stablecoins to improve your knowledge."
                    : "Great start! There's so much to learn about stablecoins and DeFi. Keep going!"}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/nickname">
                <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white w-full sm:w-auto px-8 py-3">
                  <RotateCcw className="mr-2 w-5 h-5" />
                  Play Again
                </Button>
              </Link>

              <Link href="/leaderboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-teal-600 text-teal-600 hover:bg-teal-50 w-full sm:w-auto px-8 py-3 bg-transparent"
                >
                  <Users className="mr-2 w-5 h-5" />
                  View Leaderboard
                </Button>
              </Link>

              <Button
                size="lg"
                variant="outline"
                onClick={handleShare}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full sm:w-auto px-8 py-3 bg-transparent"
              >
                <Share2 className="mr-2 w-5 h-5" />
                Share Score
              </Button>
            </div>

            <Link href="/">
              <Button variant="ghost" className="text-gray-500 hover:text-gray-700">
                <Home className="mr-2 w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
