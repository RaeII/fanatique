<div align="center">
  <img src="./frontend/public/logo-header.png" alt="Fanatique" width="200"/>
  <p>Access: 🔗<span style="font-size: 4em;"><a href="http://144.126.217.221:4173//" target="_blank">FANATIQUE APP</a></span></p>
  <h3>Gamify your Fan Token staking with strategic bets and exclusive rewards.</h3>
</div>

## 📱 About

Fanatique is a gamified staking platform built on the **Chiliz Chain**, specifically designed for sports fans. Users stake their Fan Tokens, earn rewards, and receive **$CHIPS** (our internal currency), which can be used to strategically bet on sporting events.

Each bet is a tactical battle where players use **exclusive NFT cards** with unique abilities such as buffs to multiply rewards, defenses to protect bets, and modifiers that can completely alter the course of predictions. By winning bets, users earn real prizes and accumulate **$REP**, a non-transferable reputation system that unlocks new achievements and access to even rarer and more powerful cards.

### Key Features

- **Fan Token Staking**: Stake and earn $CHIPS to bet
- **NFT Card System**: Use strategic cards with unique abilities in your bets
- **P2P Betting**: Create custom tournaments and bet against other users
- **Official Odds**: Participate in official bets with real prizes (Fan Tokens, NFTs, $CHZ)
- **Reputation System**: Accumulate $REP to unlock achievements and rankings
- **Discord Integration**: Manage tournaments and receive notifications directly on Discord

## 🔧 Technology

### **Advanced Technology Stack**

#### **Frontend (React + Web3)**
- **React 19** with Vite for ultra-fast development and optimized HMR
- **Wagmi v2** + **Viem** for type-safe and performant Web3 interactions
- **Ethers.js v6** for direct communication with smart contracts
- **TailwindCSS** with custom design system and dark/light theme
- **Framer Motion** for smooth animations and cinematic transitions
- **React Three Fiber** for 3D rendering of NFTs and visual effects
- **i18next** for complete internationalization (PT-BR/EN)
- **React Hot Toast** for real-time notifications
- **Radix UI** for accessible components and high-quality primitives

#### **Backend (Node.js + Blockchain)**
- **TypeScript** with mapped paths and strict typing
- **Express.js** with validation middleware and JWT authentication
- **Hardhat** for smart contract development, testing, and deployment
- **TypeChain** for automatic typing of Solidity contracts
- **MySQL2** for optimized off-chain data persistence
- **Winston** for structured logging and monitoring
- **Ethers.js v6** for server-side blockchain interactions
- **OpenZeppelin Contracts** for audited security standards

#### **Blockchain & Smart Contracts**
- **Solidity 0.8.24** with IR optimizations enabled
- **Chiliz Chain (Mainnet)** - EVM compatible with optimized gas
- **Chiliz Spicy (Testnet)** for development and testing
- **OpenZeppelin** for ERC-20, ERC-721 standards and security
- **Hardhat Gas Reporter** for transaction cost optimization

## 🏗️ Technical Architecture

### **Hybrid Web2/Web3 Architecture**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend       │    │  Chiliz Chain   │
│   React + Web3  │◄──►│  Node.js + API   │◄──►│ Smart Contracts │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Wallet Connect  │    │   MySQL DB       │    │   IPFS/Arweave  │
│ MetaMask/WC     │    │ Off-chain Data   │    │   NFT Metadata  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### **Smart Contracts Ecosystem**

- **Fanatique.sol**: Main contract for staking and governance
- **FanatiqueCards.sol**: NFT system for strategic cards with rarity
- **FanToken.sol**: Interface for sports club tokens
- **Fan.sol**: $CHIPS utility token implementation
- **ERC20 Stablecoins**: Support for BRZ, USDC, EURC

### **Performance Optimizations**

#### **Frontend**
- **Code Splitting** automatic with Vite
- **Tree Shaking** for optimized bundles
- **Lazy Loading** of components and routes
- **Service Workers** for smart caching
- **WebGL** for optimized 3D rendering

#### **Backend**
- **Connection Pooling** optimized MySQL
- **JWT Stateless** for horizontal scalability
- **Cache Middleware** for frequent data
- **Rate Limiting** for spam protection
- **Compression** gzip for optimized responses

#### **Blockchain**
- **Gas Optimization** with Solidity IR
- **Batch Transactions** for multiple operations
- **Event Indexing** for efficient queries
- **Proxy Patterns** for contract upgrades

## 🔗 Contracts (Testnet)

| Contract | Address |
|----------|----------|
| FANATIQUE | `0x72bb99Daad0Eb0d96ccea323f39eAEb995E449c0` |
| FANTOKEN TEST | `0x0703a1299d322C79a2e338B928172961c6a81569` |
| BRZ | `0xF82C4B7EaFEA0352555aEd0e64127baE29fE04ab` |
| EURC | `0x3559C11Bd82B35A216efD5C9dbc22C68BC8157a9` |
| USDC | `0x8205ebfb281bF69DBD154a5A2B2FA2BE8f5929cC` |


## 🚀 Getting Started

```bash
# Clone the repository
git clone git@github.com:RaeII/fanatique.git

# Enter the frontend folder
cd fanatique/frontend
yarn install
# Start the development environment
yarn dev

# Install dependencies
cd fanatique/backend
yarn install
# Start the development environment
yarn dev
```
---

<div align="center">
  <b>🏆 Stake To Play 🏆</b>
</div>
