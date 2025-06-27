import { Request, Response } from 'express';

import { getErrorMessage, getSuccessMessage } from '@/helpers/response_collection';
import Controller from './Controller';
import OddsService from '@/services/Odds.service';
import Database from '@/database/Database';
import { 
	BettingMarket, 
	BettingOption,
	BettingMarketForFront, 
	BettingMarketInsert, 
	BettingOptionInsert,
	BettingMarketUpdate,
	BettingOptionUpdate
} from '@/types/odds';

class OddsController extends Controller {
	private service: OddsService;

	constructor() {
		super();
		this.service = new OddsService();
	}

	// MARKET METHODS
	async createMarket(req: Request, res: Response) {
		try {
			const body: BettingMarketInsert = {
				name: req.body.name,
				type: req.body.type,
				description: req.body.description,
				is_active: req.body.is_active
			};

			if (!body.name) {
				return this.sendErrorMessage(res, new Error(getErrorMessage('missingField', 'Nome do mercado')));
			}

			if (!body.type) {
				return this.sendErrorMessage(res, new Error(getErrorMessage('missingField', 'Tipo do mercado')));
			}

			await Database.startTransaction();
			const marketId = await this.service.createMarket(body);
			await Database.commit();
			
			return this.sendSuccessResponse(res, { content: { id: marketId }, message: getSuccessMessage('create', 'Mercado') });
		} catch (err) {
			await Database.rollback().catch(console.log);
			return await this.sendErrorMessage(res, err);
		}
	}

	async fetchMarket(req: Request, res: Response) {
		try {
			const marketId: number = Number(req.params.id);

			const market: BettingMarketForFront | null = await this.service.fetchMarketForFront(marketId);
			if (!market) throw Error(getErrorMessage('registryNotFound', 'Mercado'));

			return this.sendSuccessResponse(res, { content: market });
		} catch (err) {
			return await this.sendErrorMessage(res, err);
		}
	}

	async fetchAllMarkets(req: Request, res: Response) {
		try {
			const markets = await this.service.fetchAllMarketsForFront();
			return this.sendSuccessResponse(res, { content: markets });
		} catch (err) {
			return await this.sendErrorMessage(res, err);
		}
	}

	async updateMarket(req: Request, res: Response) {
		try {
			const body: BettingMarketUpdate = {
				name: req.body.name,
				type: req.body.type,
				description: req.body.description,
				is_active: req.body.is_active
			};
			const marketId: number = Number(req.params.id);

			const market: BettingMarket | null = await this.service.fetchMarket(marketId);

			if (!market) throw Error(getErrorMessage('registryNotFound', 'Mercado'));

			await this.service.updateMarket(body, marketId);
			return this.sendSuccessResponse(res, { message: getSuccessMessage('update', 'Mercado') });
		} catch (err) {
			return await this.sendErrorMessage(res, err);
		}
	}

	async deleteMarket(req: Request, res: Response) {
		try {
			const marketId: number = Number(req.params.id);
			
			const market: BettingMarket | null = await this.service.fetchMarket(marketId);
			if (!market) throw Error(getErrorMessage('registryNotFound', 'Mercado'));
			
			Database.startTransaction();
			await this.service.removeMarket(marketId);
			Database.commit();
			return this.sendSuccessResponse(res, { message: getSuccessMessage('delete', 'Mercado') });
		} catch (err) {
			Database.rollback();
			return await this.sendErrorMessage(res, err);
		}
	}

	// OPTION METHODS
	async createOption(req: Request, res: Response) {
		try {
			const body: BettingOptionInsert = {
				market_id: req.body.market_id,
				option_key: req.body.option_key,
				label: req.body.label,
				description: req.body.description,
				is_active: req.body.is_active
			};

			if (!body.market_id) {
				return this.sendErrorMessage(res, new Error(getErrorMessage('missingField', 'Id do mercado')));
			}

			if (!body.option_key) {
				return this.sendErrorMessage(res, new Error(getErrorMessage('missingField', 'Chave da opção')));
			}

			if (!body.label) {
				return this.sendErrorMessage(res, new Error(getErrorMessage('missingField', 'Label da opção')));
			}

			await Database.startTransaction();
			const optionId = await this.service.createOption(body);
			await Database.commit();
			
			return this.sendSuccessResponse(res, { content: { id: optionId }, message: getSuccessMessage('create', 'Opção') });
		} catch (err) {
			await Database.rollback().catch(console.log);
			return await this.sendErrorMessage(res, err);
		}
	}

	async fetchOption(req: Request, res: Response) {
		try {
			const optionId: number = Number(req.params.id);

			const option: BettingOption | null = await this.service.fetchOption(optionId);
			if (!option) throw Error(getErrorMessage('registryNotFound', 'Opção'));

			return this.sendSuccessResponse(res, { content: option });
		} catch (err) {
			return await this.sendErrorMessage(res, err);
		}
	}

	async fetchOptionsByMarket(req: Request, res: Response) {
		try {
			const marketId: number = Number(req.params.marketId);

			const options = await this.service.fetchOptionsByMarket(marketId);
			return this.sendSuccessResponse(res, { content: options });
		} catch (err) {
			return await this.sendErrorMessage(res, err);
		}
	}

	async updateOption(req: Request, res: Response) {
		try {
			const body: BettingOptionUpdate = {
				option_key: req.body.option_key,
				label: req.body.label,
				description: req.body.description,
				is_active: req.body.is_active
			};
			const optionId: number = Number(req.params.id);

			const option: BettingOption | null = await this.service.fetchOption(optionId);

			if (!option) throw Error(getErrorMessage('registryNotFound', 'Opção'));

			await this.service.updateOption(body, optionId);
			return this.sendSuccessResponse(res, { message: getSuccessMessage('update', 'Opção') });
		} catch (err) {
			return await this.sendErrorMessage(res, err);
		}
	}

	async deleteOption(req: Request, res: Response) {
		try {
			const optionId: number = Number(req.params.id);
			
			const option: BettingOption | null = await this.service.fetchOption(optionId);
			if (!option) throw Error(getErrorMessage('registryNotFound', 'Opção'));
			
			Database.startTransaction();
			await this.service.removeOption(optionId);
			Database.commit();
			return this.sendSuccessResponse(res, { message: getSuccessMessage('delete', 'Opção') });
		} catch (err) {
			Database.rollback();
			return await this.sendErrorMessage(res, err);
		}
	}
}

export default OddsController; 