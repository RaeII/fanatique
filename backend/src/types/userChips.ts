export interface UserChipsBalance {
  id: number;
  user_id: number;
  balance: number;
  total_earned: number;
  total_spent: number;
  last_updated: Date;
  created_at: Date;
}

export interface UserChipsTransaction {
  id: number;
  user_id: number;
  amount: number;
  balance_before: number;
  balance_after: number;
  transaction_type: TransactionType;
  reference_id?: number;
  reference_type?: string;
  description?: string;
  transaction_hash?: string;
  created_at: Date;
}

export enum TransactionType {
  STAKE_REWARD = 'stake_reward',       // Recompensa recebida pelo staking de Fan Tokens
  BET_PLACED = 'bet_placed',           // Chips utilizados para fazer uma aposta
  BET_WON = 'bet_won',                 // Chips recebidos por ganhar uma aposta
  QUEST_REWARD = 'quest_reward',       // Recompensa recebida por completar uma missão/quest
  ADMIN_ADJUSTMENT = 'admin_adjustment', // Ajuste manual feito por um administrador
  PURCHASE = 'purchase',               // Compra realizada com Chips
  TRANSFER_IN = 'transfer_in',         // Transferência de Chips recebida de outro usuário
  TRANSFER_OUT = 'transfer_out',       // Transferência de Chips enviada para outro usuário
  OTHER = 'other'                      // Outros tipos de transações não categorizadas
}

export interface UserChipsBalanceResponse {
  id: number;
  user_id: number;
  balance: number;
  total_earned: number;
  total_spent: number;
}

export interface UserChipsTransactionResponse {
  id: number;
  user_id: number;
  amount: number;
  balance_before: number;
  balance_after: number;
  transaction_type: TransactionType;
  reference_id?: number;
  reference_type?: string;
  description?: string;
  transaction_hash?: string;
  created_at: Date;
}

export interface ChipsTransactionCreate {
  user_id: number;
  amount: number;
  transaction_type: TransactionType;
  reference_id?: number;
  reference_type?: string;
  description?: string;
  transaction_hash?: string;
}

export interface UserChipsStats {
  user_id: number;
  wallet_address: string;
  chips_balance: number;
  total_earned: number;
  total_spent: number;
  last_updated: Date;
  transaction_count: number;
  credit_transactions: number;
  debit_transactions: number;
  last_transaction_date?: Date;
} 