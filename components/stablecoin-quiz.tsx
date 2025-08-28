"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import WalletConnection from "./wallet-connection"

const quizQuestions = [
  {
    question: "What is the total market capitalization of stablecoins as of August 6, 2025?",
    left: "$160 billion",
    right: "$268.6 billion",
    correct: "right",
  },
  {
    question: "What is Tether's (USDT) share of the total stablecoin market cap?",
    left: "61%",
    right: "45%",
    correct: "left",
  },
  {
    question: "What was the growth in stablecoin market cap over the last 7 days?",
    left: "$2.65 billion",
    right: "$1.2 billion",
    correct: "left",
  },
  {
    question: "Which is the largest stablecoin by volume and market cap?",
    left: "USDC",
    right: "USDT",
    correct: "right",
  },
  {
    question: "DAI is a...",
    left: "Fiat-backed stablecoin",
    right: "Crypto-backed stablecoin",
    correct: "right",
  },
  {
    question: "USDT belongs to which type?",
    left: "Algorithmic",
    right: "Fiat-backed",
    correct: "right",
  },
  {
    question: "crvUSD is based on...",
    left: "LLAMMA mechanism",
    right: "Classical liquidation",
    correct: "left",
  },
  {
    question: "FRAX is a...",
    left: "Pure algorithmic stablecoin",
    right: "Hybrid stablecoin",
    correct: "right",
  },
  {
    question: "Ethena USDe is stabilized through...",
    left: "USDC collateral",
    right: "Delta-neutral strategy",
    correct: "right",
  },
  {
    question: "Sky USDs is a...",
    left: "Centralized stablecoin",
    right: "Algorithmic stablecoin",
    correct: "right",
  },
  {
    question: "Is USDT issued on both Ethereum and Tron?",
    left: "Yes",
    right: "No",
    correct: "left",
  },
  {
    question: "Is USDC issued by Circle and Coinbase?",
    left: "Yes",
    right: "No",
    correct: "left",
  },
  {
    question: "Is DAI created through Maker Vaults?",
    left: "Yes",
    right: "No",
    correct: "left",
  },
  {
    question: "crvUSD uses automatic liquidation through...",
    left: "LLAMMA",
    right: "Aave",
    correct: "left",
  },
  {
    question: "Does FRAX have fixed collateral?",
    left: "Yes",
    right: "No",
    correct: "right",
  },
  {
    question: "Does USDe depend on ETH staking and derivatives?",
    left: "Yes",
    right: "No",
    correct: "left",
  },
  {
    question: "USDTb is indexed to the price of...",
    left: "BTC",
    right: "USDT",
    correct: "right",
  },
  {
    question: "Is DAI subject to collateral devaluation risk?",
    left: "Yes",
    right: "No",
    correct: "left",
  },
  {
    question: "Can USDT freeze addresses?",
    left: "Yes",
    right: "No",
    correct: "left",
  },
  {
    question: "Is FRAX fully decentralized?",
    left: "Yes",
    right: "No",
    correct: "right",
  },
  {
    question: "Does Sky USDs have high transparency?",
    left: "Yes",
    right: "No",
    correct: "right",
  },
  {
    question: "Can USDe suffer from derivatives volatility?",
    left: "Yes",
    right: "No",
    correct: "left",
  },
  {
    question: "BUIDL tokenizes...",
    left: "ETH",
    right: "US Treasury bonds",
    correct: "right",
  },
  {
    question: "Franklin OnChain USD works on...",
    left: "Solana",
    right: "Stellar and Polygon",
    correct: "right",
  },
  {
    question: "Ondo USDY generates yield from...",
    left: "ETH staking",
    right: "US bonds",
    correct: "right",
  },
  {
    question: "USDf is issued by...",
    left: "Falcon Group",
    right: "Ripple Labs",
    correct: "left",
  },
  {
    question: "USDX is a...",
    left: "Tokenized treasury",
    right: "Fiat-backed stablecoin",
    correct: "right",
  },
  {
    question: "USDz is issued by...",
    left: "Paxos",
    right: "Stably",
    correct: "right",
  },
  {
    question: "PYUSD is issued for...",
    left: "Google Pay",
    right: "PayPal",
    correct: "right",
  },
  {
    question: "RLUSD from Ripple works on...",
    left: "Ethereum",
    right: "XRP Ledger",
    correct: "right",
  },
  {
    question: "Current market cap of all stablecoins?",
    left: "$232 billion",
    right: "$268 billion",
    correct: "right",
  },
  {
    question: "Share of dollar stablecoins from total market cap?",
    left: "97%",
    right: "99%",
    correct: "right",
  },
  {
    question: "Stablecoins represent approximately... of US M2?",
    left: "1.2%",
    right: "2.1%",
    correct: "left",
  },
  {
    question: "Largest stablecoin by market cap?",
    left: "USDC",
    right: "USDT",
    correct: "right",
  },
  {
    question: "Second place by market cap is held by...?",
    left: "DAI",
    right: "USDC",
    correct: "right",
  },
  {
    question: "Ethena USDe ranks... by market cap?",
    left: "3rd",
    right: "5th",
    correct: "left",
  },
  {
    question: "Is DAI's market cap more than $5 billion?",
    left: "Yes",
    right: "No",
    correct: "right",
  },
  {
    question: "Does PayPal USD (PYUSD) have market cap above $1 billion?",
    left: "Yes",
    right: "No",
    correct: "right",
  },
  {
    question: "Do algorithmic stablecoins occupy less than 1% of the market?",
    left: "Yes",
    right: "No",
    correct: "left",
  },
  {
    question: "Are fiat-backed stablecoins the market foundation?",
    left: "Yes",
    right: "No",
    correct: "left",
  },
  {
    question: "In 2019, stablecoin market cap was...?",
    left: "$5 billion",
    right: "$25 billion",
    correct: "left",
  },
  {
    question: "Stablecoin market cap in December 2024 exceeded...?",
    left: "$150 billion",
    right: "$200 billion",
    correct: "right",
  },
  {
    question: "In March 2025, market cap was...?",
    left: "$232 billion",
    right: "$251 billion",
    correct: "left",
  },
  {
    question: "In June 2025, the stablecoin market reached...?",
    left: "$251.7 billion",
    right: "$400 billion",
    correct: "left",
  },
  {
    question: "Bitwise predicted $400 billion stablecoin market by...?",
    left: "2026",
    right: "2025",
    correct: "right",
  },
  {
    question: "Terra USD collapse in 2022 destroyed more than...?",
    left: "$60 billion",
    right: "$30 billion",
    correct: "left",
  },
  {
    question: "Number of active stablecoins in 2025 - more than...?",
    left: "100",
    right: "250",
    correct: "right",
  },
  {
    question: "Stablecoin payment volume in June 2025 was $886.4 billion?",
    left: "Yes",
    right: "No",
    correct: "left",
  },
  {
    question: "Does USDT process more than 80% of stablecoin transactions?",
    left: "Yes",
    right: "No",
    correct: "left",
  },
  {
    question: "USDC's share in payments in June 2025 was 13.9%?",
    left: "Yes",
    right: "No",
    correct: "left",
  },
  {
    question: "Is PYUSD issued by Paxos?",
    left: "Yes",
    right: "No",
    correct: "left",
  },
  {
    question: "Does Paxos also issue USDP?",
    left: "Yes",
    right: "No",
    correct: "left",
  },
]

