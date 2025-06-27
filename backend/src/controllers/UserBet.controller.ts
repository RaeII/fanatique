import { Request, Response } from 'express';

import { getErrorMessage, getSuccessMessage } from '@/helpers/response_collection';
import Controller from './Controller';
import UserBetService from '@/services/UserBet.service';
import UserChipsService from '@/services/UserChips.service';
import Database from '@/database/Database';
import { TransactionType } from '@/types/userChips';
import { 
	BettingUser,
	BettingUserInsert,
	BettingUserUpdate,
	BettingUserForFront
} from '@/types/userBet';

class UserBetController extends Controller {
	private service: UserBetService;
	private chipsService: UserChipsService;

	constructor() {
		super();
		this.service = new UserBetService();
		this.chipsService = new UserChipsService();
	}

	async createBet(req: Request, res: Response) {
		try {
			console.log('Starting transaction daleee');

			const userId: number = Number(res.locals.jwt.user_id);
			const body: BettingUserInsert = {
				user_id: userId,
				match_id: req.body.match_id,
				bet_amount: req.body.bet_amount,
				potential_payout: req.body.potential_payout,
				total_odds: req.body.total_odds,
				bet_type: req.body.bet_type,
				transaction_hash: req.body.transaction_hash,
				notes: req.body.notes,
				details: req.body.details || []
			};

			// Verificar se o usuário tem saldo suficiente
			const userBalance = await this.chipsService.getUserBalance(userId);
			
			if (userBalance.balance < body.bet_amount) {
				return this.sendErrorMessage(res, new Error('Saldo de $CHIPS insuficiente para realizar esta aposta'));
			}

			await Database.startTransaction();
			
			// Criar a aposta
			const betId = await this.service.createBet(body);
			
			// Deduzir o valor da aposta do saldo do usuário
			await this.chipsService.removeChips(
				userId,
				body.bet_amount,
				TransactionType.BET_PLACED,
				betId,
				'bet',
				`Aposta #${betId}`
			);
			
			await Database.commit();
			
			return this.sendSuccessResponse(res, { 
				content: { id: betId }, 
				message: getSuccessMessage('create', 'Aposta') 
			});
	
		} catch (err) {

			console.log('Error daleee', err);

			await Database.rollback().catch(console.log);
			return await this.sendErrorMessage(res, err);
		}
	}

	async fetchBet(req: Request, res: Response) {
		try {
			const userId: number = Number(res.locals.jwt.user_id);
			const betId: number = Number(req.params.id);

			const bet: BettingUserForFront | null = await this.service.fetchBetForFront(betId, userId);
			if (!bet) throw Error(getErrorMessage('registryNotFound', 'Aposta'));

			return this.sendSuccessResponse(res, { content: bet });
		} catch (err) {
			return await this.sendErrorMessage(res, err);
		}
	}

	async fetchUserBets(req: Request, res: Response) {
		try {
			const userId: number = Number(res.locals.jwt.user_id);
			const limit: number | undefined = req.query.limit ? Number(req.query.limit) : undefined;
			const offset: number | undefined = req.query.offset ? Number(req.query.offset) : undefined;

			const bets = await this.service.fetchUserBets(userId, limit, offset);
			return this.sendSuccessResponse(res, { content: bets });
		} catch (err) {
			return await this.sendErrorMessage(res, err);
		}
	}

	async fetchUserStats(req: Request, res: Response) {
		try {
			const userId: number = Number(res.locals.jwt.user_id);

			const stats = await this.service.fetchUserStats(userId);
			return this.sendSuccessResponse(res, { content: stats });
		} catch (err) {
			return await this.sendErrorMessage(res, err);
		}
	}

	async fetchMatchBets(req: Request, res: Response) {
		try {
			const matchId: number = Number(req.params.matchId);
			const limit: number | undefined = req.query.limit ? Number(req.query.limit) : undefined;

			const bets = await this.service.fetchMatchBets(matchId, limit);
			return this.sendSuccessResponse(res, { content: bets });
		} catch (err) {
			return await this.sendErrorMessage(res, err);
		}
	}

	async updateBet(req: Request, res: Response) {
		try {
			const userId: number = Number(res.locals.jwt.user_id);
			const betId: number = Number(req.params.id);
			const body: BettingUserUpdate = {
				status: req.body.status,
				result_payout: req.body.result_payout,
				transaction_hash: req.body.transaction_hash,
				notes: req.body.notes
			};

			// Verificar se a aposta existe e pertence ao usuário
			const bet: BettingUser | null = await this.service.fetchBet(betId, userId);
			if (!bet) throw Error(getErrorMessage('registryNotFound', 'Aposta'));

			await Database.startTransaction();
			await this.service.updateBet(body, betId, userId, userId);
			await Database.commit();
			
			return this.sendSuccessResponse(res, { message: getSuccessMessage('update', 'Aposta') });
		} catch (err) {
			await Database.rollback().catch(console.log);
			return await this.sendErrorMessage(res, err);
		}
	}

