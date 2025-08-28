"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, XCircle, ArrowRight, Flame, Star, Coins, Home } from "lucide-react"
import { getRandomQuestions } from "@/lib/quiz-data"
import { useRouter } from "next/navigation"
import { WalletConnection } from "@/components/wallet-connection"
import { useBlockchain } from "@/hooks/use-blockchain"
import Link from "next/link"

interface XPLQuizState {
  currentQuestion: any
  selectedAnswer: string | null
  showResult: boolean
  questionsAnswered: number
  correctAnswers: number
  currentStreak: number
  totalPoints: number
  questions: any[]
  gameStarted: boolean
  gameCompleted: boolean
  nickname: string
}

export default function XPLQuizPage() {
  const [quizState, setQuizState] = useState<XPLQuizState>({
    currentQuestion: null,
    selectedAnswer: null,
    showResult: false,
    questionsAnswered: 0,
    correctAnswers: 0,
    currentStreak: 0,
    totalPoints: 0,
    questions: [],
    gameStarted: false,
    gameCompleted: false,
    nickname: "",
  })

  const { walletState, connectWallet, purchaseGame } = useBlockchain(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS)
  const router = useRouter()

  useEffect(() => {
    // Get nickname from localStorage or redirect
    const nickname = localStorage.getItem("xplQuizNickname")
    if (!nickname) {
      router.push("/xpl-quiz/nickname")
      return
    }

    setQuizState((prev) => ({ ...prev, nickname }))
  }, [router])

  const handleGamePurchase = async () => {
    try {
      console.log("Starting game purchase...")
      const gameId = await purchaseGame()
      console.log("Game purchased successfully, gameId:", gameId)
      
      // Generate 20 random questions
      const randomQuestions = getRandomQuestions(20)
      setQuizState((prev) => ({
        ...prev,
        questions: randomQuestions,
        currentQuestion: randomQuestions[0],
        gameStarted: true,
      }))
    } catch (error) {
      console.error("Failed to purchase game:", error)
      // Показываем ошибку пользователю
      alert(`Failed to purchase game: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleAnswerSelect = (answer: string) => {
    if (quizState.selectedAnswer || quizState.gameCompleted) return

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
    if (!quizState.currentQuestion || quizState.gameCompleted) return

    const isCorrect = answer === quizState.currentQuestion.correctAnswer
    const newQuestionsAnswered = quizState.questionsAnswered + 1
    const newCorrectAnswers = quizState.correctAnswers + (isCorrect ? 1 : 0)
    const newStreak = isCorrect ? quizState.currentStreak + 1 : 0

    // Calculate points (1 point per 3 correct answers in streak)
    let pointsToAdd = 0
    if (isCorrect && newStreak > 0 && newStreak % 3 === 0) {
      const multiplier = 1 + Math.floor(newStreak / 3 - 1) * 0.1
      pointsToAdd = Math.round(multiplier * 10) / 10
    }

    // Check if quiz is completed (20 questions)
    const isCompleted = newQuestionsAnswered >= 20

    if (isCompleted) {
      // Save results and go to results page
      const finalResults = {
        nickname: quizState.nickname,
        points: quizState.totalPoints + pointsToAdd,
        streak: newStreak,
        questionsAnswered: newQuestionsAnswered,
        correctAnswers: newCorrectAnswers,
        gameType: "xpl-quiz",
      }

      localStorage.setItem("lastGameResults", JSON.stringify(finalResults))
      localStorage.removeItem("xplQuizNickname")
      router.push("/results")
      return
    }

    // Move to next question
    const nextQuestion = quizState.questions[newQuestionsAnswered]

    setQuizState((prev) => ({
      ...prev,
      currentQuestion: nextQuestion,
      selectedAnswer: null,
      showResult: false,
      questionsAnswered: newQuestionsAnswered,
      correctAnswers: newCorrectAnswers,
      currentStreak: newStreak,
      totalPoints: prev.totalPoints + pointsToAdd,
    }))
  }

  const handleEndQuiz = () => {
    const finalResults = {
      nickname: quizState.nickname,
      points: quizState.totalPoints,
      streak: quizState.currentStreak,
      questionsAnswered: quizState.questionsAnswered,
      correctAnswers: quizState.correctAnswers,
      gameType: "xpl-quiz",
    }

    localStorage.setItem("lastGameResults", JSON.stringify(finalResults))
    localStorage.removeItem("xplQuizNickname")
    router.push("/results")
  }

  // Show wallet connection if not started
  if (!quizState.gameStarted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            {/* Header */}
            <div className="mb-8">
              <div className="text-4xl font-black text-teal-600 mb-6">PLASMA</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">XPL Stablecoin Quiz</h1>
              <p className="text-gray-600 text-lg">Premium quiz with 20 random questions</p>
            </div>

            {/* Game Info */}
            <Card className="bg-white border-gray-200 shadow-lg mb-8">
              <CardContent className="p-8">
                <div className="flex items-center justify-center mb-6">
                  <Coins className="w-12 h-12 text-yellow-500 mr-4" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">Premium Quiz</div>
                    <div className="text-gray-600">20 Random Questions</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-xl font-bold text-teal-600">20</div>
                    <div className="text-sm text-gray-500">Questions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-yellow-600">0.001 XPL</div>
                    <div className="text-sm text-gray-500">Price</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-600">Random</div>
                    <div className="text-sm text-gray-500">Selection</div>
                  </div>
                </div>

                {quizState.nickname && (
                  <div className="mb-6">
                    <div className="text-lg font-semibold text-gray-900">Playing as: {quizState.nickname}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            <WalletConnection
              isConnected={walletState.isConnected}
              address={walletState.address}
              balance={walletState.balance}
              isConnecting={walletState.isConnecting}
              error={walletState.error}
              onConnect={connectWallet}
              onRefreshBalance={async () => {}}
              gameType="xpl-quiz"
              price="0.001 XPL"
              onPayment={handleGamePurchase}
            />
          </div>
        </div>
      </div>
    )
  }

  // Show loading if no current question
  if (!quizState.currentQuestion) {
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

  const currentMultiplier = Math.floor(quizState.currentStreak / 3) * 0.1 + 1

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="text-2xl font-black text-teal-600">PLASMA</div>
              <h1 className="text-2xl font-bold text-gray-900">XPL Stablecoin Quiz</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent">
                  <Home className="mr-2 w-4 h-4" />
                  Back to Menu
                </Button>
              </Link>
              {quizState.gameStarted && (
                <Button
                  onClick={handleEndQuiz}
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-50 bg-transparent"
                >
                  End Quiz
                </Button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <Card className="bg-white border-gray-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-teal-600">{quizState.totalPoints}</div>
                <div className="text-sm text-gray-500">Points</div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center space-x-1">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <div className="text-2xl font-bold text-orange-600">{quizState.currentStreak}</div>
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
                  {quizState.correctAnswers}/{quizState.questionsAnswered}
                </div>
                <div className="text-sm text-gray-500">Correct</div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{quizState.questionsAnswered}/20</div>
                <div className="text-sm text-gray-500">Progress</div>
              </CardContent>
            </Card>
          </div>

          {/* Player Info */}
          <div className="text-center mb-4">
            <div className="text-lg font-semibold text-gray-900">Playing as: {quizState.nickname}</div>
            {quizState.currentStreak >= 3 && (
              <div className="text-sm text-teal-600 mt-1">
                🔥 {Math.floor(quizState.currentStreak / 3)} streak bonus
                {Math.floor(quizState.currentStreak / 3) > 1 ? "es" : ""} earned!
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
              {quizState.questionsAnswered >= 19 ? "Finish Quiz" : "Next Question"}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
