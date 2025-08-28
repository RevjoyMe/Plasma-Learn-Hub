"use client"

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { DailyQuiz } from "@/components/daily-quiz"

export default function Home() {

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Plasma Learn Hub</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A high-performance gaming platform built for stablecoins. Learn about cryptocurrency while having fun with
            blockchain-powered games.
          </p>
          <div className="mt-6">
            <Link
              href="https://discord.com/invite/plasmafdn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              <span>💬</span>
              <span>Join Plasma Discord Community</span>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Quiz Card */}
          <Link href="/nickname">
            <Card
              className="cursor-pointer hover:shadow-xl transition-all duration-300 border-0 overflow-hidden group"
            >
            <div className="bg-emerald-500 p-6 text-white">
              <CardTitle className="flex items-center gap-3 text-2xl font-bold">
                <span className="text-3xl">📚</span>
                Stablecoin Quiz
              </CardTitle>
            </div>
            <CardContent className="p-6 bg-white">
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                Test your knowledge about stablecoins with comprehensive questions.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-semibold text-blue-600">FREE!</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Questions:</span>
                  <span className="font-semibold">Unlimited</span>
                </div>
              </div>
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3">
                Start Learning
              </Button>
            </CardContent>
            </Card>
          </Link>

          <Link href="/xpl-quiz/nickname">
            <Card
              className="cursor-pointer hover:shadow-xl transition-all duration-300 border-0 overflow-hidden group"
            >
            <div className="bg-yellow-500 p-6 text-white">
              <CardTitle className="flex items-center gap-3 text-2xl font-bold">
                <span className="text-3xl">📚</span>
                XPL Stablecoin Quiz
              </CardTitle>
            </div>
            <CardContent className="p-6 bg-white">
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                Premium quiz with 20 random questions. Test your expertise!
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-semibold text-yellow-600">0.001 XPL</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Questions:</span>
                  <span className="font-semibold">20 Random</span>
                </div>
              </div>
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3">
                Premium Quiz
              </Button>
            </CardContent>
            </Card>
          </Link>

          {/* 2048 Game Card */}
          <Link href="/2048">
            <Card
              className="cursor-pointer hover:shadow-xl transition-all duration-300 border-0 overflow-hidden group"
            >
            <div className="bg-blue-500 p-6 text-white">
              <CardTitle className="flex items-center gap-3 text-2xl font-bold">
                <span className="text-3xl">🎮</span>
                2048 Game
              </CardTitle>
            </div>
            <CardContent className="p-6 bg-white">
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                Classic 2048 puzzle game with blockchain integration. Combine tiles to reach 2048!
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-semibold text-blue-600">0.001 XPL</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-semibold">Puzzle Game</span>
                </div>
              </div>
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3">Play Game</Button>
            </CardContent>
            </Card>
          </Link>
        </div>

        <div className="text-center mb-12">
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/leaderboard">
              <Button
                size="lg"
                variant="outline"
                className="border-teal-600 text-teal-600 hover:bg-teal-50 bg-transparent px-8 py-3"
              >
                🏆 View Leaderboards
              </Button>
            </Link>
            <Link href="/profile">
              <Button
                size="lg"
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-50 bg-transparent px-8 py-3"
              >
                👤 My Profile
              </Button>
            </Link>
            <Link href="/quests">
              <Button
                size="lg"
                variant="outline"
                className="border-yellow-600 text-yellow-600 hover:bg-yellow-50 bg-transparent px-8 py-3"
              >
                🎯 Quests
              </Button>
            </Link>
            <Link href="/partnerships">
              <Button
                size="lg"
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent px-8 py-3"
              >
                🤝 Partnerships
              </Button>
            </Link>
          </div>
        </div>

        {/* Daily Quiz Section */}
        <div className="mb-12">
          <DailyQuiz
            question="What is the primary purpose of a stablecoin?"
            options={[
              "To provide high volatility for trading profits",
              "To maintain a stable value relative to a specific asset or basket of assets",
              "To replace traditional fiat currencies completely",
              "To offer the highest possible returns on investment"
            ]}
            correctAnswer="To maintain a stable value relative to a specific asset or basket of assets"
            explanation="Stablecoins are designed to maintain a stable value relative to a specific asset (like USD) or basket of assets, providing price stability in the volatile cryptocurrency market."
            walletAddress={null}
            onUpdateProfile={() => {}}
            profile={null}
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-orange-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-xl">🔗</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Blockchain Powered</h3>
            <p className="text-gray-600 text-sm">Secure payments with XPL tokens on Plasma Network</p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-purple-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-xl">🎓</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Educational</h3>
            <p className="text-gray-600 text-sm">Learn about stablecoins and cryptocurrency</p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-red-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-white text-xl">⚡</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Fast & Secure</h3>
            <p className="text-gray-600 text-sm">High-performance gaming with secure transactions</p>
          </div>
        </div>
      </div>
    </div>
  )
}
