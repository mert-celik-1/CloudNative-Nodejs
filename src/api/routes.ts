import { Router } from 'express';
import { createUserRouter } from '../modules/user/presentation/UserRoutes';
import { createAuthRouter } from '../modules/auth/presentation/AuthRoutes';

export function createApiRouter(): Router {
    const router = Router();

    router.use('/users', createUserRouter());
    router.use('/auth', createAuthRouter());

    return router;

}