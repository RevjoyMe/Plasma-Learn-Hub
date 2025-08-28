# Plasma Learn Hub

A comprehensive blockchain-based gaming and learning platform built on the Plasma network. Features multiple games, quizzes, gamification elements, and real-time prize pool calculations.

## 🎮 Games & Features

### Core Games
- **2048 Game**: Classic sliding puzzle game with blockchain integration
- **Stablecoin Quiz**: Free educational quiz about stablecoins
- **XPL Stablecoin Quiz**: Premium quiz with unique questions and prize pool eligibility

### Gamification System
- **User Profiles**: Wallet-connected profiles with achievements and statistics
- **Achievement System**: Multiple badges (Plasma Rookie, Voyager, Master, etc.)
- **LHP Points**: Plasma Learn Hub Points earned through activities
- **Daily Login Streak**: Spinning wheel with daily rewards and streak tracking
- **Daily Quiz**: Single question quiz with cooldown system

### Leaderboard & Rewards
- **Real-time Prize Pool**: Dynamic calculation based on smart contract data
- **Weekly Rewards**: 10% of game fees distributed to top XPL Quiz players
- **Previous Winners**: Historical data of past weekly competitions
- **Multiple Leaderboards**: Global, weekly, and daily rankings

### Navigation & UI
- **Responsive Design**: Modern, minimalist interface
- **Wallet Integration**: Seamless MetaMask connection
- **Back to Menu**: Consistent navigation across all pages
- **Real-time Updates**: Live data from blockchain

## 🔗 Smart Contract Integration

### Contract Details
- **Address**: `0xB9C509d0aA9ca8B083E73531Ab06Fb81B26DC918`
- **Network**: Plasma Testnet (Chain ID: 9746)
- **Game Price**: 0.001 XPL per game
- **Prize Pool**: 10% of all game fees

### Real-time Data
- **Dynamic Prize Pool**: Calculated from actual contract transactions
- **Unique Participants**: Real-time count of unique wallet addresses
- **Weekly Statistics**: Automatic week-based filtering (Monday 00:00 UTC)
- **Fallback System**: Multi-level fallback for reliability

## 🏆 Prize Pool System

### Current Week
- **Dynamic Calculation**: Based on actual smart contract data
- **10% Distribution**: 10% of all paid game entry fees
- **Unique Participants**: Count of unique wallet addresses
- **Real-time Updates**: 5-minute caching with manual refresh

### Reward Distribution
- **1st Place**: 50% of prize pool
- **2nd Place**: 25% of prize pool
- **3rd Place**: 15% of prize pool
- **4th Place**: 7% of prize pool
- **5th Place**: 3% of prize pool

### Previous Week Data
- **Historical Winners**: Complete list of past winners
- **Distributed Amounts**: Actual amounts distributed
- **Participant Counts**: Real participant numbers

## 🎯 User Profile System

### Wallet-Connected Profiles
- **Secure Data**: All data tied to wallet address
- **Cross-Device Sync**: Consistent data across devices
- **Privacy-First**: No personal information required

### Achievement System
- **Plasma Rookie**: Awarded for first quiz/game completion
- **Plasma Voyager**: Complete 10 quizzes or games
- **Plasma Master**: Complete 50 quizzes or games
- **Streak Champion**: Maintain 7-day login streak
- **LHP Collector**: Earn 1000 Plasma LHP points
- **Quiz Expert**: Answer 100 quiz questions correctly

### Daily Features
- **Spinning Wheel**: Daily reward system with 24-hour cooldown
- **Streak Tracking**: Consecutive days with automatic reset
- **LHP Points**: Earned through various activities
- **Daily Quiz**: Single question with answer reveal

## 🧩 Quiz Systems

### Stablecoin Quiz (Free)
- **Educational Content**: Learn about stablecoins
- **No Cost**: Completely free to play
- **Leaderboard**: Track your performance

### XPL Stablecoin Quiz (Premium)
- **Unique Questions**: 20 unique questions from full pool
- **No Repetition**: Guaranteed unique questions per session
- **Prize Eligibility**: Only this quiz qualifies for weekly rewards
- **Cost**: 0.001 XPL per quiz

### Daily Quiz
- **Single Question**: One question per day
- **Cooldown System**: 24-hour answer reveal
- **LHP Rewards**: Earn points for correct answers

## 🛠️ Technical Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library
- **Icons**: Lucide React

