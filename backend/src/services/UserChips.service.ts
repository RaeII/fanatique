import { getErrorMessage } from '@/helpers/response_collection';
import UserChipsDatabase from '@/database/UserChips.database';
import { 
  UserChipsBalance, 
  UserChipsTransaction, 
  ChipsTransactionCreate,
  TransactionType,
  UserChipsStats
} from '../types/userChips';
import Database from '@/database/Database';

class UserChipsService {
  private database: UserChipsDatabase;

  constructor() {
    this.database = new UserChipsDatabase();
  }

  async getUserBalance(userId: number): Promise<UserChipsBalance> {
    if (!userId) throw Error(getErrorMessage('missingField', 'ID do usuário'));

    let balance = await this.database.getUserBalance(userId);
    
    // Se o usuário não tiver um registro de saldo, criar um
    if (!balance) {
      await this.database.createUserBalance(userId);
      balance = await this.database.getUserBalance(userId);
      
      if (!balance) {
        throw Error(getErrorMessage('errorCreating', 'saldo de $CHIPS'));
      }
    }
    
    return balance;
  }

  async getUserTransactions(userId: number, limit: number = 20, offset: number = 0): Promise<UserChipsTransaction[]> {
    if (!userId) throw Error(getErrorMessage('missingField', 'ID do usuário'));

    return await this.database.getUserTransactions(userId, limit, offset);
  }

  async getTransactionById(transactionId: number): Promise<UserChipsTransaction> {
    if (!transactionId) throw Error(getErrorMessage('missingField', 'ID da transação'));

    const transaction = await this.database.getTransactionById(transactionId);
    
    if (!transaction) {
      throw Error(getErrorMessage('registryNotFound', 'Transação'));
    }
    
    return transaction;
  }

  async processTransaction(data: ChipsTransactionCreate): Promise<{ new_balance: number }> {
    
    if (!data.user_id) throw Error(getErrorMessage('missingField', 'ID do usuário'));
    if (data.amount === undefined || data.amount === null) throw Error(getErrorMessage('missingField', 'Valor da transação'));
    if (!data.transaction_type) throw Error(getErrorMessage('missingField', 'Tipo da transação'));

    const result = await this.database.processTransaction(data);
      
    return result;
 
  }

  async addChips(
    userId: number, 
    amount: number, 
    transactionType: TransactionType, 
    referenceId?: number, 
    referenceType?: string, 
    description?: string,
    transactionHash?: string
  ): Promise<{ new_balance: number }> {
    if (amount <= 0) throw Error('O valor deve ser maior que zero para adicionar $CHIPS');
    
    return this.processTransaction({
      user_id: userId,
      amount,
      transaction_type: transactionType,
      reference_id: referenceId,
      reference_type: referenceType,
      description,
      transaction_hash: transactionHash
    });
  }

  async removeChips(
    userId: number, 
    amount: number, 
    transactionType: TransactionType, 
    referenceId?: number, 
    referenceType?: string, 
    description?: string,
    transactionHash?: string
  ): Promise<{ new_balance: number }> {

    if (amount <= 0) throw Error('O valor deve ser maior que zero para remover $CHIPS');
    
    // Convertemos para valor negativo para débito
    return this.processTransaction({
      user_id: userId,
      amount: -amount,
      transaction_type: transactionType,
      reference_id: referenceId,
      reference_type: referenceType,
      description,
      transaction_hash: transactionHash
    });
  }

  async getUserChipsStats(userId: number): Promise<UserChipsStats> {
    if (!userId) throw Error(getErrorMessage('missingField', 'ID do usuário'));

    const stats = await this.database.getUserChipsStats(userId);
    
    if (!stats) {
      throw Error(getErrorMessage('registryNotFound', 'Estatísticas de $CHIPS'));
    }
    
    return stats;
  }

  async getAllUsersChipsStats(limit: number = 20, offset: number = 0): Promise<UserChipsStats[]> {
    return await this.database.getAllUsersChipsStats(limit, offset);
  }

  async getTransactionsByType(
    transactionType: string, 
    limit: number = 20, 
    offset: number = 0
  ): Promise<UserChipsTransaction[]> {
    if (!transactionType) throw Error(getErrorMessage('missingField', 'Tipo de transação'));

    return await this.database.getTransactionsByType(transactionType, limit, offset);
  }

  async getTransactionsByReference(
    referenceType: string, 
    referenceId: number
  ): Promise<UserChipsTransaction[]> {
    if (!referenceType) throw Error(getErrorMessage('missingField', 'Tipo de referência'));
    if (!referenceId) throw Error(getErrorMessage('missingField', 'ID de referência'));

    return await this.database.getTransactionsByReference(referenceType, referenceId);
  }
}

export default UserChipsService; 