/* eslint-disable @typescript-eslint/no-explicit-any */
import { createBindParams } from '@/helpers/util';
import Database from './Database';
import { 
	BettingMarket, 
	BettingOption, 
	BettingMarketInsert, 
	BettingOptionInsert, 
	BettingMarketForFront, 
	BettingMarketBasicInfo,
	BettingOptionForFront
} from '../types/odds';

class OddsDatabase extends Database {

	async createMarket(data: BettingMarketInsert) {
		const mysqlBind = createBindParams(data);

		return await this.query(`INSERT INTO betting_market SET ${mysqlBind};`, Object.values(data));
	}

	async createOption(data: BettingOptionInsert) {
		const mysqlBind = createBindParams(data);

		return await this.query(`INSERT INTO betting_option SET ${mysqlBind};`, Object.values(data));
	}

	async fetchMarket(id: number): Promise<BettingMarket | null> {
		const rows: any = await this.query('SELECT * FROM betting_market WHERE id = ?;', [id]);

		return rows[0]?.length > 0 ? rows[0][0] as BettingMarket : null;
	}

	async fetchMarketForFront(id: number): Promise<BettingMarketForFront | null> {
		const marketRows: any = await this.query(`
			SELECT
				id,
				name,
				type,
				description,
				is_active
			FROM betting_market
			WHERE id = ? AND is_active = 1;`, [id]);

		if (!marketRows[0] || marketRows[0].length === 0) return null;

		const market = marketRows[0][0];

		const optionsRows: any = await this.query(`
			SELECT
				id,
				option_key,
				label,
				description,
				is_active
			FROM betting_option
			WHERE market_id = ? AND is_active = 1
			ORDER BY id;`, [id]);

		return {
			...market,
			options: optionsRows[0] || []
		} as BettingMarketForFront;
	}

	async fetchAllMarkets(): Promise<Array<BettingMarketBasicInfo>> {
		const rows: any = await this.query(`
			SELECT 
				id, 
				name, 
				type, 
				is_active 
			FROM betting_market 
			WHERE is_active = 1
			ORDER BY name;`, []);

		return rows[0];
	}

	async fetchAllMarketsForFront(): Promise<Array<BettingMarketForFront>> {
		const marketsRows: any = await this.query(`
			SELECT
				id,
				name,
				type,
				description,
				is_active
			FROM betting_market
			WHERE is_active = 1
			ORDER BY name;`, []);

		const markets = marketsRows[0] || [];
		
		for (const market of markets) {
			const optionsRows: any = await this.query(`
				SELECT
					id,
					option_key,
					label,
					description,
					is_active
				FROM betting_option
				WHERE market_id = ? AND is_active = 1
				ORDER BY id;`, [market.id]);

			market.options = optionsRows[0] || [];
		}

		return markets as Array<BettingMarketForFront>;
	}

	async fetchMarketByName(name: string): Promise<Array<BettingMarketBasicInfo>> {
		const rows = await this.query(`
			SELECT 
				id, 
				name, 
				type, 
				is_active 
			FROM betting_market 
			WHERE name = ?;`, [name]);

		return rows[0] as Array<BettingMarketBasicInfo>;
	}

	async fetchOption(id: number): Promise<BettingOption | null> {
		const rows: any = await this.query('SELECT * FROM betting_option WHERE id = ?;', [id]);

		return rows[0]?.length > 0 ? rows[0][0] as BettingOption : null;
	}

	async fetchOptionsByMarket(marketId: number): Promise<Array<BettingOptionForFront>> {
		const rows: any = await this.query(`
			SELECT
				id,
				option_key,
				label,
				description,
				is_active
			FROM betting_option
			WHERE market_id = ? AND is_active = 1
			ORDER BY id;`, [marketId]);

		return rows[0] || [];
	}

	async updateMarket(data: any, id: number) {
		const mysqlBind = createBindParams(data);

		return await this.query(`UPDATE betting_market SET ${mysqlBind}, updated_at = now() WHERE id = ?;`, [...Object.values(data), id]);
	}

	async updateOption(data: any, id: number) {
		const mysqlBind = createBindParams(data);

		return await this.query(`UPDATE betting_option SET ${mysqlBind}, updated_at = now() WHERE id = ?;`, [...Object.values(data), id]);
	}

	async deleteMarket(id: number) {
		return await this.query('DELETE FROM betting_market WHERE id = ?;', [id]);
	}

	async deleteOption(id: number) {
		return await this.query('DELETE FROM betting_option WHERE id = ?;', [id]);
	}
}

export default OddsDatabase; 