### Blockchain
- **Network**: Plasma Network (EVM compatible)
- **Smart Contracts**: Solidity 0.8.19
- **Wallet Integration**: MetaMask/Web3
- **Data Fetching**: Real-time contract queries

### State Management
- **Local Storage**: Client-side data persistence
- **React Hooks**: Custom hooks for blockchain interaction
- **Caching**: 5-minute cache for performance
- **Error Handling**: Multi-level fallback system

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- MetaMask wallet
- Plasma testnet XPL tokens

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RevjoyMe/Plasma-Learn-Hub.git
   cd Plasma-Learn-Hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment Configuration**
   Create `.env.local` file:
   ```env
   NEXT_PUBLIC_PLASMA_CHAIN_ID=9746
   NEXT_PUBLIC_PLASMA_RPC_URL=https://testnet-rpc.plasma.to
   NEXT_PUBLIC_PLASMA_EXPLORER_URL=https://testnet.plasmascan.to
   NEXT_PUBLIC_CONTRACT_ADDRESS=0xB9C509d0aA9ca8B083E73531Ab06Fb81B26DC918
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🌐 Network Configuration

### Plasma Testnet
- **Chain ID**: 9746
- **RPC URL**: https://testnet-rpc.plasma.to
- **Explorer**: https://testnet.plasmascan.to
- **Currency**: XPL (testnet tokens)
- **Faucet**: https://faucet.plasma.to

## 🎮 How to Play

### Getting Started
1. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask
2. **Switch Network**: App will automatically add Plasma testnet
3. **Get Tokens**: Visit [Plasma faucet](https://faucet.plasma.to) for testnet XPL
4. **Choose Game**: Select from available games and quizzes

### 2048 Game
1. **Purchase Game**: Pay 0.001 XPL to start
2. **Play**: Use arrow keys or swipe gestures
3. **Complete**: Save score to blockchain and leaderboard
4. **Track Progress**: View statistics in your profile

### XPL Stablecoin Quiz
1. **Purchase Quiz**: Pay 0.001 XPL for premium quiz
2. **Answer Questions**: 20 unique questions from full pool
3. **Compete**: Your score qualifies for weekly prize pool
4. **Win Rewards**: Top 5 players receive XPL rewards

### Daily Activities
1. **Spin Wheel**: Daily reward with streak tracking
2. **Daily Quiz**: Answer one question per day
3. **Earn LHP**: Accumulate points for achievements
4. **Track Streaks**: Maintain daily login streak

## 📊 Data & Privacy

### Data Storage
- **Wallet Address**: Primary identifier for all user data
- **Local Storage**: Client-side data persistence
- **Smart Contract**: On-chain game data and statistics
- **No Personal Info**: Only wallet addresses stored

### Data Sources
- **Smart Contract**: Real-time game and transaction data
- **Event Logs**: Fallback for historical data
- **Local Storage**: User preferences and achievements
- **Leaderboards**: Game performance tracking

## 🔧 Development

### Project Structure
```
├── app/                    # Next.js app router pages
│   ├── 2048/              # 2048 game page
│   ├── leaderboard/       # Leaderboards page
│   ├── profile/           # User profile page
│   ├── quiz/              # Free stablecoin quiz
│   ├── xpl-quiz/          # Premium XPL quiz
│   ├── quests/            # Quests page (coming soon)
│   └── partnerships/      # Partnerships page (coming soon)
├── components/            # React components
│   ├── ui/                # UI component library
│   ├── game-2048.tsx      # 2048 game component
│   ├── leaderboard-rewards.tsx # Prize pool component
│   └── ...
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
│   ├── blockchain.ts      # Blockchain integration
│   ├── prize-pool-calculator.ts # Prize pool logic
│   └── ...
└── public/                # Static assets
```

### Key Features Implementation
- **Real-time Contract Data**: Direct smart contract queries
- **Fallback System**: Multi-level error handling
- **Caching**: Performance optimization
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliant components

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain responsive design
- Test blockchain interactions
- Update documentation
- Ensure accessibility compliance

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: [Plasma Learn Hub](https://plasma-learn-hub.vercel.app)
- **GitHub Repository**: [RevjoyMe/Plasma-Learn-Hub](https://github.com/RevjoyMe/Plasma-Learn-Hub)
- **Plasma Network**: [plasma.to](https://plasma.to)
- **Documentation**: [Plasma Docs](https://docs.plasma.to)

## 🆘 Support

For support, questions, or feature requests:
- Open an issue on GitHub
- Join the Plasma Discord community
- Check the documentation

---

**Built with ❤️ for the Plasma Network community**
