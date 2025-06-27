import express, { Request, Response } from 'express';

import Controller from '@/controllers/UserBet.controller';
import jwtMiddleware from '@/middlewares/jwt.middleware';

const router = express.Router();

// USER BET ROUTES (todas requerem JWT)
router.post('/', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.createBet(req, res);
	}
]);

router.get('/my-bets', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.fetchUserBets(req, res);
	}
]);

router.get('/my-stats', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.fetchUserStats(req, res);
	}
]);

router.get('/:id', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.fetchBet(req, res);
	}
]);

router.put('/:id', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.updateBet(req, res);
	}
]);

router.post('/:id/cancel', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.cancelBet(req, res);
	}
]);

router.delete('/:id', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.deleteBet(req, res);
	}
]);

router.get('/:id/history', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.fetchBetHistory(req, res);
	}
]);

// PUBLIC ROUTES (sem JWT)
router.get('/match/:matchId/bets', [
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.fetchMatchBets(req, res);
	}
]);

// ADMIN ROUTES (requerem JWT)
router.put('/admin/:id', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.adminUpdateBet(req, res);
	}
]);

router.get('/admin/:id', [
	jwtMiddleware.validJWTNeeded,
	async (req: Request, res: Response): Promise<void> => {
		const controller = new Controller();

		await controller.adminFetchBet(req, res);
	}
]);

export default router; 