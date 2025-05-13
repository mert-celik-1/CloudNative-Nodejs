import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../../modules/auth/infrastructure/services/JwtService';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}

export function authMiddleware(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized: No token provided.' });
        return;
    }

    const token = authHeader.split(' ')[1];
    const jwtService = new JwtService();
    const decoded = jwtService.verifyAccessToken(token);

    if (!decoded) {
        res.status(401).json({ error: 'Unauthorized: Invalid or expired token.' });
        return;
    }

    req.user = {
        id: decoded.userId,
        email: decoded.email,
    };
    next();
}