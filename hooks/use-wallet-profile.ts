"use client"

import { useState, useEffect } from "react"
import { getBlockchainInstance } from "@/lib/blockchain"

interface UserProfile {
  walletAddress: string
  lhpPoints: number
  totalGames: number
  currentStreak: number
  totalDays: number
  achievements: Achievement[]
  lastSpinTime: number | null
  lastQuizAnswer: string | null
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  progress: number
  maxProgress: number
}

const defaultAchievements: Achievement[] = [
  {
    id: "plasma-rookie",
    name: "Plasma Rookie",
    description: "Complete your first quiz or game",
    icon: "🌟",
    unlocked: true,
    progress: 1,
    maxProgress: 1
  },
  {
    id: "plasma-voyager",
    name: "Plasma Voyager",
    description: "Complete 10 quizzes or games",
    icon: "🚀",
    unlocked: false,
    progress: 0,
    maxProgress: 10
  },
  {
    id: "plasma-master",
    name: "Plasma Master",
    description: "Complete 50 quizzes or games",
    icon: "👑",
    unlocked: false,
    progress: 0,
    maxProgress: 50
  },
  {
    id: "streak-champion",
    name: "Streak Champion",
    description: "Maintain a 7-day login streak",
    icon: "🔥",
    unlocked: false,
    progress: 0,
    maxProgress: 7
  },
  {
    id: "lhp-collector",
    name: "LHP Collector",
    description: "Earn 1000 Plasma LHP points",
    icon: "💎",
    unlocked: false,
    progress: 0,
    maxProgress: 1000
  },
  {
    id: "quiz-expert",
    name: "Quiz Expert",
    description: "Answer 100 quiz questions correctly",
    icon: "🧠",
    unlocked: false,
    progress: 0,
    maxProgress: 100
  }
]

export function useWalletProfile() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check wallet connection status
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        if (typeof window !== "undefined" && window.ethereum) {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts && accounts.length > 0) {
            setIsConnected(true)
            setWalletAddress(accounts[0])
            await loadUserProfile(accounts[0])
          } else {
            setIsConnected(false)
            setWalletAddress(null)
            setProfile(null)
          }
        } else {
          setIsConnected(false)
          setWalletAddress(null)
          setProfile(null)
        }
      } catch (err) {
        console.error("Error checking wallet connection:", err)
        setError("Failed to check wallet connection")
      } finally {
        setIsLoading(false)
      }
    }

    checkWalletConnection()

    // Listen for wallet connection changes
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", async (accounts: string[]) => {
        if (accounts && accounts.length > 0) {
          setIsConnected(true)
          setWalletAddress(accounts[0])
          await loadUserProfile(accounts[0])
        } else {
          setIsConnected(false)
          setWalletAddress(null)
          setProfile(null)
        }
      })
    }
  }, [])

  const loadUserProfile = async (address: string) => {
    try {
      setIsLoading(true)
      setError(null)

      // Load profile data from localStorage using wallet address as key
      const profileKey = `userProfile_${address.toLowerCase()}`
      const savedProfile = localStorage.getItem(profileKey)

      if (savedProfile) {
        const parsedProfile = JSON.parse(savedProfile)
        setProfile(parsedProfile)
      } else {
        // Create new profile for this wallet
        const newProfile: UserProfile = {
          walletAddress: address,
          lhpPoints: 0,
          totalGames: 0,
          currentStreak: 0,
          totalDays: 0,
          achievements: defaultAchievements,
          lastSpinTime: null,
          lastQuizAnswer: null
        }
        
        // Check if user has any existing data in leaderboards
        const quizEntries = JSON.parse(localStorage.getItem("leaderboard_quiz_global") || "[]")
        const gameEntries = JSON.parse(localStorage.getItem("leaderboard_2048_global") || "[]")
        
        const userQuizEntries = quizEntries.filter((entry: any) => 
          entry.walletAddress?.toLowerCase() === address.toLowerCase()
        )
        const userGameEntries = gameEntries.filter((entry: any) => 
          entry.walletAddress?.toLowerCase() === address.toLowerCase()
        )

        newProfile.totalGames = userQuizEntries.length + userGameEntries.length

        // Update achievements based on existing data
        newProfile.achievements = updateAchievements(newProfile.achievements, newProfile)
        
        setProfile(newProfile)
        localStorage.setItem(profileKey, JSON.stringify(newProfile))
      }
    } catch (err) {
      console.error("Error loading user profile:", err)
      setError("Failed to load user profile")
    } finally {
      setIsLoading(false)
    }
  }

  const updateAchievements = (achievements: Achievement[], profile: UserProfile): Achievement[] => {
    return achievements.map(achievement => {
      switch (achievement.id) {
        case "plasma-voyager":
          return { 
            ...achievement, 
            progress: Math.min(profile.totalGames, 10), 
            unlocked: profile.totalGames >= 10 
          }
        case "plasma-master":
          return { 
            ...achievement, 
            progress: Math.min(profile.totalGames, 50), 
            unlocked: profile.totalGames >= 50 
          }
        case "streak-champion":
          return { 
            ...achievement, 
            progress: Math.min(profile.currentStreak, 7), 
            unlocked: profile.currentStreak >= 7 
          }
        case "lhp-collector":
          return { 
            ...achievement, 
            progress: Math.min(profile.lhpPoints, 1000), 
            unlocked: profile.lhpPoints >= 1000 
          }
        default:
          return achievement
      }
    })
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile || !walletAddress) return

    const updatedProfile = { ...profile, ...updates }
    updatedProfile.achievements = updateAchievements(updatedProfile.achievements, updatedProfile)
    
    setProfile(updatedProfile)
    
    // Save to localStorage
    const profileKey = `userProfile_${walletAddress.toLowerCase()}`
    localStorage.setItem(profileKey, JSON.stringify(updatedProfile))
  }

  const addLhpPoints = async (points: number) => {
    if (!profile) return
    
    await updateProfile({
      lhpPoints: profile.lhpPoints + points
    })
  }

  const updateStreak = async (newStreak: number, newTotalDays: number) => {
    if (!profile) return
    
    await updateProfile({
      currentStreak: newStreak,
      totalDays: newTotalDays
    })
  }

  const updateLastSpinTime = async (timestamp: number) => {
    if (!profile) return
    
    await updateProfile({
      lastSpinTime: timestamp
    })
  }

  const updateLastQuizAnswer = async (date: string) => {
    if (!profile) return
    
    await updateProfile({
      lastQuizAnswer: date
    })
  }

  const connectWallet = async () => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
        if (accounts && accounts.length > 0) {
          setIsConnected(true)
          setWalletAddress(accounts[0])
          await loadUserProfile(accounts[0])
        }
      } else {
        setError("MetaMask is not installed")
      }
    } catch (err) {
      console.error("Error connecting wallet:", err)
      setError("Failed to connect wallet")
    }
  }

  return {
    isConnected,
    walletAddress,
    profile,
    isLoading,
    error,
    connectWallet,
    updateProfile,
    addLhpPoints,
    updateStreak,
    updateLastSpinTime,
    updateLastQuizAnswer
  }
}
