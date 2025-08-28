"use client"

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Trophy, Coins, Users, Calendar } from "lucide-react"

interface LeaderboardRewardsProps {
  prizePool: number
  totalParticipants: number
  endDate: string
}

export function LeaderboardRewards({ prizePool, totalParticipants, endDate }: LeaderboardRewardsProps) {
  const rewards = [
    { position: 1, percentage: 50, amount: prizePool * 0.5, color: "bg-yellow-500" },
    { position: 2, percentage: 25, amount: prizePool * 0.25, color: "bg-gray-400" },
    { position: 3, percentage: 15, amount: prizePool * 0.15, color: "bg-orange-600" },
    { position: 4, percentage: 7, amount: prizePool * 0.07, color: "bg-blue-500" },
    { position: 5, percentage: 3, amount: prizePool * 0.03, color: "bg-green-500" },
  ]

  return (
    <Card className="bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200 shadow-lg">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <CardTitle className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-yellow-600 mr-2" />
            Weekly Prize Pool
          </CardTitle>
          <div className="text-3xl font-bold text-teal-600 mb-2">{prizePool.toFixed(2)} XPL</div>
          <p className="text-gray-600">Funded by 10% of paid game entry fees</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Reward Distribution</h3>
            <div className="space-y-3">
              {rewards.map((reward) => (
                <div key={reward.position} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 ${reward.color} rounded-full flex items-center justify-center mr-3`}>
                      <span className="text-white font-bold text-sm">{reward.position}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{reward.percentage}%</div>
                      <div className="text-sm text-gray-600">{reward.amount.toFixed(2)} XPL</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Current Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-teal-600 mr-2" />
                  <span className="text-gray-700">Participants</span>
                </div>
                <span className="font-semibold text-gray-900">{totalParticipants}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-teal-600 mr-2" />
                  <span className="text-gray-700">Ends</span>
                </div>
                <span className="font-semibold text-gray-900">{endDate}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <Coins className="w-5 h-5 text-teal-600 mr-2" />
                  <span className="text-gray-700">Entry Fee</span>
                </div>
                <span className="font-semibold text-gray-900">0.001 XPL</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">How it works:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• 10% of all paid game entry fees go to the weekly prize pool</li>
            <li>• Winners are determined by highest scores at the end of each week</li>
            <li>• Rewards are automatically distributed to winners' wallets</li>
            <li>• New prize pool starts every Monday at 00:00 UTC</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
