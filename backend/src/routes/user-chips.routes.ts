import express, { Request, Response } from 'express';

import Controller from '@/controllers/UserChips.controller';
import jwtMiddleware from '@/middlewares/jwt.middleware';

const router = express.Router();

// Rotas para usuário atual (autenticado)
router.get('/balance', [
  jwtMiddleware.validJWTNeeded,
  async (req: Request, res: Response): Promise<void> => {
    const controller = new Controller();
    await controller.getCurrentUserBalance(req, res);
  }
]);

router.get('/transactions', [
  jwtMiddleware.validJWTNeeded,
  async (req: Request, res: Response): Promise<void> => {
    const controller = new Controller();
    await controller.getCurrentUserTransactions(req, res);
  }
]);

router.get('/stats', [
  jwtMiddleware.validJWTNeeded,
  async (req: Request, res: Response): Promise<void> => {
    const controller = new Controller();
    await controller.getCurrentUserChipsStats(req, res);
  }
]);

// Rotas para gerenciamento de saldo (admin)
router.post('/add', [
  jwtMiddleware.validJWTNeeded,
  async (req: Request, res: Response): Promise<void> => {
    const controller = new Controller();
    await controller.addChips(req, res);
  }
]);

router.post('/remove', [
  jwtMiddleware.validJWTNeeded,
  async (req: Request, res: Response): Promise<void> => {
    const controller = new Controller();
    await controller.removeChips(req, res);
  }
]);

// Rotas para consulta de usuários específicos (admin)
router.get('/user/:userId/balance', [
  jwtMiddleware.validJWTNeeded,
  async (req: Request, res: Response): Promise<void> => {
    const controller = new Controller();
    await controller.getUserBalance(req, res);
  }
]);

router.get('/user/:userId/transactions', [
  jwtMiddleware.validJWTNeeded,
  async (req: Request, res: Response): Promise<void> => {
    const controller = new Controller();
    await controller.getUserTransactions(req, res);
  }
]);

router.get('/user/:userId/stats', [
  jwtMiddleware.validJWTNeeded,
  async (req: Request, res: Response): Promise<void> => {
    const controller = new Controller();
    await controller.getUserChipsStats(req, res);
  }
]);

// Rotas para consulta de transações
router.get('/transaction/:id', [
  jwtMiddleware.validJWTNeeded,
  async (req: Request, res: Response): Promise<void> => {
    const controller = new Controller();
    await controller.getTransactionById(req, res);
  }
]);

router.get('/transactions/type/:type', [
  jwtMiddleware.validJWTNeeded,
  async (req: Request, res: Response): Promise<void> => {
    const controller = new Controller();
    await controller.getTransactionsByType(req, res);
  }
]);

router.get('/transactions/reference/:referenceType/:referenceId', [
  jwtMiddleware.validJWTNeeded,
  async (req: Request, res: Response): Promise<void> => {
    const controller = new Controller();
    await controller.getTransactionsByReference(req, res);
  }
]);

// Rota para listar estatísticas de todos os usuários (admin)
router.get('/stats/all', [
  jwtMiddleware.validJWTNeeded,
  async (req: Request, res: Response): Promise<void> => {
    const controller = new Controller();
    await controller.getAllUsersChipsStats(req, res);
  }
]);

export default router; 