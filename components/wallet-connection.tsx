"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, RefreshCw, Coins } from "lucide-react"

interface WalletConnectionProps {
  isConnected: boolean
  address: string | null
  balance: string | null
  isConnecting: boolean
  error: string | null
  onConnect: () => Promise<void>
  onRefreshBalance: () => Promise<void>
  gameType?: string
  price?: string
  onPayment?: () => Promise<void>
}

export function WalletConnection({
  isConnected,
  address,
  balance,
  isConnecting,
  error,
  onConnect,
  onRefreshBalance,
  gameType,
  price,
  onPayment,
}: WalletConnectionProps) {
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  if (!isConnected) {
    return (
      <Card className="bg-white border-gray-200 shadow-lg p-6">
        <div className="text-center">
          <Wallet className="w-12 h-12 text-teal-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2 text-gray-900">Connect Your Wallet</h3>
          <p className="mb-4 text-gray-600">Connect your MetaMask wallet to play games with XPL tokens</p>
          <Button onClick={onConnect} disabled={isConnecting} className="bg-teal-600 hover:bg-teal-700 text-white">
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
          {error && <p className="text-red-600 text-sm mt-2 bg-red-50 p-2 rounded border border-red-200">{error}</p>}
        </div>
      </Card>
    )
  }

  if (gameType && onPayment) {
    return (
      <Card className="bg-white border-gray-200 shadow-lg p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full shadow-lg"></div>
              <div>
                <p className="font-medium text-gray-900">{address ? formatAddress(address) : "Unknown"}</p>
                <p className="text-sm text-gray-600">{balance || "0 XPL"}</p>
              </div>
            </div>
            <Button
              onClick={onRefreshBalance}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Coins className="w-6 h-6 text-yellow-500" />
                <div className="text-lg font-semibold text-gray-900">Price: {price}</div>
              </div>
              <Button
                onClick={onPayment}
                disabled={isConnecting}
                className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white"
              >
                {isConnecting ? "Processing..." : "Start Game"}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-white border-gray-200 shadow-lg p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-400 rounded-full shadow-lg"></div>
            <div>
              <p className="font-medium text-gray-900">{address ? formatAddress(address) : "Unknown"}</p>
              <p className="text-sm text-gray-600">{balance || "0 XPL"}</p>
            </div>
          </div>
          <Button
            onClick={onRefreshBalance}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">Wallet Connected</div>
            <div className="text-sm text-gray-600">Ready to play blockchain games</div>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default WalletConnection
