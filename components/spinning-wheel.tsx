"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gift, Clock, Star, Zap } from "lucide-react"

interface WheelReward {
  id: number
  name: string
  points: number
  color: string
  probability: number
}

const wheelRewards: WheelReward[] = [
  { id: 1, name: "10 LHP", points: 10, color: "bg-yellow-500", probability: 30 },
  { id: 2, name: "25 LHP", points: 25, color: "bg-green-500", probability: 25 },
  { id: 3, name: "50 LHP", points: 50, color: "bg-blue-500", probability: 20 },
  { id: 4, name: "100 LHP", points: 100, color: "bg-purple-500", probability: 15 },
  { id: 5, name: "200 LHP", points: 200, color: "bg-red-500", probability: 8 },
  { id: 6, name: "500 LHP", points: 500, color: "bg-teal-500", probability: 2 },
]

export function SpinningWheel() {
  const [isSpinning, setIsSpinning] = useState(false)
  const [canSpin, setCanSpin] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [lastSpinTime, setLastSpinTime] = useState<number | null>(null)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [totalDays, setTotalDays] = useState(0)
  const [showReward, setShowReward] = useState(false)
  const [wonReward, setWonReward] = useState<WheelReward | null>(null)

  useEffect(() => {
    // Load user data from localStorage
    const lastSpin = localStorage.getItem("lastSpinTime")
    const streak = localStorage.getItem("currentStreak") || "0"
    const total = localStorage.getItem("totalDays") || "0"
    const lhpPoints = localStorage.getItem("lhpPoints") || "0"

    setCurrentStreak(parseInt(streak))
    setTotalDays(parseInt(total))

    if (lastSpin) {
      const lastSpinTime = parseInt(lastSpin)
      setLastSpinTime(lastSpinTime)
      
      const now = Date.now()
      const timeSinceLastSpin = now - lastSpinTime
      const cooldownTime = 24 * 60 * 60 * 1000 // 24 hours
      
      if (timeSinceLastSpin >= cooldownTime) {
        setCanSpin(true)
        setTimeLeft(0)
      } else {
        setTimeLeft(Math.floor((cooldownTime - timeSinceLastSpin) / 1000))
      }
    } else {
      setCanSpin(true)
    }
  }, [])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setCanSpin(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const spinWheel = () => {
    if (!canSpin || isSpinning) return

    setIsSpinning(true)
    
    // Simulate spinning animation
    setTimeout(() => {
      // Determine reward based on probability
      const random = Math.random() * 100
      let cumulativeProbability = 0
      let selectedReward = wheelRewards[0]

      for (const reward of wheelRewards) {
        cumulativeProbability += reward.probability
        if (random <= cumulativeProbability) {
          selectedReward = reward
          break
        }
      }

      setWonReward(selectedReward)
      setShowReward(true)

      // Update user data
      const now = Date.now()
      const currentLhp = parseInt(localStorage.getItem("lhpPoints") || "0")
      const newLhp = currentLhp + selectedReward.points
      
      localStorage.setItem("lastSpinTime", now.toString())
      localStorage.setItem("lhpPoints", newLhp.toString())
      
      // Update streak
      const newStreak = currentStreak + 1
      const newTotalDays = totalDays + 1
      
      localStorage.setItem("currentStreak", newStreak.toString())
      localStorage.setItem("totalDays", newTotalDays.toString())
      
      setCurrentStreak(newStreak)
      setTotalDays(newTotalDays)
      setLastSpinTime(now)
      setCanSpin(false)
      setTimeLeft(24 * 60 * 60) // 24 hours
      setIsSpinning(false)
    }, 3000)
  }

  const closeReward = () => {
    setShowReward(false)
    setWonReward(null)
  }

  return (
    <Card className="bg-white border-gray-200 shadow-lg">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <CardTitle className="text-xl font-bold text-gray-900 mb-2 flex items-center justify-center">
            <Gift className="w-5 h-5 text-teal-600 mr-2" />
            Daily Reward Wheel
          </CardTitle>
          
          <div className="flex justify-center gap-6 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-teal-600">{totalDays}</div>
              <div className="text-sm text-gray-600">Total Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{currentStreak}</div>
              <div className="text-sm text-gray-600">Current Streak</div>
            </div>
          </div>
        </div>

        {/* Wheel */}
        <div className="relative w-64 h-64 mx-auto mb-6">
          <div className="w-full h-full rounded-full border-4 border-gray-300 relative overflow-hidden">
            {wheelRewards.map((reward, index) => {
              const angle = (360 / wheelRewards.length) * index
              const isSpinningClass = isSpinning ? "animate-spin" : ""
              
              return (
                <div
                  key={reward.id}
                  className={`absolute w-1/2 h-1/2 origin-bottom-right ${reward.color} ${isSpinningClass}`}
                  style={{
                    transform: `rotate(${angle}deg)`,
                    transformOrigin: "bottom right",
                  }}
                >
                  <div className="absolute top-2 left-2 text-white text-xs font-bold">
                    {reward.name}
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Center pointer */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-gray-400 rounded-full z-10"></div>
        </div>

        {/* Controls */}
        <div className="text-center">
          {canSpin ? (
            <Button
              onClick={spinWheel}
              disabled={isSpinning}
              className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold"
            >
              {isSpinning ? (
                <>
                  <Zap className="w-5 h-5 mr-2 animate-spin" />
                  Spinning...
                </>
              ) : (
                <>
                  <Gift className="w-5 h-5 mr-2" />
                  Spin & Claim
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-center text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                Next spin in: {formatTime(timeLeft)}
              </div>
              <Button disabled className="bg-gray-300 text-gray-500 px-8 py-3 text-lg font-semibold">
                <Clock className="w-5 h-5 mr-2" />
                Come Back Later
              </Button>
            </div>
          )}
        </div>

        {/* Reward Modal */}
        {showReward && wonReward && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="max-w-md mx-4 bg-white border-gray-200 shadow-xl">
              <CardContent className="p-8 text-center">
                <div className={`w-16 h-16 ${wonReward.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Congratulations!</h3>
                <p className="text-lg text-gray-700 mb-4">
                  You won <strong className="text-teal-600">{wonReward.name}</strong>!
                </p>
                <p className="text-sm text-gray-600 mb-6">
                  Your streak: {currentStreak} days
                </p>
                <Button
                  onClick={closeReward}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3"
                >
                  Claim Reward
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
