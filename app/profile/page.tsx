"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home, Trophy, Star, Lock, Gift, Coins, Target, Zap } from "lucide-react"
import { SpinningWheel } from "@/components/spinning-wheel"
import { WalletConnectPrompt } from "@/components/wallet-connect-prompt"
import { useWalletProfile } from "@/hooks/use-wallet-profile"

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  progress: number
  maxProgress: number
}

const achievements: Achievement[] = [
  {
    id: "plasma-rookie",
    name: "Plasma Rookie",
    description: "Complete your first quiz or game",
    icon: "🌟",
    unlocked: true,
    progress: 1,
    maxProgress: 1
  },
  {
    id: "plasma-voyager",
    name: "Plasma Voyager",
    description: "Complete 10 quizzes or games",
    icon: "🚀",
    unlocked: false,
    progress: 0,
    maxProgress: 10
  },
  {
    id: "plasma-master",
    name: "Plasma Master",
    description: "Complete 50 quizzes or games",
    icon: "👑",
    unlocked: false,
    progress: 0,
    maxProgress: 50
  },
  {
    id: "streak-champion",
    name: "Streak Champion",
    description: "Maintain a 7-day login streak",
    icon: "🔥",
    unlocked: false,
    progress: 0,
    maxProgress: 7
  },
  {
    id: "lhp-collector",
    name: "LHP Collector",
    description: "Earn 1000 Plasma LHP points",
    icon: "💎",
    unlocked: false,
    progress: 0,
    maxProgress: 1000
  },
  {
    id: "quiz-expert",
    name: "Quiz Expert",
    description: "Answer 100 quiz questions correctly",
    icon: "🧠",
    unlocked: false,
    progress: 0,
    maxProgress: 100
  }
]

export default function ProfilePage() {
  const {
    isConnected,
    walletAddress,
    profile,
    isLoading,
    error,
    connectWallet,
    updateProfile
  } = useWalletProfile()

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  // Show wallet connection prompt if not connected
  if (!isConnected) {
    return <WalletConnectPrompt onConnect={connectWallet} isLoading={isLoading} />
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="text-red-600 mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={connectWallet} className="bg-teal-600 hover:bg-teal-700 text-white">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Show profile if connected and loaded
  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile data...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-black text-teal-600">PLASMA</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
                <p className="text-sm text-gray-600">
                  {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
                </p>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent">
                <Home className="mr-2 w-4 h-4" />
                Back to Menu
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Stats & Daily Wheel */}
          <div className="lg:col-span-1 space-y-6">
            {/* LHP Points */}
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Coins className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-2">Plasma LHP</CardTitle>
                <div className="text-3xl font-bold text-teal-600 mb-2">{profile.lhpPoints.toLocaleString()}</div>
                <p className="text-sm text-gray-600">Learn Hub Points</p>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <CardTitle className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Target className="w-5 h-5 text-teal-600 mr-2" />
                  Statistics
                </CardTitle>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Games:</span>
                    <span className="font-semibold text-gray-900">{profile.totalGames}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Current Streak:</span>
                    <span className="font-semibold text-yellow-600">{profile.currentStreak} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Days:</span>
                    <span className="font-semibold text-gray-900">{profile.totalDays}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Daily Wheel */}
            <SpinningWheel 
              walletAddress={walletAddress}
              profile={profile}
              onUpdateProfile={updateProfile}
            />
          </div>

          {/* Right Column - Achievements & NFTs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Achievements */}
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <CardTitle className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Trophy className="w-6 h-6 text-yellow-600 mr-2" />
                  Achievements
                </CardTitle>
                <div className="grid md:grid-cols-2 gap-4">
                  {profile.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        achievement.unlocked
                          ? "border-green-200 bg-green-50"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center mb-3">
                        <div className="text-2xl mr-3">{achievement.icon}</div>
                        <div className="flex-1">
                          <h3 className={`font-semibold ${
                            achievement.unlocked ? "text-green-800" : "text-gray-600"
                          }`}>
                            {achievement.name}
                          </h3>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                        </div>
                        {achievement.unlocked ? (
                          <div className="text-green-600">
                            <Trophy className="w-5 h-5" />
                          </div>
                        ) : (
                          <div className="text-gray-400">
                            <Lock className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            achievement.unlocked ? "bg-green-500" : "bg-teal-500"
                          }`}
                          style={{
                            width: `${Math.min((achievement.progress / achievement.maxProgress) * 100, 100)}%`
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {achievement.progress} / {achievement.maxProgress}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* NFT Collection */}
            <Card className="bg-white border-gray-200 shadow-lg">
              <CardContent className="p-6">
                <CardTitle className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Star className="w-6 h-6 text-purple-600 mr-2" />
                  NFT Collection
                </CardTitle>
                <div className="grid md:grid-cols-3 gap-4">
                  {profile.achievements.filter(a => a.unlocked).map((achievement) => (
                    <div
                      key={achievement.id}
                      className="p-4 rounded-lg border-2 border-purple-200 bg-purple-50 text-center"
                    >
                      <div className="text-3xl mb-2">{achievement.icon}</div>
                      <h3 className="font-semibold text-purple-800 mb-1">{achievement.name}</h3>
                      <p className="text-xs text-purple-600">Achievement NFT</p>
                    </div>
                  ))}
                  {profile.achievements.filter(a => a.unlocked).length === 0 && (
                    <div className="col-span-3 text-center py-8">
                      <div className="text-4xl mb-4">🎯</div>
                      <p className="text-gray-600 mb-2">No NFTs yet</p>
                      <p className="text-sm text-gray-500">Complete achievements to earn NFT badges</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
