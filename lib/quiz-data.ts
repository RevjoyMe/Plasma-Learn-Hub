export interface QuizOption {
  id: string
  name: string
  logo: string
  description?: string
}

export interface QuizQuestion {
  id: number
  question: string
  options: QuizOption[]
  correctAnswer: string
  explanation?: string
  category: string
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "The first stablecoin ever created?",
    options: [
      { id: "usdc", name: "USDC", logo: "◉", description: "USD Coin" },
      { id: "usdt", name: "USDT", logo: "₮", description: "Tether" },
    ],
    correctAnswer: "usdt",
    explanation: "USDT (Tether) was launched in 2014 and became the first widely used stablecoin.",
    category: "history",
  },
  {
    id: 2,
    question: "DAI was originally called?",
    options: [
      { id: "usdc", name: "USDC", logo: "◉", description: "USD Coin" },
      { id: "sai", name: "Sai", logo: "◈", description: "Single-Collateral DAI" },
    ],
    correctAnswer: "sai",
    explanation: "DAI was originally called Sai when it was single-collateral backed only by ETH.",
    category: "history",
  },
  {
    id: 3,
    question: "USDC was announced in which year?",
    options: [
      { id: "2019", name: "2019", logo: "📅", description: "Year 2019" },
      { id: "2018", name: "2018", logo: "📅", description: "Year 2018" },
    ],
    correctAnswer: "2018",
    explanation: "USDC was announced by Circle and Coinbase in 2018.",
    category: "history",
  },
  {
    id: 4,
    question: "Tether was launched in...?",
    options: [
      { id: "2015", name: "2015", logo: "📅", description: "Year 2015" },
      { id: "2014", name: "2014", logo: "📅", description: "Year 2014" },
    ],
    correctAnswer: "2014",
    explanation: "Tether was launched in 2014 as the first major stablecoin.",
    category: "history",
  },
  {
    id: 5,
    question: "MakerDAO launched DAI in December...?",
    options: [
      { id: "2016", name: "2016", logo: "📅", description: "Year 2016" },
      { id: "2017", name: "2017", logo: "📅", description: "Year 2017" },
    ],
    correctAnswer: "2017",
    explanation: "MakerDAO launched DAI in December 2017.",
    category: "history",
  },
  {
    id: 6,
    question: "Tether reserves were backed by...?",
    options: [
      { id: "28", name: "28%", logo: "📊", description: "28 percent" },
      { id: "74", name: "74%", logo: "📊", description: "74 percent" },
    ],
    correctAnswer: "74",
    explanation: "According to reports, Tether reserves were backed by approximately 74% cash and cash equivalents.",
    category: "backing",
  },
  {
    id: 7,
    question: "USDC lost its peg due to SVB collapse in...?",
    options: [
      { id: "2020", name: "2020", logo: "📅", description: "Year 2020" },
      { id: "2023", name: "2023", logo: "📅", description: "Year 2023" },
    ],
    correctAnswer: "2023",
    explanation: "USDC temporarily lost its peg in March 2023 due to Silicon Valley Bank collapse.",
    category: "events",
  },
  {
    id: 8,
    question: "Tether lost its peg in May 2022?",
    options: [
      { id: "no", name: "No", logo: "❌", description: "False" },
      { id: "yes", name: "Yes", logo: "✅", description: "True" },
    ],
    correctAnswer: "yes",
    explanation: "Tether briefly lost its peg during the Terra Luna collapse in May 2022.",
    category: "events",
  },
  {
    id: 9,
    question: "Algorithmic crash related to UST?",
    options: [
      { id: "yes", name: "Yes", logo: "✅", description: "True" },
      { id: "no", name: "No", logo: "❌", description: "False" },
    ],
    correctAnswer: "yes",
    explanation: "UST was an algorithmic stablecoin that crashed in May 2022.",
    category: "failures",
  },
  {
    id: 10,
    question: "Centralized issuer of USDC is Circle?",
    options: [
      { id: "yes", name: "Yes", logo: "✅", description: "True" },
      { id: "no", name: "No", logo: "❌", description: "False" },
    ],
    correctAnswer: "yes",
    explanation: "Circle is the centralized issuer of USDC.",
    category: "issuers",
  },
  {
    id: 11,
    question: "Fiat-backed stablecoin?",
    options: [
      { id: "usdt", name: "USDT", logo: "₮", description: "Tether" },
      { id: "dai", name: "DAI", logo: "◈", description: "MakerDAO" },
    ],
    correctAnswer: "usdt",
    explanation: "USDT is backed by fiat reserves, while DAI is crypto-collateralized.",
    category: "backing",
  },
  {
    id: 12,
    question: "Crypto-backed stablecoin?",
    options: [
      { id: "dai", name: "DAI", logo: "◈", description: "MakerDAO" },
      { id: "usdc", name: "USDC", logo: "◉", description: "USD Coin" },
    ],
    correctAnswer: "dai",
    explanation: "DAI is backed by cryptocurrency collateral, primarily ETH.",
    category: "backing",
  },
  {
    id: 13,
    question: "Backed by gold?",
    options: [
      { id: "usdc", name: "USDC", logo: "◉", description: "USD Coin" },
      { id: "paxg", name: "PAXG", logo: "🥇", description: "Pax Gold" },
    ],
    correctAnswer: "paxg",
    explanation: "PAXG (Pax Gold) is backed by physical gold reserves.",
    category: "backing",
  },
  {
    id: 14,
    question: "Algorithmic stablecoin?",
    options: [
      { id: "usdt", name: "USDT", logo: "₮", description: "Tether" },
      { id: "ampl", name: "AMPL", logo: "🔄", description: "Ampleforth" },
    ],
    correctAnswer: "ampl",
    explanation: "AMPL uses algorithmic rebasing to maintain its peg.",
    category: "mechanisms",
  },
  {
    id: 15,
    question: "Hybrid algorithm + reserves?",
    options: [
      { id: "dai", name: "DAI", logo: "◈", description: "MakerDAO" },
      { id: "frax", name: "FRAX", logo: "⬢", description: "Frax Protocol" },
    ],
    correctAnswer: "frax",
    explanation: "FRAX uses a hybrid model combining algorithmic mechanisms with collateral backing.",
    category: "mechanisms",
  },
  {
    id: 16,
    question: "Backed by US Treasuries?",
    options: [
      { id: "usdc", name: "USDC", logo: "◉", description: "USD Coin" },
      { id: "usdy", name: "USDY", logo: "🏛️", description: "Ondo USDY" },
    ],
    correctAnswer: "usdy",
    explanation: "USDY is specifically backed by US Treasury securities.",
    category: "backing",
  },
  {
    id: 17,
    question: "Uncollateralized algorithmic token?",
    options: [
      { id: "usde", name: "USDe", logo: "🔷", description: "Ethena USD" },
      { id: "lusd", name: "LUSD", logo: "🔵", description: "Liquity USD" },
    ],
    correctAnswer: "usde",
    explanation: "USDe uses delta hedging strategies rather than traditional collateral.",
    category: "mechanisms",
  },
  {
    id: 18,
    question: "Free-floating rebase mechanism?",
    options: [
      { id: "dai", name: "DAI", logo: "◈", description: "MakerDAO" },
      { id: "ampl", name: "AMPL", logo: "🔄", description: "Ampleforth" },
    ],
    correctAnswer: "ampl",
    explanation: "AMPL adjusts its supply through rebasing to maintain purchasing power.",
    category: "mechanisms",
  },
  {
    id: 19,
    question: "Over-collateralized implementation?",
    options: [
      { id: "frax", name: "FRAX", logo: "⬢", description: "Frax Protocol" },
      { id: "dai", name: "DAI", logo: "◈", description: "MakerDAO" },
    ],
    correctAnswer: "dai",
    explanation: "DAI requires over-collateralization to maintain stability.",
    category: "mechanisms",
  },
  {
    id: 20,
    question: "Fully decentralized coin?",
    options: [
      { id: "usdt", name: "USDT", logo: "₮", description: "Tether" },
      { id: "dai", name: "DAI", logo: "◈", description: "MakerDAO" },
    ],
    correctAnswer: "dai",
    explanation: "DAI is governed by a decentralized autonomous organization (MakerDAO).",
    category: "decentralization",
  },
  {
    id: 21,
    question: "Circle issues...?",
    options: [
      { id: "usdt", name: "USDT", logo: "₮", description: "Tether" },
      { id: "usdc", name: "USDC", logo: "◉", description: "USD Coin" },
    ],
    correctAnswer: "usdc",
    explanation: "Circle is the issuer of USDC (USD Coin).",
    category: "issuers",
  },
  {
    id: 22,
    question: "Paxos issues...?",
    options: [
      { id: "usdp", name: "USDP", logo: "🔷", description: "Pax Dollar" },
      { id: "dai", name: "DAI", logo: "◈", description: "MakerDAO" },
    ],
    correctAnswer: "usdp",
    explanation: "Paxos issues USDP (formerly PAX).",
    category: "issuers",
  },
  {
    id: 23,
    question: "Binance is associated with...?",
    options: [
      { id: "busd", name: "BUSD", logo: "🟡", description: "Binance USD" },
      { id: "tusd", name: "TUSD", logo: "T", description: "TrueUSD" },
    ],
    correctAnswer: "busd",
    explanation: "Binance was associated with BUSD (now discontinued).",
    category: "exchange-tokens",
  },
  {
    id: 24,
    question: "Ethena issues...?",
    options: [
      { id: "usde", name: "USDe", logo: "🔷", description: "Ethena USD" },
      { id: "usdy", name: "USDY", logo: "🏛️", description: "Ondo USDY" },
    ],
    correctAnswer: "usde",
    explanation: "Ethena protocol issues USDe synthetic dollar.",
    category: "issuers",
  },
  {
    id: 25,
    question: "PayPal Stablecoin?",
    options: [
      { id: "dai", name: "DAI", logo: "◈", description: "MakerDAO" },
      { id: "pyusd", name: "PYUSD", logo: "💙", description: "PayPal USD" },
    ],
    correctAnswer: "pyusd",
    explanation: "PayPal launched PYUSD as their stablecoin.",
    category: "corporate-tokens",
  },
  {
    id: 26,
    question: "USDT has the largest market cap?",
    options: [
      { id: "yes", name: "Yes", logo: "✅", description: "True" },
      { id: "no", name: "No", logo: "❌", description: "False" },
    ],
    correctAnswer: "yes",
    explanation: "USDT maintains the largest market capitalization among stablecoins.",
    category: "market-data",
  },
  {
    id: 27,
    question: "USDC is more commonly used in DeFi?",
    options: [
      { id: "yes", name: "Yes", logo: "✅", description: "True" },
      { id: "no", name: "No", logo: "❌", description: "False" },
    ],
    correctAnswer: "yes",
    explanation: "USDC is widely preferred in DeFi protocols due to its regulatory compliance.",
    category: "defi-usage",
  },
  {
    id: 28,
    question: "DAI can be minted with wBTC?",
    options: [
      { id: "yes", name: "Yes", logo: "✅", description: "True" },
      { id: "no", name: "No", logo: "❌", description: "False" },
    ],
    correctAnswer: "yes",
    explanation: "DAI can be minted using various collateral types including wBTC.",
    category: "mechanisms",
  },
  {
    id: 29,
    question: "FRAX is now 100% backed?",
    options: [
      { id: "yes", name: "Yes", logo: "✅", description: "True" },
      { id: "no", name: "No", logo: "❌", description: "False" },
    ],
    correctAnswer: "yes",
    explanation: "FRAX moved to 100% collateral backing, removing the algorithmic component.",
    category: "mechanisms",
  },
  {
    id: 30,
    question: "USDC can be frozen by authorities?",
    options: [
      { id: "yes", name: "Yes", logo: "✅", description: "True" },
      { id: "no", name: "No", logo: "❌", description: "False" },
    ],
    correctAnswer: "yes",
    explanation: "USDC can be frozen by Circle upon regulatory requests.",
    category: "regulation",
  },
]