export default function StablecoinQuiz() {
  const [isPaid, setIsPaid] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<"left" | "right" | "">("")
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [answers, setAnswers] = useState<string[]>([])

  const handlePayment = (success: boolean) => {
    setIsPaid(success)
  }

  const handleAnswerSelect = (answer: "left" | "right") => {
    setSelectedAnswer(answer)
  }

  const handleNextQuestion = () => {
    const newAnswers = [...answers, selectedAnswer]
    setAnswers(newAnswers)

    if (selectedAnswer === quizQuestions[currentQuestion].correct) {
      setScore(score + 1)
    }

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer("")
    } else {
      setShowResult(true)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer("")
    setScore(0)
    setShowResult(false)
    setAnswers([])
    setIsPaid(false)
  }

  if (!isPaid) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <WalletConnection onPayment={handlePayment} gameType="quiz" />
      </div>
    )
  }

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100

  if (showResult) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="max-w-md mx-auto space-y-6">
          <Card className="bg-white shadow-lg border-2 border-emerald-200">
            <CardHeader className="bg-emerald-500 text-white rounded-t-lg">
              <CardTitle className="text-center text-xl text-white">Quiz Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">
                  {score}/{quizQuestions.length}
                </div>
                <p className="text-black">
                  {score === quizQuestions.length
                    ? "Perfect! You're a stablecoin expert!"
                    : score >= Math.floor(quizQuestions.length * 0.7)
                      ? "Great job! You know stablecoins well."
                      : score >= Math.floor(quizQuestions.length * 0.5)
                        ? "Good effort! Keep learning about stablecoins."
                        : "Time to study more about stablecoins!"}
                </p>
              </div>

              <div className="space-y-2">
                <Progress value={(score / quizQuestions.length) * 100} className="h-3" />
                <p className="text-sm text-center text-black">
                  {Math.round((score / quizQuestions.length) * 100)}% correct answers
                </p>
              </div>

              <Button onClick={resetQuiz} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                Take Quiz Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto space-y-6 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black mb-2">Stablecoin Quiz</h1>
          <p className="text-black">Test your knowledge!</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-black">
            <span>
              Question {currentQuestion + 1} of {quizQuestions.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card className="bg-white shadow-lg border-2 border-emerald-200">
          <CardHeader className="bg-emerald-500 text-white rounded-t-lg">
            <CardTitle className="text-lg text-white">{quizQuestions[currentQuestion].question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={selectedAnswer === "left" ? "default" : "outline"}
                onClick={() => handleAnswerSelect("left")}
                className={`h-auto p-4 text-left whitespace-normal ${
                  selectedAnswer === "left"
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500"
                    : "bg-white hover:bg-emerald-50 text-black border-emerald-300"
                }`}
              >
                <div>
                  <div className={`font-semibold mb-1 ${selectedAnswer === "left" ? "text-white" : "text-black"}`}>
                    LEFT
                  </div>
                  <div className={`text-sm ${selectedAnswer === "left" ? "text-white" : "text-black"}`}>
                    {quizQuestions[currentQuestion].left}
                  </div>
                </div>
              </Button>

              <Button
                variant={selectedAnswer === "right" ? "default" : "outline"}
                onClick={() => handleAnswerSelect("right")}
                className={`h-auto p-4 text-left whitespace-normal ${
                  selectedAnswer === "right"
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500"
                    : "bg-white hover:bg-emerald-50 text-black border-emerald-300"
                }`}
              >
                <div>
                  <div className={`font-semibold mb-1 ${selectedAnswer === "right" ? "text-white" : "text-black"}`}>
                    RIGHT
                  </div>
                  <div className={`text-sm ${selectedAnswer === "right" ? "text-white" : "text-black"}`}>
                    {quizQuestions[currentQuestion].right}
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleNextQuestion}
          disabled={!selectedAnswer}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white disabled:bg-gray-300"
        >
          {currentQuestion < quizQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
        </Button>

        <div className="text-center">
          <p className="text-sm text-black">
            Current score: {score}/{currentQuestion + (selectedAnswer ? 1 : 0)}
          </p>
        </div>
      </div>
    </div>
  )
}
