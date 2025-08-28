"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, XCircle, ArrowRight, Flame, Star, Home } from "lucide-react"
import { getNextRandomQuestion } from "@/lib/quiz-data"
import {
  type GameSession,
  calculateStreakPoints,
  shouldAwardPoints,
  saveCurrentSession,
  addToLeaderboard,
  clearCurrentSession,
} from "@/lib/leaderboard"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface QuizState {
  currentQuestion: any
  selectedAnswer: string | null
  showResult: boolean
  session: GameSession | null
}

export default function QuizPage() {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: null,
    selectedAnswer: null,
    showResult: false,
    session: null,
  })
  const router = useRouter()

  useEffect(() => {
    // Load session or redirect to nickname page
    const sessionData = localStorage.getItem("currentSession")
    if (!sessionData) {
      router.push("/nickname")
      return
    }

    const session: GameSession = JSON.parse(sessionData)
    const question = getNextRandomQuestion(session.recentQuestions)

    setQuizState({
      currentQuestion: question,
      selectedAnswer: null,
      showResult: false,
      session,
    })
  }, [router])

  const handleAnswerSelect = (answer: string) => {
    if (quizState.selectedAnswer || !quizState.session) return

    setQuizState((prev) => ({
      ...prev,
      selectedAnswer: answer,
      showResult: true,
    }))

    // Auto advance after 2.5 seconds
    setTimeout(() => {
      handleNextQuestion(answer)
    }, 2500)
  }

  const handleNextQuestion = (answer: string) => {
    if (!quizState.session || !quizState.currentQuestion) return

    const isCorrect = answer === quizState.currentQuestion.correctAnswer
    const newSession = { ...quizState.session }

    // Update session stats
    newSession.questionsAnswered += 1
    if (isCorrect) {
      newSession.correctAnswers += 1
      const oldStreak = newSession.currentStreak
      newSession.currentStreak += 1

      // Award points if we completed a new group of 3
      if (shouldAwardPoints(oldStreak, newSession.currentStreak)) {
        const pointsToAdd = calculateStreakPoints(newSession.currentStreak)
        newSession.totalPoints += pointsToAdd
      }
    } else {
      // Only reset streak, keep points
      newSession.currentStreak = 0
    }

    // Update recent questions (keep last 10 to avoid immediate repeats)
    newSession.recentQuestions = [...newSession.recentQuestions.slice(-9), quizState.currentQuestion.id]

    // Save session
    saveCurrentSession(newSession)

    // Get next question
    const nextQuestion = getNextRandomQuestion(newSession.recentQuestions)

    setQuizState({
      currentQuestion: nextQuestion,
      selectedAnswer: null,
      showResult: false,
      session: newSession,
    })
  }

  const handleEndQuiz = () => {
    if (!quizState.session) return

    // Add to leaderboard
    addToLeaderboard({
      nickname: quizState.session.nickname,
      points: quizState.session.totalPoints,
      streak: quizState.session.currentStreak,
      questionsAnswered: quizState.session.questionsAnswered,
      correctAnswers: quizState.session.correctAnswers,
    })

    // Clear session
    clearCurrentSession()

    // Go to results
    localStorage.setItem(
      "lastGameResults",
      JSON.stringify({
        nickname: quizState.session.nickname,
        points: quizState.session.totalPoints,
        streak: quizState.session.currentStreak,
        questionsAnswered: quizState.session.questionsAnswered,
        correctAnswers: quizState.session.correctAnswers,
      }),
    )

    router.push("/results")
  }

  if (!quizState.currentQuestion || !quizState.session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  const getAnswerStyle = (answer: string) => {
    if (!quizState.showResult) {
      return "bg-white border-2 border-gray-200 hover:border-teal-500 hover:shadow-lg cursor-pointer transform hover:scale-105 transition-all duration-200"
    }

    if (answer === quizState.currentQuestion.correctAnswer) {
      return "bg-green-50 border-2 border-green-500 shadow-lg"
    }

    if (answer === quizState.selectedAnswer && answer !== quizState.currentQuestion.correctAnswer) {
      return "bg-red-50 border-2 border-red-500 shadow-lg"
    }

    return "bg-gray-50 border-2 border-gray-200 opacity-60"
  }

  const getAnswerIcon = (answer: string) => {
    if (!quizState.showResult) return null

    if (answer === quizState.currentQuestion.correctAnswer) {
      return (
        <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-2">
          <CheckCircle className="w-6 h-6 text-white" />
        </div>
      )
    }

    if (answer === quizState.selectedAnswer && answer !== quizState.currentQuestion.correctAnswer) {
      return (
        <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-2">
          <XCircle className="w-6 h-6 text-white" />
        </div>
      )
    }

    return null
  }

  const currentMultiplier = Math.floor(quizState.session.currentStreak / 3) * 0.1 + 1

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-black text-teal-600">PLASMA</div>
              <h1 className="text-2xl font-bold text-gray-900">StableCoin Quiz</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent">
                  <Home className="mr-2 w-4 h-4" />
                  Back to Menu
                </Button>
              </Link>
              <Button
                onClick={handleEndQuiz}
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-50 bg-transparent"
              >
                End Quiz
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white border-gray-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-teal-600">{quizState.session.totalPoints}</div>
                <div className="text-sm text-gray-500">Points</div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center space-x-1">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <div className="text-2xl font-bold text-orange-600">{quizState.session.currentStreak}</div>
                </div>
                <div className="text-sm text-gray-500">Streak</div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <div className="text-2xl font-bold text-yellow-600">{currentMultiplier.toFixed(1)}x</div>
                </div>
                <div className="text-sm text-gray-500">Multiplier</div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {quizState.session.correctAnswers}/{quizState.session.questionsAnswered}
                </div>
                <div className="text-sm text-gray-500">Correct</div>
              </CardContent>
            </Card>
          </div>

          {/* Player Info */}
          <div className="text-center mb-4">
            <div className="text-lg font-semibold text-gray-900">Playing as: {quizState.session.nickname}</div>
            {quizState.session.currentStreak >= 3 && (
              <div className="text-sm text-teal-600 mt-1">
                🔥 {Math.floor(quizState.session.currentStreak / 3)} streak bonus
                {Math.floor(quizState.session.currentStreak / 3) > 1 ? "es" : ""} earned!
              </div>
            )}
          </div>
        </div>

        {/* Question */}
        <Card className="bg-white border-gray-200 shadow-lg mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center text-gray-900 leading-relaxed">
              {quizState.currentQuestion.question}
            </h2>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {quizState.currentQuestion.options.map((option: any, index: number) => (
                <div key={index} className="relative">
                  <Card
                    className={`transition-all duration-300 ${getAnswerStyle(option.id)}`}
                    onClick={() => handleAnswerSelect(option.id)}
                  >
                    <CardContent className="p-8">
                      <div className="text-center">
                        <div className="text-6xl mb-4">{option.logo}</div>
                        <div className="text-2xl font-bold text-gray-900 mb-2">{option.name}</div>
                        {option.description && <div className="text-lg text-gray-600">{option.description}</div>}
                      </div>
                    </CardContent>
                  </Card>
                  {getAnswerIcon(option.id)}
                </div>
              ))}
            </div>

            {quizState.showResult && (
              <div className="text-center mt-8">
                <div className="text-xl mb-4">
                  {quizState.selectedAnswer === quizState.currentQuestion.correctAnswer ? (
                    <span className="text-green-600 font-bold">Correct! 🎉</span>
                  ) : (
                    <span className="text-red-600 font-bold">Incorrect 😔</span>
                  )}
                </div>
                {quizState.currentQuestion.explanation && (
                  <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
                    {quizState.currentQuestion.explanation}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Manual Next Button (if needed) */}
        {quizState.showResult && (
          <div className="text-center">
            <Button
              onClick={() => handleNextQuestion(quizState.selectedAnswer!)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 text-lg"
            >
              Next Question
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
