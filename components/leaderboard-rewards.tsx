"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Trophy, Coins, Users, Calendar, RefreshCw } from "lucide-react"
import { getCachedPrizePool, PrizePoolData, getPreviousWeekData, PreviousWeekData } from "@/lib/prize-pool-calculator"

interface LeaderboardRewardsProps {
  prizePool?: number
  totalParticipants?: number
  endDate?: string
}

export function LeaderboardRewards({ 
  prizePool: fallbackPrizePool = 0.85, 
  totalParticipants: fallbackParticipants = 850, 
  endDate: fallbackEndDate = "Monday at 00:00 UTC" 
}: LeaderboardRewardsProps) {
  const [prizePoolData, setPrizePoolData] = useState<PrizePoolData | null>(null)
  const [previousWeekData, setPreviousWeekData] = useState<PreviousWeekData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  useEffect(() => {
    loadPrizePoolData()
  }, [])

  const loadPrizePoolData = async () => {
    try {
      setIsLoading(true)
      const [data, previousData] = await Promise.all([
        getCachedPrizePool(),
        getPreviousWeekData()
      ])
      setPrizePoolData(data)
      setPreviousWeekData(previousData)
      setLastUpdated(data.lastUpdated)
    } catch (error) {
      console.error("Failed to load prize pool data:", error)
      // Use fallback data
      setPrizePoolData({
        totalPool: fallbackPrizePool,
        participants: fallbackParticipants,
        endDate: fallbackEndDate,
        rewards: [
          { position: 1, percentage: 50, amount: fallbackPrizePool * 0.5, color: "bg-yellow-500" },
          { position: 2, percentage: 25, amount: fallbackPrizePool * 0.25, color: "bg-gray-400" },
          { position: 3, percentage: 15, amount: fallbackPrizePool * 0.15, color: "bg-orange-600" },
          { position: 4, percentage: 7, amount: fallbackPrizePool * 0.07, color: "bg-blue-500" },
          { position: 5, percentage: 3, amount: fallbackPrizePool * 0.03, color: "bg-green-500" },
        ],
        lastUpdated: new Date()
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = () => {
    loadPrizePoolData()
  }

  // Use dynamic data if available, otherwise use fallback
  const currentPrizePool = prizePoolData?.totalPool ?? fallbackPrizePool
  const currentParticipants = prizePoolData?.participants ?? fallbackParticipants
  const currentEndDate = prizePoolData?.endDate ?? fallbackEndDate
  const rewards = prizePoolData?.rewards ?? [
    { position: 1, percentage: 50, amount: fallbackPrizePool * 0.5, color: "bg-yellow-500" },
    { position: 2, percentage: 25, amount: fallbackPrizePool * 0.25, color: "bg-gray-400" },
    { position: 3, percentage: 15, amount: fallbackPrizePool * 0.15, color: "bg-orange-600" },
    { position: 4, percentage: 7, amount: fallbackPrizePool * 0.07, color: "bg-blue-500" },
    { position: 5, percentage: 3, amount: fallbackPrizePool * 0.03, color: "bg-green-500" },
  ]

  return (
    <div className="space-y-6">
      {/* Current Week Prize Pool */}
      <Card className="bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200 shadow-lg">
        <CardContent className="p-4">
          {/* Header with Prize Pool */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="w-5 h-5 text-yellow-600 mr-2" />
              <CardTitle className="text-xl font-bold text-gray-900">Weekly Prize Pool</CardTitle>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="ml-2 p-1 rounded-full hover:bg-teal-100 transition-colors"
                title="Refresh data"
              >
                <RefreshCw className={`w-4 h-4 text-teal-600 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="text-2xl font-bold text-teal-600 mb-1">
              {isLoading ? '...' : `${currentPrizePool.toFixed(3)} XPL`}
            </div>
            <p className="text-sm text-gray-600">Funded by 10% of paid game entry fees</p>
            {lastUpdated && (
              <p className="text-xs text-gray-500 mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-yellow-800 font-medium">
              ⚠️ Rewards are only paid for participation in XPL Stablecoin Quiz
            </p>
          </div>

        {/* Compact Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-2 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-center mb-1">
              <Users className="w-4 h-4 text-teal-600 mr-1" />
              <span className="text-xs text-gray-600">Participants</span>
            </div>
            <div className="font-semibold text-gray-900">{currentParticipants}</div>
          </div>
          
          <div className="text-center p-2 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="w-4 h-4 text-teal-600 mr-1" />
              <span className="text-xs text-gray-600">Ends</span>
            </div>
            <div className="font-semibold text-gray-900 text-sm">{currentEndDate.split(' ')[0]}</div>
          </div>
          
          <div className="text-center p-2 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-center mb-1">
              <Coins className="w-4 h-4 text-teal-600 mr-1" />
              <span className="text-xs text-gray-600">Entry Fee</span>
            </div>
            <div className="font-semibold text-gray-900">0.001 XPL</div>
          </div>
        </div>

        {/* Streamlined Reward Distribution */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">Reward Distribution</h3>
          <div className="grid grid-cols-5 gap-2">
            {rewards.map((reward) => (
              <div key={reward.position} className="text-center p-2 bg-white rounded-lg border border-gray-200">
                <div className={`w-6 h-6 ${reward.color} rounded-full flex items-center justify-center mx-auto mb-1`}>
                  <span className="text-white font-bold text-xs">{reward.position}</span>
                </div>
                <div className="text-xs font-semibold text-gray-900">{reward.percentage}%</div>
                <div className="text-xs text-gray-600">{reward.amount.toFixed(3)} XPL</div>
              </div>
            ))}
          </div>
        </div>

        {/* Compact How it works */}
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">How it works:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• 10% of all paid game entry fees go to the weekly prize pool</li>
            <li>• Winners are determined by highest scores at the end of each week</li>
            <li>• Rewards are automatically distributed to winners' wallets</li>
            <li>• New prize pool starts every Monday at 00:00 UTC</li>
          </ul>
        </div>
      </CardContent>
    </Card>

    {/* Previous Week Prize Pool */}
    {previousWeekData && (
      <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 shadow-lg">
        <CardContent className="p-4">
          <div className="text-center mb-4">
            <CardTitle className="text-lg font-bold text-gray-900 mb-2">Previous Weekly Prize Pool</CardTitle>
            <div className="text-xl font-bold text-gray-700 mb-1">
              {previousWeekData.totalPool.toFixed(3)} XPL Distributed
            </div>
            <p className="text-sm text-gray-600">
              {previousWeekData.weekStart} - {previousWeekData.weekEnd}
            </p>
          </div>

          {/* Previous Week Winners */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Winners</h3>
            <div className="space-y-2">
              {previousWeekData.winners.map((winner) => (
                <div key={winner.position} className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                      winner.position === 1 ? 'bg-yellow-500' :
                      winner.position === 2 ? 'bg-gray-400' :
                      winner.position === 3 ? 'bg-orange-600' :
                      winner.position === 4 ? 'bg-blue-500' : 'bg-green-500'
                    }`}>
                      <span className="text-white font-bold text-xs">{winner.position}</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {winner.nickname || `${winner.walletAddress.slice(0, 6)}...${winner.walletAddress.slice(-4)}`}
                      </div>
                      <div className="text-xs text-gray-600">{winner.amount.toFixed(3)} XPL</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center text-xs text-gray-500">
            {previousWeekData.participants} participants competed
          </div>
        </CardContent>
      </Card>
    )}
  </div>
  )
}