// Fisher-Yates shuffle algorithm for better randomization
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Get random questions with no duplicates
export function getRandomQuestions(count = 10): QuizQuestion[] {
  if (count > quizQuestions.length) {
    console.warn(`Requested ${count} questions but only ${quizQuestions.length} available. Returning all questions.`)
    return shuffleArray(quizQuestions)
  }
  
  return shuffleArray(quizQuestions).slice(0, count)
}

// Get unique random questions for XPL Quiz (no duplicates within session)
export function getUniqueRandomQuestions(count = 20): QuizQuestion[] {
  if (count > quizQuestions.length) {
    console.warn(`Requested ${count} unique questions but only ${quizQuestions.length} available. Returning all questions.`)
    return shuffleArray(quizQuestions)
  }
  
  return shuffleArray(quizQuestions).slice(0, count)
}

// Get infinite random question (not in recent history)
export function getNextRandomQuestion(recentQuestionIds: number[] = []): QuizQuestion {
  const availableQuestions = quizQuestions.filter((q) => !recentQuestionIds.includes(q.id))
  if (availableQuestions.length === 0) {
    // If we've used all questions, reset and use any question
    return quizQuestions[Math.floor(Math.random() * quizQuestions.length)]
  }
  return availableQuestions[Math.floor(Math.random() * availableQuestions.length)]
}

