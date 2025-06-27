/* eslint-disable @typescript-eslint/no-explicit-any */
import { createBindParams } from '@/helpers/util';
import Database from './Database';
import { 
	BettingUser,
	BettingUserDetail,
	BettingUserHistory,
	BettingUserInsert,
	BettingUserDetailInsert,
	BettingUserUpdate,
	BettingUserForFront,
	BettingUserBasicInfo,
	BettingUserHistoryInsert,
	UserBetStats
} from '../types/userBet';

class UserBetDatabase extends Database {

	// BETTING USER METHODS
	async createBet(data: BettingUserInsert): Promise<number> {
		const { details, ...betData } = data;
		const mysqlBind = createBindParams(betData);

		const result = await this.query(`INSERT INTO betting_user SET ${mysqlBind};`, Object.values(betData));
		const betId = result[0].insertId;

		// Inserir detalhes da aposta
		for (const detail of details) {
			await this.createBetDetail(betId, detail);
		}

		return betId;
	}

	async createBetDetail(betId: number, data: BettingUserDetailInsert) {
		const detailData = {
			bet_id: betId,
			...data
		};
		const mysqlBind = createBindParams(detailData);

		return await this.query(`INSERT INTO betting_user_detail SET ${mysqlBind};`, Object.values(detailData));
	}

	async createBetHistory(data: BettingUserHistoryInsert) {
		const mysqlBind = createBindParams(data);

		return await this.query(`INSERT INTO betting_user_history SET ${mysqlBind};`, Object.values(data));
	}

	async fetchBet(id: number): Promise<BettingUser | null> {
		const rows: any = await this.query('SELECT * FROM betting_user WHERE id = ?;', [id]);

		return rows[0]?.length > 0 ? rows[0][0] as BettingUser : null;
	}

	async fetchBetForFront(id: number, userId?: number): Promise<BettingUserForFront | null> {
		let whereClause = 'WHERE bu.id = ?';
		let params = [id];

		if (userId) {
			whereClause += ' AND bu.user_id = ?';
			params.push(userId);
		}

		const betRows: any = await this.query(`
			SELECT
				bu.*,
				m.id as match_id,
				hc.name as home_club_name,
				ac.name as away_club_name,
				m.match_date,
				s.name as stadium_name
			FROM betting_user bu
			LEFT JOIN \`match\` m ON bu.match_id = m.id
			LEFT JOIN club hc ON m.home_club_id = hc.id
			LEFT JOIN club ac ON m.away_club_id = ac.id
			LEFT JOIN stadium s ON m.stadium_id = s.id
			${whereClause};`, params);

		if (!betRows[0] || betRows[0].length === 0) return null;

		const bet = betRows[0][0];

		// Buscar detalhes da aposta
		const detailRows: any = await this.query(`
			SELECT
				bud.*,
				bo.option_key,
				bo.label,
				bm.name as market_name
			FROM betting_user_detail bud
			LEFT JOIN betting_option bo ON bud.option_id = bo.id
			LEFT JOIN betting_market bm ON bo.market_id = bm.id
			WHERE bud.bet_id = ?
			ORDER BY bud.id;`, [id]);

		const details = detailRows[0]?.map((detail: any) => ({
			id: detail.id,
			option_id: detail.option_id,
			odd_value: detail.odd_value,
			is_winner: detail.is_winner,
			option: {
				id: detail.option_id,
				option_key: detail.option_key,
				label: detail.label,
				market_name: detail.market_name
			}
		})) || [];

		return {
			...bet,
			match: bet.match_id ? {
				id: bet.match_id,
				home_club_name: bet.home_club_name,
				away_club_name: bet.away_club_name,
				match_date: bet.match_date,
				stadium_name: bet.stadium_name
			} : null,
			details
		} as BettingUserForFront;
	}

