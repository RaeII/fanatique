import { Request, Response } from 'express';

import { getErrorMessage, getSuccessMessage } from '@/helpers/response_collection';
import Controller from './Controller';
import UserChipsService from '@/services/UserChips.service';
import { TransactionType } from '@/types/userChips';

// Estendendo o tipo Request para incluir o user
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    [key: string]: any;
  };
}

class UserChipsController extends Controller {
  private service: UserChipsService;

  constructor() {
    super();
    this.service = new UserChipsService();
  }

  async getUserBalance(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      
      const balance = await this.service.getUserBalance(userId);
      
      return this.sendSuccessResponse(res, { content: balance });
    } catch (err) {
      return await this.sendErrorMessage(res, err);
    }
  }

  async getCurrentUserBalance(req: AuthenticatedRequest, res: Response) {
    try {
      const userId: number = Number(res.locals.jwt.user_id);

      console.log({userId});
      
      if (!userId) {
        return this.sendErrorMessage(res, new Error(getErrorMessage('unauthorized')));
      }
      
      const balance = await this.service.getUserBalance(userId);
      
      return this.sendSuccessResponse(res, { content: balance });
    } catch (err) {
      return await this.sendErrorMessage(res, err);
    }
  }

  async getUserTransactions(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const limit = Number(req.query.limit) || 20;
      const offset = Number(req.query.offset) || 0;
      
      const transactions = await this.service.getUserTransactions(userId, limit, offset);
      
      return this.sendSuccessResponse(res, { content: transactions });
    } catch (err) {
      return await this.sendErrorMessage(res, err);
    }
  }

  async getCurrentUserTransactions(req: AuthenticatedRequest, res: Response) {
    try {

      const userId: number = Number(res.locals.jwt.user_id);
      
      if (!userId) {
        return this.sendErrorMessage(res, new Error(getErrorMessage('unauthorized')));
      }
      
      const limit = Number(req.query.limit) || 20;
      const offset = Number(req.query.offset) || 0;
      
      const transactions = await this.service.getUserTransactions(userId, limit, offset);
      
      return this.sendSuccessResponse(res, { content: transactions });
    } catch (err) {
      return await this.sendErrorMessage(res, err);
    }
  }

  async getTransactionById(req: Request, res: Response) {
    try {
      const transactionId = Number(req.params.id);
      
      const transaction = await this.service.getTransactionById(transactionId);
      
      return this.sendSuccessResponse(res, { content: transaction });
    } catch (err) {
      return await this.sendErrorMessage(res, err);
    }
  }

  async addChips(req: Request, res: Response) {
    try {
      const { 
        amount, 
        transaction_type, 
        reference_id, 
        reference_type, 
        description,
        transaction_hash 
      } = req.body;

      const userId: number = Number(res.locals.jwt.user_id);
      
      if (!userId) {
        return this.sendErrorMessage(res, new Error(getErrorMessage('missingField', 'ID do usuário')));
      }
      
      if (!amount || amount <= 0) {
        return this.sendErrorMessage(res, new Error(getErrorMessage('missingField', 'Valor válido')));
      }
      
      if (!transaction_type) {
        return this.sendErrorMessage(res, new Error(getErrorMessage('missingField', 'Tipo da transação')));
      }
      
      const result = await this.service.addChips(
        userId,
        amount,
        transaction_type as TransactionType,
        reference_id,
        reference_type,
        description,
        transaction_hash
      );
      
      return this.sendSuccessResponse(res, { 
        content: result, 
        message: getSuccessMessage('create', '$CHIPS adicionados') 
      });
    } catch (err) {
      return await this.sendErrorMessage(res, err);
    }
  }

  async removeChips(req: Request, res: Response) {
    try {
      const { 
        amount, 
        transaction_type, 
        reference_id, 
        reference_type,   
        description,
        transaction_hash 
      } = req.body;

      const userId: number = Number(res.locals.jwt.user_id);
      
      if (!userId) {
        return this.sendErrorMessage(res, new Error(getErrorMessage('missingField', 'ID do usuário')));
      }
      
      if (!amount || amount <= 0) {
        return this.sendErrorMessage(res, new Error(getErrorMessage('missingField', 'Valor válido')));
      }
      
      if (!transaction_type) {
        return this.sendErrorMessage(res, new Error(getErrorMessage('missingField', 'Tipo da transação')));
      }
      
      const result = await this.service.removeChips(
        userId,
        amount,
        transaction_type as TransactionType,
        reference_id,
        reference_type,
        description,
        transaction_hash
      );
      
      return this.sendSuccessResponse(res, { 
        content: result, 
        message: getSuccessMessage('update', '$CHIPS removidos') 
      });
    } catch (err) {
      return await this.sendErrorMessage(res, err);
    }
  }

  async getUserChipsStats(req: Request, res: Response) {
    try {

      const userId: number = Number(res.locals.jwt.user_id);
      
      const stats = await this.service.getUserChipsStats(userId);
      
      return this.sendSuccessResponse(res, { content: stats });
    } catch (err) {
      return await this.sendErrorMessage(res, err);
    }
  }

  async getCurrentUserChipsStats(req: AuthenticatedRequest, res: Response) {
    try {

      const userId: number = Number(res.locals.jwt.user_id);
      
      if (!userId) {
        return this.sendErrorMessage(res, new Error(getErrorMessage('unauthorized')));
      }
      
      const stats = await this.service.getUserChipsStats(userId);
      
      return this.sendSuccessResponse(res, { content: stats });
    } catch (err) {
      return await this.sendErrorMessage(res, err);
    }
  }

  async getAllUsersChipsStats(req: Request, res: Response) {
    try {

      const limit = Number(req.query.limit) || 20;
      const offset = Number(req.query.offset) || 0;
      
      const stats = await this.service.getAllUsersChipsStats(limit, offset);
      
      return this.sendSuccessResponse(res, { content: stats });
    } catch (err) {
      return await this.sendErrorMessage(res, err);
    }
  }

  async getTransactionsByType(req: Request, res: Response) {
    try {
      const transactionType = req.params.type;
      const limit = Number(req.query.limit) || 20;
      const offset = Number(req.query.offset) || 0;
      
      const transactions = await this.service.getTransactionsByType(transactionType, limit, offset);
      
      return this.sendSuccessResponse(res, { content: transactions });
    } catch (err) {
      return await this.sendErrorMessage(res, err);
    }
  }

  async getTransactionsByReference(req: Request, res: Response) {
    try {
      const { referenceType, referenceId } = req.params;
      
      const transactions = await this.service.getTransactionsByReference(
        referenceType,
        Number(referenceId)
      );
      
      return this.sendSuccessResponse(res, { content: transactions });
    } catch (err) {
      return await this.sendErrorMessage(res, err);
    }
  }
}

export default UserChipsController; 