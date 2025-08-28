"use client"

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, Shield, Coins, Trophy } from "lucide-react"

interface WalletConnectPromptProps {
  onConnect: () => void
  isLoading?: boolean
}

export function WalletConnectPrompt({ onConnect, isLoading = false }: WalletConnectPromptProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Wallet className="w-12 h-12 text-teal-600 mr-4" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Connect Your Wallet</h1>
              <p className="text-xl text-gray-600">Access your personalized profile and achievements</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-teal-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-4">Secure & Private</CardTitle>
              <p className="text-gray-600 mb-6">
                Your profile data is securely linked to your wallet address, ensuring privacy and consistency across devices.
              </p>
              <div className="text-sm text-gray-500">
                <p>• No personal information required</p>
                <p>• Data tied to your wallet address</p>
                <p>• Access from any device</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-yellow-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-4">Track Progress</CardTitle>
              <p className="text-gray-600 mb-6">
                View your achievements, LHP points, daily streaks, and gaming statistics all in one place.
              </p>
              <div className="text-sm text-gray-500">
                <p>• Achievement badges</p>
                <p>• Daily reward wheel</p>
                <p>• Gaming statistics</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Wallet className="w-10 h-10 text-teal-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Connect?</h2>
            <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
              Connect your crypto wallet to access your personalized profile, track your achievements, 
              and manage your Plasma LHP points. Your data will be securely linked to your wallet address.
            </p>
            
            <div className="space-y-4">
              <Button
                onClick={onConnect}
                disabled={isLoading}
                className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="w-5 h-5 mr-2" />
                    Connect Wallet
                  </>
                )}
              </Button>
              
              <div className="text-sm text-gray-600">
                <p>Supported: MetaMask, WalletConnect, and other Web3 wallets</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
