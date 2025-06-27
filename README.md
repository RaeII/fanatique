<div align="center">
  <img src="./frontend/public/logo-header.png" alt="Fanatique" width="200"/>
  <p>Acess: 🔗<span style="font-size: 4em;"><a href="http://144.126.217.221:4173//" target="_blank">FANATIQUE APP</a></span></p>
  <h3>Gamify your Fan Token staking with strategic bets and exclusive rewards.</h3>
</div>

## 📱 Sobre

Fanatique é uma plataforma de staking gamificada construída na **Chiliz Chain**, projetada especificamente para fãs de esportes. Os usuários fazem stake de seus Fan Tokens, ganham recompensas e recebem **$CHIPS** (nossa moeda interna), que podem ser usados para apostar estrategicamente em eventos esportivos.

Cada aposta é uma batalha tática onde os jogadores usam **cartas NFT exclusivas** com habilidades únicas como buffs para multiplicar recompensas, defesas para proteger apostas e modificadores que podem alterar completamente o curso das previsões. Ao vencer apostas, os usuários ganham prêmios reais e acumulam **$REP**, um sistema de reputação não-transferível que desbloqueia novas conquistas e acesso a cartas ainda mais raras e poderosas.

### Principais recursos

- **Staking de Fan Tokens**: Faça stake e ganhe $CHIPS para apostar
- **Sistema de Cartas NFT**: Use cartas estratégicas com habilidades únicas em suas apostas
- **Apostas P2P**: Crie torneios personalizados e aposte contra outros usuários
- **Odds Oficiais**: Participe de apostas oficiais com prêmios reais (Fan Tokens, NFTs, $CHZ)
- **Sistema de Reputação**: Acumule $REP para desbloquear conquistas e rankings
- **Integração Discord**: Gerencie torneios e receba notificações diretamente no Discord

## 🔧 Tecnologia

### **Stack Tecnológico Avançado**

#### **Frontend (React + Web3)**
- **React 19** com Vite para desenvolvimento ultra-rápido e HMR otimizado
- **Wagmi v2** + **Viem** para interações Web3 type-safe e performáticas
- **Ethers.js v6** para comunicação direta com smart contracts
- **TailwindCSS** com sistema de design customizado e tema dark/light
- **Framer Motion** para animações suaves e transições cinematográficas
- **React Three Fiber** para renderização 3D de NFTs e efeitos visuais
- **i18next** para internacionalização completa (PT-BR/EN)
- **React Hot Toast** para notificações em tempo real
- **Radix UI** para componentes acessíveis e primitivos de alta qualidade

#### **Backend (Node.js + Blockchain)**
- **TypeScript** com paths mapeados e tipagem estrita
- **Express.js** com middleware de validação e autenticação JWT
- **Hardhat** para desenvolvimento, teste e deploy de smart contracts
- **TypeChain** para tipagem automática de contratos Solidity
- **MySQL2** para persistência de dados off-chain otimizada
- **Winston** para logging estruturado e monitoramento
- **Ethers.js v6** para interações blockchain server-side
- **OpenZeppelin Contracts** para padrões de segurança auditados

#### **Blockchain & Smart Contracts**
- **Solidity 0.8.24** com otimizações IR habilitadas
- **Chiliz Chain (Mainnet)** - EVM compatível com gas otimizado
- **Chiliz Spicy (Testnet)** para desenvolvimento e testes
- **OpenZeppelin** para padrões ERC-20, ERC-721 e segurança
- **Hardhat Gas Reporter** para otimização de custos de transação

## 🏗️ Arquitetura Técnica

### **Arquitetura Híbrida Web2/Web3**

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

- **Fanatique.sol**: Contrato principal para staking e governança
- **FanatiqueCards.sol**: Sistema NFT para cartas estratégicas com raridade
- **FanToken.sol**: Interface para tokens de clubes esportivos
- **Fan.sol**: Implementação de token utilitário $CHIPS
- **ERC20 Stablecoins**: Suporte para BRZ, USDC, EURC

### **Otimizações de Performance**

#### **Frontend**
- **Code Splitting** automático com Vite
- **Tree Shaking** para bundles otimizados
- **Lazy Loading** de componentes e rotas
- **Service Workers** para cache inteligente
- **WebGL** para renderização 3D otimizada

#### **Backend**
- **Connection Pooling** MySQL otimizado
- **JWT Stateless** para escalabilidade horizontal
- **Middleware de Cache** para dados frequentes
- **Rate Limiting** para proteção contra spam
- **Compression** gzip para responses otimizadas

#### **Blockchain**
- **Gas Optimization** com Solidity IR
- **Batch Transactions** para operações múltiplas
- **Event Indexing** para queries eficientes
- **Proxy Patterns** para upgrades de contratos

## 🔗 Contratos (Mainnet)

| Contrato | Endereço |
|----------|----------|
| BRZ | `0xF82C4B7EaFEA0352555aEd0e64127baE29fE04ab` |
| EURC | `0x3559C11Bd82B35A216efD5C9dbc22C68BC8157a9` |
| USDC | `0x8205ebfb281bF69DBD154a5A2B2FA2BE8f5929cC` |
| FANTOKEN TEST | `0x0703a1299d322C79a2e338B928172961c6a81569` |
| FANATIQUE | `0x72bb99Daad0Eb0d96ccea323f39eAEb995E449c0` |

## 🚀 Como começar

```bash
# Clone o repositório
git clone git@github.com:RaeII/fanatique.git


# Entre na pasta do frontend
cd fanatique/frontend
yarn install
# Inicie o ambiente de desenvolvimento
yarn dev

# Instale as dependências
cd fanatique/backend
yarn install
# Inicie o ambiente de desenvolvimento
yarn dev


```
---

<div>
  <p>🏆 Stake To Play 🏆</p>
</div>