	async fetchUserBets(userId: number, limit?: number, offset?: number): Promise<Array<BettingUserForFront>> {
		let limitClause = '';
		let params = [userId];

		if (limit) {
			limitClause = 'LIMIT ?';
			params.push(limit);
			
			if (offset) {
				limitClause = 'LIMIT ?, ?';
				params = [userId, offset, limit];
			}
		}

		const betRows: any = await this.query(`
			SELECT
				bu.*,
				m.id as match_id,
				hc.name as home_club_name,
				ac.name as away_club_name,
				m.match_date,
				s.name as stadium_name
			FROM betting_user bu
			LEFT JOIN \`match\` m ON bu.match_id = m.id
			LEFT JOIN club hc ON m.home_club_id = hc.id
			LEFT JOIN club ac ON m.away_club_id = ac.id
			LEFT JOIN stadium s ON m.stadium_id = s.id
			WHERE bu.user_id = ?
			ORDER BY bu.placed_at DESC
			${limitClause};`, params);

		const bets = betRows[0] || [];

		// Buscar detalhes para cada aposta
		for (const bet of bets) {
			const detailRows: any = await this.query(`
				SELECT
					bud.*,
					bo.option_key,
					bo.label,
					bm.name as market_name
				FROM betting_user_detail bud
				LEFT JOIN betting_option bo ON bud.option_id = bo.id
				LEFT JOIN betting_market bm ON bo.market_id = bm.id
				WHERE bud.bet_id = ?
				ORDER BY bud.id;`, [bet.id]);

			bet.details = detailRows[0]?.map((detail: any) => ({
				id: detail.id,
				option_id: detail.option_id,
				odd_value: detail.odd_value,
				is_winner: detail.is_winner,
				option: {
					id: detail.option_id,
					option_key: detail.option_key,
					label: detail.label,
					market_name: detail.market_name
				}
			})) || [];

			bet.match = bet.match_id ? {
				id: bet.match_id,
				home_club_name: bet.home_club_name,
				away_club_name: bet.away_club_name,
				match_date: bet.match_date,
				stadium_name: bet.stadium_name
			} : null;
		}

		return bets as Array<BettingUserForFront>;
	}

	async fetchMatchBets(matchId: number, limit?: number): Promise<Array<BettingUserBasicInfo>> {
		let limitClause = '';
		let params = [matchId];

		if (limit) {
			limitClause = 'LIMIT ?';
			params.push(limit);
		}

		const rows: any = await this.query(`
			SELECT
				id,
				user_id,
				match_id,
				bet_amount,
				potential_payout,
				total_odds,
				bet_type,
				status,
				placed_at
			FROM betting_user
			WHERE match_id = ?
			ORDER BY placed_at DESC
			${limitClause};`, params);

		return rows[0] || [];
	}

	async fetchUserStats(userId: number): Promise<UserBetStats> {
		const rows: any = await this.query(`
			SELECT
				COUNT(*) as total_bets,
				COALESCE(SUM(bet_amount), 0) as total_amount,
				COALESCE(SUM(CASE WHEN status = 'won' THEN result_payout ELSE 0 END), 0) as total_winnings,
				COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_bets,
				COUNT(CASE WHEN status = 'won' THEN 1 END) as won_bets,
				COUNT(CASE WHEN status = 'lost' THEN 1 END) as lost_bets
			FROM betting_user
			WHERE user_id = ?;`, [userId]);

		const stats = rows[0][0];
		const totalDecidedBets = stats.won_bets + stats.lost_bets;
		const winRate = totalDecidedBets > 0 ? (stats.won_bets / totalDecidedBets) * 100 : 0;

		return {
			...stats,
			win_rate: parseFloat(winRate.toFixed(2))
		} as UserBetStats;
	}

	async updateBet(data: BettingUserUpdate, id: number, userId?: number) {
		const mysqlBind = createBindParams(data);
		let whereClause = 'WHERE id = ?';
		let params = [...Object.values(data), id];

		if (userId) {
			whereClause += ' AND user_id = ?';
			params.push(userId);
		}

		return await this.query(`UPDATE betting_user SET ${mysqlBind}, updated_at = now() ${whereClause};`, params);
	}

	async updateBetDetail(betId: number, optionId: number, isWinner: boolean) {
		return await this.query(`
			UPDATE betting_user_detail 
			SET is_winner = ? 
			WHERE bet_id = ? AND option_id = ?;`, [isWinner, betId, optionId]);
	}

	async deleteBet(id: number, userId?: number) {
		let whereClause = 'WHERE id = ?';
		let params = [id];

		if (userId) {
			whereClause += ' AND user_id = ?';
			params.push(userId);
		}

		return await this.query(`DELETE FROM betting_user ${whereClause};`, params);
	}

	async fetchBetHistory(betId: number): Promise<Array<BettingUserHistory>> {
		const rows: any = await this.query(`
			SELECT * FROM betting_user_history 
			WHERE bet_id = ? 
			ORDER BY created_at DESC;`, [betId]);

		return rows[0] || [];
	}
}

export default UserBetDatabase; 