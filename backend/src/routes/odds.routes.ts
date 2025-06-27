import express, { Request, Response } from 'express';

import Controller from '@/controllers/Odds.controller';
import jwtMiddleware from '@/middlewares/jwt.middleware';

const router = express.Router();

// MARKET ROUTES
router.post('/market', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		controller.createMarket(req, res);
	}
]);

router.get('/market/:id', [
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.fetchMarket(req, res);
	}
]);

router.get('/market', [
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.fetchAllMarkets(req, res);
	}
]);

router.put('/market/:id', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.updateMarket(req, res);
	}
]);

router.delete('/market/:id', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.deleteMarket(req, res);
	}
]);

// OPTION ROUTES
router.post('/option', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		controller.createOption(req, res);
	}
]);

router.get('/option/:id', [
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.fetchOption(req, res);
	}
]);

router.get('/market/:marketId/options', [
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.fetchOptionsByMarket(req, res);
	}
]);

router.put('/option/:id', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.updateOption(req, res);
	}
]);

router.delete('/option/:id', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.deleteOption(req, res);
	}
]);

export default router; 