"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Clock, Star } from "lucide-react"

interface DailyQuizProps {
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
  walletAddress?: string | null
  onUpdateProfile?: (updates: any) => void
  profile?: any
}

export function DailyQuiz({ question, options, correctAnswer, explanation, walletAddress, onUpdateProfile, profile }: DailyQuizProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isAnswered, setIsAnswered] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)

  // Check if user has already answered today's quiz
  useEffect(() => {
    if (!profile || !walletAddress) return

    const today = new Date().toDateString()
    const lastAnswered = profile.lastQuizAnswer
    const answeredToday = lastAnswered === today
    
    if (answeredToday) {
      setIsAnswered(true)
      setShowResult(true)
    }

    // Set countdown timer (24 hours from last answer)
    if (lastAnswered) {
      const lastAnsweredTime = new Date(lastAnswered).getTime()
      const now = new Date().getTime()
      const timeDiff = 24 * 60 * 60 * 1000 - (now - lastAnsweredTime)
      
      if (timeDiff > 0) {
        setTimeLeft(Math.floor(timeDiff / 1000))
      }
    }
  }, [profile, walletAddress])

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [timeLeft])

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return
    
    setSelectedAnswer(answer)
    setShowResult(true)
    setIsAnswered(true)
    
    // Save to profile
    const today = new Date().toDateString()
    if (onUpdateProfile) {
      onUpdateProfile({
        lastQuizAnswer: today
      })
    }
    
    // Add LHP points for correct answer
    if (answer === correctAnswer && onUpdateProfile) {
      onUpdateProfile({
        lhpPoints: (profile?.lhpPoints || 0) + 10
      })
    }
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getAnswerStyle = (answer: string) => {
    if (!showResult) {
      return "bg-white border-2 border-gray-200 hover:border-teal-500 hover:shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-200"
    }

    if (answer === correctAnswer) {
      return "bg-green-50 border-2 border-green-500 shadow-lg"
    }

    if (answer === selectedAnswer && answer !== correctAnswer) {
      return "bg-red-50 border-2 border-red-500 shadow-lg"
    }

    return "bg-gray-50 border-2 border-gray-200 opacity-60"
  }

  const getAnswerIcon = (answer: string) => {
    if (!showResult) return null

    if (answer === correctAnswer) {
      return (
        <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-2">
          <CheckCircle className="w-4 h-4 text-white" />
        </div>
      )
    }

    if (answer === selectedAnswer && answer !== correctAnswer) {
      return (
        <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-2">
          <XCircle className="w-4 h-4 text-white" />
        </div>
      )
    }

    return null
  }

  return (
    <Card className="bg-white border-gray-200 shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
            <Star className="w-5 h-5 text-yellow-500 mr-2" />
            Daily Stablecoin Quiz
          </CardTitle>
          {timeLeft > 0 && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-1" />
              Next quiz in: {formatTime(timeLeft)}
            </div>
          )}
        </div>

        <div className="mb-6">
          <p className="text-lg text-gray-700 mb-4">{question}</p>
          
          <div className="space-y-3">
            {options.map((option, index) => (
              <div
                key={index}
                className={`relative p-4 rounded-lg transition-all duration-200 ${getAnswerStyle(option)}`}
                onClick={() => handleAnswerSelect(option)}
              >
                {getAnswerIcon(option)}
                <span className="font-medium text-gray-900">{option}</span>
              </div>
            ))}
          </div>
        </div>

        {showResult && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">
              {selectedAnswer === correctAnswer ? (
                <span className="text-green-600">✅ Correct!</span>
              ) : (
                <span className="text-red-600">❌ Incorrect</span>
              )}
            </h4>
            <p className="text-gray-700">{explanation}</p>
          </div>
        )}

        {isAnswered && timeLeft === 0 && (
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Come back tomorrow for a new question!</p>
            <div className="text-xs text-gray-500">
              Earn Plasma LHP points for correct answers
            </div>
          </div>
        )}

        {!isAnswered && timeLeft === 0 && (
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Answer correctly to earn Plasma LHP points!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
