/* eslint-disable @typescript-eslint/no-explicit-any */
import { createBindParams } from '@/helpers/util';
import Database from './Database';
import { 
  UserChipsBalance, 
  UserChipsTransaction, 
  ChipsTransactionCreate,
  UserChipsStats
} from '../types/userChips';

class UserChipsDatabase extends Database {

  async getUserBalance(userId: number): Promise<UserChipsBalance | null> {
    const rows: any = await this.query(
      'SELECT * FROM user_chips_balance WHERE user_id = ?;', 
      [userId]
    );

    return rows[0]?.length > 0 ? rows[0][0] as UserChipsBalance : null;
  }

  async createUserBalance(userId: number): Promise<any> {
    return await this.query(
      'INSERT INTO user_chips_balance (user_id, balance, total_earned, total_spent) VALUES (?, 0, 0, 0);', 
      [userId]
    );
  }

  async getUserTransactions(userId: number, limit: number = 20, offset: number = 0): Promise<UserChipsTransaction[]> {
    const rows: any = await this.query(
      'SELECT * FROM user_chips_transaction WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?;', 
      [userId, limit, offset]
    );

    return rows[0] || [];
  }

  async getTransactionById(transactionId: number): Promise<UserChipsTransaction | null> {
    const rows: any = await this.query(
      'SELECT * FROM user_chips_transaction WHERE id = ?;', 
      [transactionId]
    );

    return rows[0]?.length > 0 ? rows[0][0] as UserChipsTransaction : null;
  }

  async processTransaction(data: ChipsTransactionCreate): Promise<any> {
    // Usamos a stored procedure para processar a transação
    const result: any = await this.query(
      'CALL ProcessChipsTransaction(?, ?, ?, ?, ?, ?, ?);',
      [
        data.user_id,
        data.amount,
        data.transaction_type,
        data.reference_id || null,
        data.reference_type || null,
        data.description || null,
        data.transaction_hash || null
      ]
    );
    
    return result[0][0];
  }

  async getUserChipsStats(userId: number): Promise<UserChipsStats | null> {
    const rows: any = await this.query(
      'SELECT * FROM v_user_chips_stats WHERE user_id = ?;', 
      [userId]
    );

    return rows[0]?.length > 0 ? rows[0][0] as UserChipsStats : null;
  }

  async getAllUsersChipsStats(limit: number = 20, offset: number = 0): Promise<UserChipsStats[]> {
    const rows: any = await this.query(
      'SELECT * FROM v_user_chips_stats ORDER BY chips_balance DESC LIMIT ? OFFSET ?;', 
      [limit, offset]
    );

    return rows[0] || [];
  }

  async getTransactionsByType(
    transactionType: string, 
    limit: number = 20, 
    offset: number = 0
  ): Promise<UserChipsTransaction[]> {
    const rows: any = await this.query(
      'SELECT * FROM user_chips_transaction WHERE transaction_type = ? ORDER BY created_at DESC LIMIT ? OFFSET ?;', 
      [transactionType, limit, offset]
    );

    return rows[0] || [];
  }

  async getTransactionsByReference(
    referenceType: string, 
    referenceId: number
  ): Promise<UserChipsTransaction[]> {
    const rows: any = await this.query(
      'SELECT * FROM user_chips_transaction WHERE reference_type = ? AND reference_id = ? ORDER BY created_at DESC;', 
      [referenceType, referenceId]
    );

    return rows[0] || [];
  }
}

export default UserChipsDatabase; 