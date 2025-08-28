import { getUniqueRandomQuestions, validateUniqueQuestions, getQuestionStats } from "./quiz-data"

export interface PerformanceTestResult {
  iterations: number
  averageGenerationTime: number
  minGenerationTime: number
  maxGenerationTime: number
  allUnique: boolean
  totalQuestions: number
  requestedQuestions: number
  successRate: number
}

export function runPerformanceTest(iterations = 100, questionCount = 20): PerformanceTestResult {
  const generationTimes: number[] = []
  let uniqueCount = 0
  const stats = getQuestionStats()
  
  console.log(`Running performance test: ${iterations} iterations, ${questionCount} questions each`)
  console.log(`Total questions in pool: ${stats.totalQuestions}`)
  
  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now()
    const questions = getUniqueRandomQuestions(questionCount)
    const endTime = performance.now()
    
    const generationTime = endTime - startTime
    generationTimes.push(generationTime)
    
    if (validateUniqueQuestions(questions)) {
      uniqueCount++
    }
    
    // Log progress every 10 iterations
    if ((i + 1) % 10 === 0) {
      console.log(`Completed ${i + 1}/${iterations} iterations`)
    }
  }
  
  const averageGenerationTime = generationTimes.reduce((a, b) => a + b, 0) / generationTimes.length
  const minGenerationTime = Math.min(...generationTimes)
  const maxGenerationTime = Math.max(...generationTimes)
  const successRate = (uniqueCount / iterations) * 100
  
  const result: PerformanceTestResult = {
    iterations,
    averageGenerationTime,
    minGenerationTime,
    maxGenerationTime,
    allUnique: uniqueCount === iterations,
    totalQuestions: stats.totalQuestions,
    requestedQuestions: questionCount,
    successRate
  }
  
  console.log("Performance test results:")
  console.log(`- Average generation time: ${averageGenerationTime.toFixed(2)}ms`)
  console.log(`- Min generation time: ${minGenerationTime.toFixed(2)}ms`)
  console.log(`- Max generation time: ${maxGenerationTime.toFixed(2)}ms`)
  console.log(`- All questions unique: ${result.allUnique}`)
  console.log(`- Success rate: ${successRate.toFixed(2)}%`)
  
  return result
}

export function validateQuestionDistribution(iterations = 1000, questionCount = 20): {
  questionUsage: Record<number, number>
  distribution: {
    minUsage: number
    maxUsage: number
    averageUsage: number
    standardDeviation: number
  }
} {
  const questionUsage: Record<number, number> = {}
  const stats = getQuestionStats()
  
  // Initialize usage counters
  for (let i = 1; i <= stats.totalQuestions; i++) {
    questionUsage[i] = 0
  }
  
  console.log(`Running distribution test: ${iterations} iterations`)
  
  for (let i = 0; i < iterations; i++) {
    const questions = getUniqueRandomQuestions(questionCount)
    
    questions.forEach(question => {
      questionUsage[question.id]++
    })
    
    if ((i + 1) % 100 === 0) {
      console.log(`Completed ${i + 1}/${iterations} iterations`)
    }
  }
  
  const usageValues = Object.values(questionUsage)
  const averageUsage = usageValues.reduce((a, b) => a + b, 0) / usageValues.length
  const minUsage = Math.min(...usageValues)
  const maxUsage = Math.max(...usageValues)
  
  // Calculate standard deviation
  const variance = usageValues.reduce((sum, value) => sum + Math.pow(value - averageUsage, 2), 0) / usageValues.length
  const standardDeviation = Math.sqrt(variance)
  
  console.log("Distribution test results:")
  console.log(`- Average usage per question: ${averageUsage.toFixed(2)}`)
  console.log(`- Min usage: ${minUsage}`)
  console.log(`- Max usage: ${maxUsage}`)
  console.log(`- Standard deviation: ${standardDeviation.toFixed(2)}`)
  
  return {
    questionUsage,
    distribution: {
      minUsage,
      maxUsage,
      averageUsage,
      standardDeviation
    }
  }
}
