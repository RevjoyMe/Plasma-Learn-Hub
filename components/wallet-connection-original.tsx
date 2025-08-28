"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { getBlockchainInstance } from "@/lib/blockchain"
import { Wallet, RefreshCw } from "lucide-react"

interface WalletConnectionProps {
  onPayment: (success: boolean) => void
  gameType: "quiz" | "2048" | "xpl-quiz"
  price?: string
  isLoading?: boolean
}

export default function WalletConnection({
  onPayment,
  gameType,
  price = "0.001 XPL",
  isLoading = false,
}: WalletConnectionProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [gamePrice, setGamePrice] = useState<string>(price)
  const { toast } = useToast()

  const blockchain = getBlockchainInstance(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "")

  useEffect(() => {
    // Check if wallet is already connected
    if (blockchain.isConnected()) {
      setIsConnected(true)
      setAddress(blockchain.getCurrentAddress())
      refreshBalance()
      loadGamePrice()
    }
  }, [])

  useEffect(() => {
    setGamePrice(price)
  }, [price])

  const loadGamePrice = async () => {
    try {
      const loadedPrice = await blockchain.getGamePrice()
      setGamePrice(loadedPrice)
    } catch (error) {
      console.error("Error loading game price:", error)
      // Use the provided price as fallback
      setGamePrice(price)
    }
  }

  const connectWallet = async () => {
    setIsConnecting(true)
    setError(null)

    try {
      const { address: walletAddress, balance: walletBalance } = await blockchain.connectWallet()
      setAddress(walletAddress)
      setBalance(walletBalance)
      setIsConnected(true)
      await loadGamePrice()

      toast({
        title: "Wallet Connected! 🎉",
        description: `Connected to ${blockchain.getFormattedAddress()}`,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to connect wallet"
      setError(errorMessage)
      toast({
        title: "Connection Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const refreshBalance = async () => {
    if (!blockchain.isConnected()) return

    try {
      const newBalance = await blockchain.getBalance()
      setBalance(newBalance)
    } catch (error) {
      console.error("Error refreshing balance:", error)
    }
  }

  const purchaseGame = async () => {
    setIsPaymentProcessing(true)

    try {
      const gameId = await blockchain.purchaseGame()

      await refreshBalance()

      toast({
        title: "Payment Successful! 💰",
        description: `Game purchased successfully! Game ID: ${gameId}`,
      })

      onPayment(true)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Payment failed"
      toast({
        title: "Payment Failed",
        description: errorMessage,
        variant: "destructive",
      })
      onPayment(false)
    } finally {
      setIsPaymentProcessing(false)
    }
  }

  const getGameDisplayName = () => {
    switch (gameType) {
      case "xpl-quiz":
        return "XPL Stablecoin Quiz"
      case "quiz":
        return "Stablecoin Quiz"
      case "2048":
        return "2048 Game"
      default:
        return gameType
    }
  }

  if (!isConnected) {
    return (
      <Card className="bg-white/15 backdrop-blur-md border-white/30 p-6 shadow-2xl">
        <div className="text-center">
          <Wallet className="w-12 h-12 text-white/90 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-black">Connect Your Wallet</h3>
          <p className="mb-4 text-black">Connect your MetaMask wallet to play {getGameDisplayName()} with XPL tokens</p>
          <Button
            onClick={connectWallet}
            disabled={isConnecting}
            className="bg-white/25 hover:bg-white/35 border-white/40 font-medium text-black"
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
          {error && <p className="text-red-300 text-sm mt-2 bg-red-500/20 p-2 rounded">{error}</p>}
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-white/15 backdrop-blur-md border-white/30 p-6 shadow-2xl">
      <div className="space-y-4">
        <div className="flex items-center justify-between text-black">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full shadow-lg"></div>
            <div>
              <p className="font-medium text-black">{blockchain.getFormattedAddress()}</p>
              <p className="text-sm text-black">{balance}</p>
            </div>
          </div>
          <Button
            onClick={refreshBalance}
            variant="ghost"
            size="sm"
            className="text-white/90 hover:text-white hover:bg-white/15"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        <div className="border-t border-white/30 pt-4">
          <div className="text-center mb-4">
            <div className="text-lg font-semibold text-black">Play {getGameDisplayName()}</div>
            <div className="text-sm text-black">Purchase game session with XPL tokens</div>
            <div className="text-xs mt-1 text-black">Price: {gamePrice}</div>
          </div>

          <Button
            onClick={purchaseGame}
            disabled={isPaymentProcessing || isLoading}
            className="w-full bg-white/25 hover:bg-white/35 border-white/40 font-medium text-black"
          >
            {isPaymentProcessing || isLoading ? "Processing Payment..." : `Purchase Game Session (${gamePrice})`}
          </Button>
        </div>
      </div>
    </Card>
  )
}