// Get questions by category
export function getQuestionsByCategory(category: string): QuizQuestion[] {
  return quizQuestions.filter(q => q.category === category)
}

// Get all available categories
export function getAvailableCategories(): string[] {
  return [...new Set(quizQuestions.map(q => q.category))]
}

// Get question statistics
export function getQuestionStats() {
  const totalQuestions = quizQuestions.length
  const categories = getAvailableCategories()
  const categoryStats = categories.map(category => ({
    category,
    count: getQuestionsByCategory(category).length
  }))
  
  return {
    totalQuestions,
    categories: categoryStats
  }
}

// Validate that questions are unique
export function validateUniqueQuestions(questions: QuizQuestion[]): boolean {
  const questionIds = questions.map(q => q.id)
  const uniqueIds = new Set(questionIds)
  return uniqueIds.size === questionIds.length
}

// Get questions with performance monitoring
export function getUniqueRandomQuestionsWithMonitoring(count = 20): {
  questions: QuizQuestion[]
  performance: {
    generationTime: number
    isUnique: boolean
    totalQuestions: number
  }
} {
  const startTime = performance.now()
  const questions = getUniqueRandomQuestions(count)
  const endTime = performance.now()
  
  return {
    questions,
    performance: {
      generationTime: endTime - startTime,
      isUnique: validateUniqueQuestions(questions),
      totalQuestions: quizQuestions.length
    }
  }
}
