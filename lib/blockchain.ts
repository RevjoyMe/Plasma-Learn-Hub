"use client"

import { ethers } from "ethers"

const PLASMA_NETWORK = {
  chainId: `0x${Number.parseInt(process.env.NEXT_PUBLIC_PLASMA_CHAIN_ID || "9746").toString(16)}`, // Convert to hex
  chainName: "Plasma Network",
  nativeCurrency: {
    name: "XPL",
    symbol: "XPL",
    decimals: 18,
  },
  rpcUrls: [process.env.NEXT_PUBLIC_PLASMA_RPC_URL || "https://testnet-rpc.plasma.to"],
  blockExplorerUrls: [process.env.NEXT_PUBLIC_PLASMA_EXPLORER_URL || "https://testnet.plasmascan.to"],
}

// Smart contract ABI (simplified version)
const GAME_CONTRACT_ABI = [
  "function purchaseGame() external payable returns (uint256)",
  "function completeGame(uint256 gameId, uint256 score, uint256 maxTile) external",
  "function getPlayerStats(address player) external view returns (uint256, uint256, uint256)",
  "function gamePrice() external view returns (uint256)",
  "event GamePurchased(address indexed player, uint256 indexed gameId, uint256 price)",
  "event GameCompleted(address indexed player, uint256 indexed gameId, uint256 score, uint256 maxTile)",
]

export class PlasmaBlockchain {
  private provider: ethers.BrowserProvider | null = null
  private signer: ethers.JsonRpcSigner | null = null
  private contract: ethers.Contract | null = null
  private contractAddress = ""
  private currentAddress: string | null = null

  constructor(contractAddress: string) {
    this.contractAddress = contractAddress
  }

  async connectWallet(): Promise<{ address: string; balance: string }> {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed")
    }

    try {
      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" })

      // Initialize provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum)
      this.signer = await this.provider.getSigner()

      // Add/Switch to Plasma network
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: PLASMA_NETWORK.chainId }],
        })
      } catch (switchError: any) {
        // Network doesn't exist, add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [PLASMA_NETWORK],
          })
        } else {
          throw switchError
        }
      }

      // Initialize contract
      this.contract = new ethers.Contract(this.contractAddress, GAME_CONTRACT_ABI, this.signer)

      // Get address and balance
      const address = await this.signer.getAddress()
      this.currentAddress = address
      const balance = await this.provider.getBalance(address)
      const balanceInXPL = ethers.formatEther(balance)

      return {
        address: address,
        balance: `${Number.parseFloat(balanceInXPL).toFixed(4)} XPL`,
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      throw new Error(`Failed to connect wallet: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async purchaseGame(): Promise<string> {
    if (!this.contract || !this.signer) {
      throw new Error("Wallet not connected")
    }

    try {
      console.log("Getting game price...")
      // Get game price
      const gamePrice = await this.contract.gamePrice()
      console.log("Game price:", ethers.formatEther(gamePrice), "XPL")

      console.log("Calling purchaseGame contract method...")
      // Purchase game
      const tx = await this.contract.purchaseGame({ value: gamePrice })
      console.log("Transaction sent:", tx.hash)
      
      console.log("Waiting for transaction confirmation...")
      const receipt = await tx.wait()
      console.log("Transaction confirmed:", receipt.hash)

      // Extract game ID from event logs
      const gameId = this.extractGameIdFromReceipt(receipt)
      console.log("Extracted game ID:", gameId)

      return gameId
    } catch (error) {
      console.error("Error purchasing game:", error)
      throw new Error(`Failed to purchase game: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async completeGame(gameId: string, score: number, maxTile: number): Promise<void> {
    if (!this.contract) {
      throw new Error("Wallet not connected")
    }

    try {
      const tx = await this.contract.completeGame(gameId, score, maxTile)
      await tx.wait()
    } catch (error) {
      console.error("Error completing game:", error)
      throw new Error("Failed to complete game")
    }
  }

  async getPlayerStats(address: string): Promise<{ totalGames: number; bestScore: number; totalSpent: string }> {
    if (!this.contract) {
      throw new Error("Wallet not connected")
    }

    try {
      const targetAddress = address || this.currentAddress
      if (!targetAddress) {
        throw new Error("No address available")
      }

      const cleanAddress = targetAddress.startsWith("0x") ? targetAddress : `0x${targetAddress}`

      if (!ethers.isAddress(cleanAddress) || cleanAddress.includes("...")) {
        throw new Error(`Invalid address format: ${address}`)
      }

      const [totalGames, bestScore, totalSpent] = await this.contract.getPlayerStats(cleanAddress)

      return {
        totalGames: Number(totalGames),
        bestScore: Number(bestScore),
        totalSpent: `${ethers.formatEther(totalSpent)} XPL`,
      }
    } catch (error) {
      console.error("Error getting player stats:", error)
      return { totalGames: 0, bestScore: 0, totalSpent: "0 XPL" }
    }
  }

  async getGamePrice(): Promise<string> {
    if (!this.contract) {
      throw new Error("Wallet not connected")
    }

    try {
      const price = await this.contract.gamePrice()
      return `${ethers.formatEther(price)} XPL`
    } catch (error) {
      console.error("Error getting game price:", error)
      return "0.001 XPL"
    }
  }

  async getBalance(): Promise<string> {
    if (!this.provider || !this.signer) {
      throw new Error("Wallet not connected")
    }

    try {
      const address = await this.signer.getAddress()
      const balance = await this.provider.getBalance(address)
      return `${Number.parseFloat(ethers.formatEther(balance)).toFixed(4)} XPL`
    } catch (error) {
      console.error("Error getting balance:", error)
      return "0 XPL"
    }
  }

  isConnected(): boolean {
    return this.provider !== null && this.signer !== null && this.contract !== null
  }

  getFormattedAddress(): string {
    if (!this.currentAddress) return ""
    return this.formatAddress(this.currentAddress)
  }

  getCurrentAddress(): string | null {
    return this.currentAddress
  }

  private formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  private extractGameIdFromReceipt(receipt: any): string {
    for (const log of receipt.logs) {
      try {
        const parsedLog = this.contract?.interface.parseLog(log)
        if (parsedLog?.name === "GamePurchased") {
          return parsedLog.args.gameId.toString()
        }
      } catch (error) {}
    }

    return Math.random().toString(36).substr(2, 9)
  }

  onAccountsChanged(callback: (accounts: string[]) => void): void {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", callback)
    }
  }

  onChainChanged(callback: (chainId: string) => void): void {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", callback)
    }
  }

  removeAllListeners(): void {
    if (window.ethereum) {
      window.ethereum.removeAllListeners("accountsChanged")
      window.ethereum.removeAllListeners("chainChanged")
    }
  }
}

let blockchainInstance: PlasmaBlockchain | null = null

export function getBlockchainInstance(contractAddress = ""): PlasmaBlockchain {
  if (!blockchainInstance) {
    blockchainInstance = new PlasmaBlockchain(contractAddress)
  }
  return blockchainInstance
}

declare global {
  interface Window {
    ethereum?: any
  }
}
