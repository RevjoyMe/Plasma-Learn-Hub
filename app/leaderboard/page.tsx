"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Medal, Award, Home, Play, Gamepad2, Coins, Brain } from "lucide-react"
import Link from "next/link"
import { getLeaderboard, get2048Leaderboard, getXPLQuizLeaderboard } from "@/lib/leaderboard"

type GameType = "quiz" | "xpl-quiz" | "2048"

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<"global" | "weekly" | "daily">("global")
  const [activeGame, setActiveGame] = useState<GameType>("quiz")
  const [leaderboard, setLeaderboard] = useState<any[]>([])

  useEffect(() => {
    if (activeGame === "2048") {
      setLeaderboard(get2048Leaderboard(activeTab))
    } else if (activeGame === "xpl-quiz") {
      setLeaderboard(getXPLQuizLeaderboard(activeTab))
    } else {
      setLeaderboard(getLeaderboard(activeTab, activeGame))
    }
  }, [activeTab, activeGame])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <div className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">#{rank}</div>
    }
  }

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200"
      case 2:
        return "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200"
      case 3:
        return "bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200"
      default:
        return "bg-white border-gray-200"
    }
  }

  const getGameIcon = (game: GameType) => {
    switch (game) {
      case "quiz":
        return <Brain className="w-5 h-5" />
      case "xpl-quiz":
        return <Coins className="w-5 h-5" />
      case "2048":
        return <Gamepad2 className="w-5 h-5" />
    }
  }

  const getGameName = (game: GameType) => {
    switch (game) {
      case "quiz":
        return "StableCoin Quiz"
      case "xpl-quiz":
        return "XPL Quiz"
      case "2048":
        return "2048 Game"
    }
  }

  const getGameLink = (game: GameType) => {
    switch (game) {
      case "quiz":
        return "/nickname"
      case "xpl-quiz":
        return "/xpl-quiz/nickname"
      case "2048":
        return "/2048"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl font-black text-teal-600 mb-6">PLASMA</div>
          <h1 className="text-4xl font-black mb-4 text-gray-900">Leaderboards</h1>
          <p className="text-gray-600">See how you rank against other players</p>
        </div>

        {/* Game Selection */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg p-1 shadow-lg border border-gray-200">
            {(["quiz", "xpl-quiz", "2048"] as GameType[]).map((game) => (
              <Button
                key={game}
                onClick={() => setActiveGame(game)}
                variant={activeGame === game ? "default" : "ghost"}
                className={`px-4 py-2 flex items-center space-x-2 ${
                  activeGame === game ? "bg-teal-600 text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {getGameIcon(game)}
                <span className="hidden sm:inline">{getGameName(game)}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Time Period Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg border border-gray-200">
            {(["global", "weekly", "daily"] as const).map((tab) => (
              <Button
                key={tab}
                onClick={() => setActiveTab(tab)}
                variant={activeTab === tab ? "default" : "ghost"}
                className={`px-6 py-2 ${
                  activeTab === tab ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="max-w-4xl mx-auto">
          {leaderboard.length === 0 ? (
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-12 text-center">
                <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No entries yet</h3>
                <p className="text-gray-600 mb-6">
                  Be the first to appear on the {activeTab} {getGameName(activeGame)} leaderboard!
                </p>
                <Link href={getGameLink(activeGame)}>
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white">
                    <Play className="mr-2 w-4 h-4" />
                    Start Playing
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {leaderboard.map((entry, index) => (
                <Card key={index} className={`${getRankBg(index + 1)} shadow-lg hover:shadow-xl transition-shadow`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {getRankIcon(index + 1)}
                        <div>
                          <div className="text-xl font-bold text-gray-900">{entry.nickname}</div>
                          <div className="text-sm text-gray-600">
                            {entry.walletAddress && (
                              <div className="mb-1">
                                Wallet: {entry.walletAddress.slice(0, 6)}...{entry.walletAddress.slice(-4)}
                              </div>
                            )}
                            {activeGame === "2048" ? (
                              <div>
                                Max Tile: {entry.maxTile} • Games: {entry.gamesPlayed || 1}
                                {entry.timesReached2048 > 0 && ` • 2048 Reached: ${entry.timesReached2048}x`}
                              </div>
                            ) : activeGame === "xpl-quiz" ? (
                              <div>
                                Games: {entry.gamesPlayed || 1} • {entry.correctAnswers}/{entry.questionsAnswered}{" "}
                                correct • Streak: {entry.streak}
                              </div>
                            ) : (
                              <div>
                                {entry.correctAnswers}/{entry.questionsAnswered} correct • Streak: {entry.streak}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-teal-600">
                          {activeGame === "2048" ? entry.score?.toLocaleString() : entry.points}
                        </div>
                        <div className="text-sm text-gray-500">{activeGame === "2048" ? "score" : "points"}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="text-center mt-12 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={getGameLink(activeGame)}>
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700 text-white">
                <Play className="mr-2 w-5 h-5" />
                Play {getGameName(activeGame)}
              </Button>
            </Link>
            <Link href="/">
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
              >
                <Home className="mr-2 w-5 h-5" />
                Home
              </Button>
            </Link>
          </div>

          {activeGame !== "2048" && (
            <div className="text-sm text-gray-500 max-w-2xl mx-auto">
              <p className="mb-2">
                <strong>Scoring System:</strong>
              </p>
              <p>• Every 3 correct answers in a row = 1 point</p>
              <p>• Streak multiplier increases by 0.1x for each group of 3</p>
              <p>• Wrong answer resets your streak</p>
              {activeGame === "xpl-quiz" && (
                <p className="mt-2 text-teal-600">• XPL Quiz: Points accumulate across multiple paid games</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
