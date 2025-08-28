"use client"

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Database, Shuffle, CheckCircle } from "lucide-react"
import { getQuestionStats } from "@/lib/quiz-data"

export function QuizStats() {
  const stats = getQuestionStats()
  
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Database className="w-5 h-5 text-blue-600" />
            <div>
              <div className="text-sm font-semibold text-gray-900">Question Pool</div>
              <div className="text-xs text-gray-600">{stats.totalQuestions} total questions</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Shuffle className="w-5 h-5 text-purple-600" />
            <div>
              <div className="text-sm font-semibold text-gray-900">Selection</div>
              <div className="text-xs text-gray-600">20 unique questions</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <div className="text-sm font-semibold text-gray-900">Guarantee</div>
              <div className="text-xs text-gray-600">No duplicates</div>
            </div>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-blue-200">
          <div className="text-xs text-gray-600">
            Categories: {stats.categories.map(cat => `${cat.category} (${cat.count})`).join(', ')}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
