"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowRight, Coins } from "lucide-react"
import { useRouter } from "next/navigation"

export default function XPLQuizNicknamePage() {
  const [nickname, setNickname] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!nickname.trim()) {
      setError("Please enter a nickname")
      return
    }

    if (nickname.trim().length < 2) {
      setError("Nickname must be at least 2 characters")
      return
    }

    if (nickname.trim().length > 20) {
      setError("Nickname must be less than 20 characters")
      return
    }

    localStorage.setItem("xplQuizNickname", nickname.trim())
    router.push("/xpl-quiz")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="text-4xl font-black text-teal-600 mb-6">PLASMA</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">XPL Stablecoin Quiz</h1>
                            <p className="text-gray-600">Premium quiz • 20 questions • 0.001 XPL</p>
          </div>

          {/* Nickname Form */}
          <Card className="bg-white border-gray-200 shadow-lg">
            <CardHeader className="text-center">
              <div className="bg-yellow-100 p-3 rounded-full w-fit mx-auto mb-4">
                <Coins className="w-8 h-8 text-yellow-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Choose Your Nickname</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="nickname" className="text-gray-700">
                    Nickname
                  </Label>
                  <Input
                    id="nickname"
                    type="text"
                    value={nickname}
                    onChange={(e) => {
                      setNickname(e.target.value)
                      setError("")
                    }}
                    placeholder="Enter your nickname..."
                    className="mt-1"
                    maxLength={20}
                    autoFocus
                  />
                  {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </div>

                <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3" size="lg">
                  Continue to Payment
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-500">
                <p>• Premium quiz with 20 random questions</p>
                <p>• Build streaks for bonus points</p>
                <p>• Every 3 correct answers = 1 point</p>
                <p>• Multiplier increases with longer streaks</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
