"use client"

import { useState, useEffect, useCallback } from "react"
import { getBlockchainInstance } from "@/lib/blockchain"

interface WalletState {
  isConnected: boolean
  address: string | null
  balance: string | null
  isConnecting: boolean
  error: string | null
}

interface PlayerStats {
  totalGames: number
  bestScore: number
  totalSpent: string
}

export function useBlockchain(contractAddress = "") {
  console.log("useBlockchain called with contractAddress:", contractAddress)
  
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    balance: null,
    isConnecting: false,
    error: null,
  })

  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    totalGames: 0,
    bestScore: 0,
    totalSpent: "0 XPL",
  })

  const [gamePrice, setGamePrice] = useState<string>("0.001 XPL")

  const blockchain = getBlockchainInstance(contractAddress)

  const connectWallet = useCallback(async () => {
    setWalletState((prev) => ({ ...prev, isConnecting: true, error: null }))

    try {
      const { address, balance } = await blockchain.connectWallet()

      setWalletState({
        isConnected: true,
        address, // Store full address for API calls
        balance,
        isConnecting: false,
        error: null,
      })

      const stats = await blockchain.getPlayerStats(address)
      setPlayerStats(stats)

      const price = await blockchain.getGamePrice()
      setGamePrice(price)
    } catch (error) {
      let errorMessage = "Failed to connect wallet"

      if (error instanceof Error) {
        if (error.message.includes("network") || error.message.includes("chain")) {
          errorMessage = "Please add Plasma Network to your wallet or switch to the correct network"
        } else if (error.message.includes("rejected") || error.message.includes("denied")) {
          errorMessage = "Connection rejected by user"
        } else {
          errorMessage = error.message
        }
      }

      setWalletState((prev) => ({
        ...prev,
        isConnecting: false,
        error: errorMessage,
      }))
    }
  }, [blockchain])

  const purchaseGame = useCallback(async (): Promise<string> => {
    if (!walletState.isConnected) {
      throw new Error("Wallet not connected")
    }

    try {
      console.log("Calling blockchain.purchaseGame()...")
      const gameId = await blockchain.purchaseGame()
      console.log("Purchase successful, gameId:", gameId)

      // Update balance after purchase
      const newBalance = await blockchain.getBalance()
      setWalletState((prev) => ({ ...prev, balance: newBalance }))

      // Update player stats
      if (walletState.address) {
        const stats = await blockchain.getPlayerStats(walletState.address)
        setPlayerStats(stats)
      }

      return gameId
    } catch (error) {
      console.error("Purchase error in useBlockchain:", error)
      throw new Error(error instanceof Error ? error.message : "Failed to purchase game")
    }
  }, [blockchain, walletState.isConnected, walletState.address])

  const completeGame = useCallback(
    async (gameId: string, score: number, maxTile: number): Promise<void> => {
      if (!walletState.isConnected) {
        throw new Error("Wallet not connected")
      }

      try {
        await blockchain.completeGame(gameId, score, maxTile)

        // Update player stats
        if (walletState.address) {
          const stats = await blockchain.getPlayerStats(walletState.address)
          setPlayerStats(stats)
        }
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to complete game")
      }
    },
    [blockchain, walletState.isConnected, walletState.address],
  )

  const refreshBalance = useCallback(async () => {
    if (!walletState.isConnected) return

    try {
      const newBalance = await blockchain.getBalance()
      setWalletState((prev) => ({ ...prev, balance: newBalance }))
    } catch (error) {
      console.error("Error refreshing balance:", error)
    }
  }, [blockchain, walletState.isConnected])

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length > 0 && blockchain.isConnected()) {
            // Auto-connect if already authorized
            await connectWallet()
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error)
        }
      }
    }

    checkConnection()
  }, [blockchain, connectWallet])

  // Listen for account and network changes
  useEffect(() => {
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected wallet
        setWalletState({
          isConnected: false,
          address: null,
          balance: null,
          isConnecting: false,
          error: null,
        })
        setPlayerStats({ totalGames: 0, bestScore: 0, totalSpent: "0 XPL" })
      } else {
        // User switched accounts
        connectWallet()
      }
    }

    const handleChainChanged = () => {
      // Reload the page when network changes
      window.location.reload()
    }

    blockchain.onAccountsChanged(handleAccountsChanged)
    blockchain.onChainChanged(handleChainChanged)

    return () => {
      blockchain.removeAllListeners()
    }
  }, [blockchain, connectWallet])

  return {
    walletState,
    playerStats,
    gamePrice,
    connectWallet,
    purchaseGame,
    completeGame,
    refreshBalance,
  }
}
