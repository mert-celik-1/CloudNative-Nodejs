import { Router, Request, Response } from 'express';
import { LoginHandler } from '../application/commands/LoginHandler';
import { RefreshTokenHandler } from '../application/commands/RefreshTokenHandler';
import { LogoutHandler } from '../application/commands/LogoutHandler';
import { MongoAuthRepository } from '../infrastructure/repositories/MongoAuthRepository';
import { BcryptPasswordService } from '../../../infrastructure/crypto/BcryptPasswordService';
import { JwtService } from '../infrastructure/services/JwtService';
import { LoginRequestDTO, RefreshTokenRequestDTO } from '../application/dtos/AuthDTO';
import { LogoutCommand } from '../application/commands/LogoutCommand';
import { MongoUserRepository } from '../../user/infrastructure/repositories/MongoUserRepository';

export function createAuthRouter(): Router {
    const router = Router();

    const authRepository = new MongoAuthRepository();
    const userRepository = new MongoUserRepository();
    const passwordService = new BcryptPasswordService();
    const jwtService = new JwtService();

    const loginHandler = new LoginHandler(authRepository, passwordService, jwtService);
    const refreshTokenHandler = new RefreshTokenHandler(authRepository, userRepository, jwtService);
    const logoutHandler = new LogoutHandler(authRepository);

    router.post('/login', async (req: Request, res: Response) => {
        try {
            const command: LoginRequestDTO = req.body;
            const result = await loginHandler.execute(command);
            res.status(200).json(result);
        } catch (error) {
            res.status(401).json({ error: (error as Error).message });
        }
    });

    router.post('/refresh-token', async (req: Request, res: Response) => {
        try {
            const command: RefreshTokenRequestDTO = req.body;
            const result = await refreshTokenHandler.execute(command);
            res.status(200).json(result);
        } catch (error) {
            res.status(401).json({ error: (error as Error).message });
        }
    });

    router.post('/logout', async (req: Request, res: Response) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(400).json({ error: 'Refresh token is required.' });
            }
            const command: LogoutCommand = { refreshToken };
            await logoutHandler.execute(command);
            res.status(200).json({ message: 'Logged out successfully.' });
        } catch (error) {
            res.status(500).json({ error: (error as Error).message });
        }
    });

    return router;
}