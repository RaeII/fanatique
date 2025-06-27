import { getErrorMessage } from '@/helpers/response_collection';
import UserBetDatabase from '@/database/UserBet.database';
import { 
	BettingUser,
	BettingUserInsert,
	BettingUserUpdate,
	BettingUserForFront,
	BettingUserBasicInfo,
	BettingUserHistoryInsert,
	UserBetStats
} from '../types/userBet';

class UserBetService {
	private database: UserBetDatabase;

	constructor() {
		this.database = new UserBetDatabase();
	}

	async createBet(data: BettingUserInsert): Promise<number> {
		// Validações básicas
		if (!data.user_id) throw Error(getErrorMessage('missingField', 'ID do usuário'));
		if (!data.match_id) throw Error(getErrorMessage('missingField', 'ID da partida'));
		if (!data.bet_amount || data.bet_amount <= 0) throw Error(getErrorMessage('missingField', 'Valor da aposta'));
		if (!data.potential_payout || data.potential_payout <= 0) throw Error(getErrorMessage('missingField', 'Possível retorno'));
		if (!data.total_odds || data.total_odds <= 0) throw Error(getErrorMessage('missingField', 'Odds total'));
		if (!data.bet_type || !['single', 'multiple'].includes(data.bet_type)) throw Error(getErrorMessage('missingField', 'Tipo de aposta'));
		if (!data.details || data.details.length === 0) throw Error(getErrorMessage('missingField', 'Seleções da aposta'));

		// Validar tipo de aposta
		if (data.details.length === 1 && data.bet_type !== 'single') {
			throw Error('Apostas com uma seleção devem ser do tipo "single"');
		}
		if (data.details.length > 1 && data.bet_type !== 'multiple') {
			throw Error('Apostas com múltiplas seleções devem ser do tipo "multiple"');
		}

		// Validar se as odds dos detalhes multiplicadas resultam na odd total (com margem de erro)
		const calculatedOdds = data.details.reduce((acc, detail) => acc * detail.odd_value, 1);
		const oddsMargin = Math.abs(calculatedOdds - data.total_odds);
		if (oddsMargin > 0.01) { // Margem de 0.01 para arredondamentos
			throw Error('As odds individuais não correspondem à odd total da aposta');
		}

		// Verificar se o potencial retorno está correto
		const expectedPayout = data.bet_amount * data.total_odds;
		const payoutMargin = Math.abs(expectedPayout - data.potential_payout);
		if (payoutMargin > 0.01) {
			throw Error('O possível retorno não corresponde ao valor apostado multiplicado pelas odds');
		}

		const insertData: BettingUserInsert = {
			...data,
			status: data.status || 'pending'
		};

		const betId = await this.database.createBet(insertData);

		// Criar histórico inicial
		await this.createBetHistory({
			bet_id: betId,
			old_status: null,
			new_status: insertData.status || 'pending',
			reason: 'Aposta criada'
		});

		return betId;
	}

	async fetchBet(id: number, userId?: number): Promise<BettingUser | null> {
		if (!id) throw Error(getErrorMessage('missingField', 'ID da aposta'));

		const bet = await this.database.fetchBet(id);
		
		// Se userId foi fornecido, verificar se a aposta pertence ao usuário
		if (userId && bet && bet.user_id !== userId) {
			throw Error(getErrorMessage('accessDenied'));
		}

		return bet;
	}

	async fetchBetForFront(id: number, userId?: number): Promise<BettingUserForFront | null> {
		if (!id) throw Error(getErrorMessage('missingField', 'ID da aposta'));

		return await this.database.fetchBetForFront(id, userId);
	}

	async fetchUserBets(userId: number, limit?: number, offset?: number): Promise<Array<BettingUserForFront>> {
		if (!userId) throw Error(getErrorMessage('missingField', 'ID do usuário'));

		return await this.database.fetchUserBets(userId, limit, offset);
	}

	async fetchMatchBets(matchId: number, limit?: number): Promise<Array<BettingUserBasicInfo>> {
		if (!matchId) throw Error(getErrorMessage('missingField', 'ID da partida'));

		return await this.database.fetchMatchBets(matchId, limit);
	}

	async fetchUserStats(userId: number): Promise<UserBetStats> {
		if (!userId) throw Error(getErrorMessage('missingField', 'ID do usuário'));

		return await this.database.fetchUserStats(userId);
	}

	async updateBet(data: BettingUserUpdate, id: number, userId?: number, changedBy?: number): Promise<void> {
		if (!id) throw Error(getErrorMessage('missingField', 'ID da aposta'));

		// Buscar aposta atual para verificar mudanças de status
		const currentBet = await this.fetchBet(id, userId);
		if (!currentBet) throw Error(getErrorMessage('registryNotFound', 'Aposta'));

		const toUpdate: BettingUserUpdate = {};

		if (data.status && data.status !== currentBet.status) {
			toUpdate.status = data.status;
			
			// Se a aposta foi resolvida, definir settled_at
			if (['won', 'lost', 'cancelled', 'refunded'].includes(data.status)) {
				toUpdate.settled_at = new Date();
			}
		}

		if (data.result_payout !== undefined) {
			toUpdate.result_payout = data.result_payout;
		}

		if (data.transaction_hash) {
			toUpdate.transaction_hash = data.transaction_hash;
		}

		if (data.notes !== undefined) {
			toUpdate.notes = data.notes;
		}

		if (Object.keys(toUpdate).length === 0) {
			throw Error(getErrorMessage('noValidDataFound'));
		}

		await this.database.updateBet(toUpdate, id, userId);

		// Criar histórico se o status mudou
		if (toUpdate.status) {
			await this.createBetHistory({
				bet_id: id,
				old_status: currentBet.status,
				new_status: toUpdate.status,
				changed_by: changedBy,
				reason: data.notes || `Status alterado para ${toUpdate.status}`
			});
		}
	}

	async updateBetResult(betId: number, optionId: number, isWinner: boolean): Promise<void> {
		if (!betId) throw Error(getErrorMessage('missingField', 'ID da aposta'));
		if (!optionId) throw Error(getErrorMessage('missingField', 'ID da opção'));

		await this.database.updateBetDetail(betId, optionId, isWinner);
	}

	async cancelBet(id: number, userId?: number, reason?: string): Promise<void> {
		const currentBet = await this.fetchBet(id, userId);
		if (!currentBet) throw Error(getErrorMessage('registryNotFound', 'Aposta'));

		if (currentBet.status !== 'pending') {
			throw Error('Apenas apostas pendentes podem ser canceladas');
		}

		await this.updateBet({
			status: 'cancelled',
			notes: reason || 'Aposta cancelada'
		}, id, userId);
	}

	async deleteBet(id: number, userId?: number): Promise<void> {
		const bet = await this.fetchBet(id, userId);
		if (!bet) throw Error(getErrorMessage('registryNotFound', 'Aposta'));

		// Só permitir deletar apostas canceladas ou pendentes
		if (!['pending', 'cancelled'].includes(bet.status)) {
			throw Error('Apenas apostas pendentes ou canceladas podem ser deletadas');
		}

		await this.database.deleteBet(id, userId);
	}

	private async createBetHistory(data: BettingUserHistoryInsert): Promise<void> {
		await this.database.createBetHistory(data);
	}

	async fetchBetHistory(betId: number): Promise<Array<any>> {
		if (!betId) throw Error(getErrorMessage('missingField', 'ID da aposta'));

		return await this.database.fetchBetHistory(betId);
	}
}

export default UserBetService; 