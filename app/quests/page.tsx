"use client"

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home, Target, Trophy, Zap } from "lucide-react"

export default function QuestsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Target className="w-12 h-12 text-teal-600 mr-4" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Plasma Quests</h1>
              <p className="text-xl text-gray-600">Adventure awaits on the blockchain</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-yellow-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-4">Daily Challenges</CardTitle>
              <p className="text-gray-600 mb-6">
                Complete daily tasks to earn Plasma LHP points and unlock exclusive rewards.
              </p>
              <div className="text-sm text-gray-500">
                <p>• Solve puzzles and quizzes</p>
                <p>• Complete blockchain transactions</p>
                <p>• Earn achievement badges</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-4">Seasonal Campaigns</CardTitle>
              <p className="text-gray-600 mb-6">
                Participate in themed campaigns with special rewards and community challenges.
              </p>
              <div className="text-sm text-gray-500">
                <p>• Limited-time events</p>
                <p>• Community competitions</p>
                <p>• Exclusive NFT rewards</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-10 h-10 text-teal-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Coming Soon!</h2>
            <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
              Plasma Quests are currently under development and will be launched once the Plasma network mainnet is live. 
              Get ready for an exciting journey of learning, earning, and community building!
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/">
                <Button className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3">
                  <Home className="mr-2 w-4 h-4" />
                  Back to Menu
                </Button>
              </Link>
              <Link href="/profile">
                <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                  View Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
