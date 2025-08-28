# Plasma 2048 Game

A blockchain-based 2048 game built on the Plasma network using Next.js and Solidity smart contracts.

## Features

- 🎮 Classic 2048 game mechanics
- 🔗 Blockchain integration with Plasma network
- 💰 Pay-to-play model with XPL tokens
- 📊 Player statistics tracking
- 🏆 Best score tracking on-chain

## Smart Contract

The game uses a smart contract deployed on Plasma testnet:
- **Contract Address**: `0xB9C509d0aA9ca8B083E73531Ab06Fb81B26DC918`
- **Network**: Plasma Testnet (Chain ID: 9746)
- **Game Price**: 0.001 XPL per game

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd plasma-2048-fix
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   NEXT_PUBLIC_PLASMA_CHAIN_ID=9746
   NEXT_PUBLIC_PLASMA_RPC_URL=https://testnet-rpc.plasma.to
   NEXT_PUBLIC_PLASMA_EXPLORER_URL=https://testnet.plasmascan.to
   NEXT_PUBLIC_CONTRACT_ADDRESS=0xB9C509d0aA9ca8B083E73531Ab06Fb81B26DC918
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## How to Play

1. **Connect your wallet** (MetaMask or similar)
2. **Switch to Plasma testnet** (the app will help you add the network)
3. **Get testnet XPL tokens** from the [Plasma faucet](https://faucet.plasma.to)
4. **Purchase a game** for 0.001 XPL
5. **Play 2048** using arrow keys or swipe gestures
6. **Complete the game** to save your score on-chain

## Game Rules

- Use arrow keys or swipe to move tiles
- Tiles with the same number merge when they collide
- Reach the 2048 tile to win
- Game ends when no more moves are possible

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Plasma Network (EVM compatible)
- **Smart Contracts**: Solidity 0.8.19
- **Wallet Integration**: MetaMask/Web3

## Network Configuration

### Plasma Testnet
- **Chain ID**: 9746
- **RPC URL**: https://testnet-rpc.plasma.to
- **Explorer**: https://testnet.plasmascan.to
- **Currency**: XPL (testnet tokens)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License
