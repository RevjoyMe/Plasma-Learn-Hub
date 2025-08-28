// Test script for contract interaction
import { getBlockchainInstance } from "./blockchain"

export async function testContractConnection() {
  try {
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0xB9C509d0aA9ca8B083E73531Ab06Fb81B26DC918"
    console.log("Testing contract connection...")
    console.log("Contract address:", contractAddress)
    
    const blockchain = getBlockchainInstance(contractAddress)
    
    // Test getting game price
    try {
      const gamePrice = await blockchain.getGamePrice()
      console.log("✅ Game price:", gamePrice)
    } catch (error) {
      console.log("❌ Failed to get game price:", error)
    }
    
    // Test getting weekly stats
    const weekStart = Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60) // 1 week ago
    try {
      const weeklyData = await blockchain.getWeeklyPrizePoolData(weekStart)
      console.log("✅ Weekly data:", weeklyData)
    } catch (error) {
      console.log("❌ Failed to get weekly data:", error)
    }
    
  } catch (error) {
    console.error("❌ Contract test failed:", error)
  }
}
