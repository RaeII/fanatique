import { getErrorMessage } from '@/helpers/response_collection';
import OddsDatabase from '@/database/Odds.database';
import { 
	BettingMarket, 
	BettingOption,
	BettingMarketInsert, 
	BettingOptionInsert,
	BettingMarketBasicInfo, 
	BettingMarketForFront, 
	BettingMarketUpdate,
	BettingOptionUpdate,
	BettingOptionForFront
} from '../types/odds';

class OddsService {
	private database: OddsDatabase;

	constructor() {
		this.database = new OddsDatabase();
	}

	// MARKET METHODS
	async createMarket(data: BettingMarketInsert): Promise<number> {
		if (!data.name) throw Error(getErrorMessage('missingField', 'Nome do mercado'));
		if (!data.type) throw Error(getErrorMessage('missingField', 'Tipo do mercado'));
		
		const marketByName = await this.fetchMarketByName(data.name);
		if (marketByName.length > 0) throw Error(getErrorMessage('registryAlreadyExist', 'Mercado'));

		const insertData: BettingMarketInsert = {
			name: data.name,
			type: data.type,
			description: data.description,
			is_active: data.is_active ?? true
		};

		const result: any = await this.database.createMarket(insertData);
		return result[0].insertId;
	}

	async fetchMarket(id: number): Promise<BettingMarket | null> {
		if (!id) throw Error(getErrorMessage('missingField', 'Id do mercado'));

		return await this.database.fetchMarket(id);
	}

	async fetchAllMarkets(): Promise<Array<BettingMarketBasicInfo>> {
		return await this.database.fetchAllMarkets();
	}

	async fetchAllMarketsForFront(): Promise<Array<BettingMarketForFront>> {
		return await this.database.fetchAllMarketsForFront();
	}

	async fetchMarketForFront(id: number): Promise<BettingMarketForFront | null> {
		if (!id) throw Error(getErrorMessage('missingField', 'Id do mercado'));

		return await this.database.fetchMarketForFront(id);
	}

	async fetchMarketByName(name: string): Promise<Array<BettingMarketBasicInfo>> {
		if (!name) throw Error(getErrorMessage('missingField', 'Nome do mercado'));

		return await this.database.fetchMarketByName(name);
	}

	async updateMarket(data: BettingMarketUpdate, id: number) {
		const toUpdate: BettingMarketUpdate = {};

		if (data?.name) {
			const markets: Array<BettingMarketBasicInfo> = await this.fetchMarketByName(data.name);

			if (markets.length > 0 && markets[0].id !== id) throw Error(getErrorMessage('registryAlreadyExist', 'Mercado'));

			toUpdate.name = data.name;
		}
		
		if (data?.type) {
			toUpdate.type = data.type;
		}

		if (data?.description !== undefined) {
			toUpdate.description = data.description;
		}

		if (data?.is_active !== undefined) {
			toUpdate.is_active = data.is_active;
		}

		if (Object.keys(toUpdate).length === 0) throw Error(getErrorMessage('noValidDataFound'));

		await this.database.updateMarket(toUpdate, id);
	}

	async removeMarket(id: number): Promise<void> {
		await this.database.deleteMarket(id);
	}

	// OPTION METHODS
	async createOption(data: BettingOptionInsert): Promise<number> {
		if (!data.market_id) throw Error(getErrorMessage('missingField', 'Id do mercado'));
		if (!data.option_key) throw Error(getErrorMessage('missingField', 'Chave da opção'));
		if (!data.label) throw Error(getErrorMessage('missingField', 'Label da opção'));

		// Verificar se o mercado existe
		const market = await this.fetchMarket(data.market_id);
		if (!market) throw Error(getErrorMessage('registryNotFound', 'Mercado'));

		const insertData: BettingOptionInsert = {
			market_id: data.market_id,
			option_key: data.option_key,
			label: data.label,
			description: data.description,
			is_active: data.is_active ?? true
		};

		const result: any = await this.database.createOption(insertData);
		return result[0].insertId;
	}

	async fetchOption(id: number): Promise<BettingOption | null> {
		if (!id) throw Error(getErrorMessage('missingField', 'Id da opção'));

		return await this.database.fetchOption(id);
	}

	async fetchOptionsByMarket(marketId: number): Promise<Array<BettingOptionForFront>> {
		if (!marketId) throw Error(getErrorMessage('missingField', 'Id do mercado'));

		return await this.database.fetchOptionsByMarket(marketId);
	}

	async updateOption(data: BettingOptionUpdate, id: number) {
		const toUpdate: BettingOptionUpdate = {};

		if (data?.option_key) {
			toUpdate.option_key = data.option_key;
		}
		
		if (data?.label) {
			toUpdate.label = data.label;
		}

		if (data?.description !== undefined) {
			toUpdate.description = data.description;
		}

		if (data?.is_active !== undefined) {
			toUpdate.is_active = data.is_active;
		}

		if (Object.keys(toUpdate).length === 0) throw Error(getErrorMessage('noValidDataFound'));

		await this.database.updateOption(toUpdate, id);
	}

	async removeOption(id: number): Promise<void> {
		await this.database.deleteOption(id);
	}
}

export default OddsService; 