	async cancelBet(req: Request, res: Response) {
		try {
			const userId: number = Number(res.locals.jwt.user_id);
			const betId: number = Number(req.params.id);
			const reason: string = req.body.reason || 'Cancelada pelo usuário';

			// Verificar se a aposta existe e pertence ao usuário
			const bet: BettingUser | null = await this.service.fetchBet(betId, userId);
			if (!bet) throw Error(getErrorMessage('registryNotFound', 'Aposta'));

			// Verificar se a aposta pode ser cancelada (apenas apostas pendentes)
			if (bet.status !== 'pending') {
				return this.sendErrorMessage(res, new Error('Apenas apostas pendentes podem ser canceladas'));
			}

			try {
				await Database.startTransaction();
				
				// Cancelar a aposta
				await this.service.cancelBet(betId, userId, reason);
				
				// Devolver o valor da aposta ao usuário
				await this.chipsService.addChips(
					userId,
					bet.bet_amount,
					TransactionType.OTHER,
					betId,
					'bet',
					`Devolução da aposta #${betId} (cancelada: ${reason})`
				);
				
				await Database.commit();
				
				return this.sendSuccessResponse(res, { message: getSuccessMessage('update', 'Aposta cancelada') });
			} catch (error) {
				await Database.rollback();
				throw error;
			}
		} catch (err) {
			await Database.rollback().catch(console.log);
			return await this.sendErrorMessage(res, err);
		}
	}

	async deleteBet(req: Request, res: Response) {
		try {
			const userId: number = Number(res.locals.jwt.user_id);
			const betId: number = Number(req.params.id);

			await Database.startTransaction();
			await this.service.deleteBet(betId, userId);
			await Database.commit();
			
			return this.sendSuccessResponse(res, { message: getSuccessMessage('delete', 'Aposta') });
		} catch (err) {
			await Database.rollback().catch(console.log);
			return await this.sendErrorMessage(res, err);
		}
	}

	async fetchBetHistory(req: Request, res: Response) {
		try {
			const userId: number = Number(res.locals.jwt.user_id);
			const betId: number = Number(req.params.id);

			// Verificar se a aposta existe e pertence ao usuário
			const bet: BettingUser | null = await this.service.fetchBet(betId, userId);
			if (!bet) throw Error(getErrorMessage('registryNotFound', 'Aposta'));

			const history = await this.service.fetchBetHistory(betId);
			return this.sendSuccessResponse(res, { content: history });
		} catch (err) {
			return await this.sendErrorMessage(res, err);
		}
	}

	// ADMIN METHODS (sem restrição de userId)
	async adminUpdateBet(req: Request, res: Response) {
		try {
			const adminId: number = Number(res.locals.jwt.user_id);
			const betId: number = Number(req.params.id);
			const body: BettingUserUpdate = {
				status: req.body.status,
				result_payout: req.body.result_payout,
				transaction_hash: req.body.transaction_hash,
				notes: req.body.notes
			};

			// Verificar se a aposta existe (sem restrição de usuário)
			const bet: BettingUser | null = await this.service.fetchBet(betId);
			if (!bet) throw Error(getErrorMessage('registryNotFound', 'Aposta'));

			// Verificar se o status está sendo alterado
			const oldStatus = bet.status;
			const newStatus = body.status;

			try {
				await Database.startTransaction();
				
				// Atualizar a aposta
				await this.service.updateBet(body, betId, undefined, adminId);
				
				// Se o status mudou para 'won', pagar o prêmio
				if (oldStatus !== 'won' && newStatus === 'won') {
					const payoutAmount = body.result_payout || bet.potential_payout;
					
					await this.chipsService.addChips(
						bet.user_id,
						payoutAmount,
						TransactionType.BET_WON,
						betId,
						'bet',
						`Pagamento da aposta #${betId}`
					);
				}
				// Se o status mudou para 'refunded', devolver o valor apostado
				else if (oldStatus !== 'refunded' && newStatus === 'refunded') {
					await this.chipsService.addChips(
						bet.user_id,
						bet.bet_amount,
						TransactionType.OTHER,
						betId,
						'bet',
						`Devolução da aposta #${betId} (anulada)`
					);
				}
				
				await Database.commit();
				
				return this.sendSuccessResponse(res, { message: getSuccessMessage('update', 'Aposta') });
			} catch (error) {
				await Database.rollback();
				throw error;
			}
		} catch (err) {
			await Database.rollback().catch(console.log);
			return await this.sendErrorMessage(res, err);
		}
	}

	async adminFetchBet(req: Request, res: Response) {
		try {
			const betId: number = Number(req.params.id);

			const bet: BettingUserForFront | null = await this.service.fetchBetForFront(betId);
			if (!bet) throw Error(getErrorMessage('registryNotFound', 'Aposta'));

			return this.sendSuccessResponse(res, { content: bet });
		} catch (err) {
			return await this.sendErrorMessage(res, err);
		}
	}
}

export default UserBetController; 