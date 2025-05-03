import { Router } from 'express';
import { createUserRouter } from '../modules/user/presentation/UserRoutes';

export function createApiRouter(): Router {
    const router = Router();

    router.use('/users', createUserRouter());

    return router;
}