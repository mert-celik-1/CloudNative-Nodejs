import { Router } from 'express';
import { createUserRouter } from '../modules/user/presentation/UserRoutes';
import { RedisService } from '../infrastructure/cache/RedisService';

export function createApiRouter(): Router {
    const router = Router();
    const redisService = new RedisService();

    router.use('/users', createUserRouter());

    router.get('/cache-test/:key', async (req, res) => {
        try {
            const { key } = req.params;
            const value = await redisService.get(key);
            
            if (value) {
                return res.status(200).json({ key, value });
            }
            
            return res.status(404).json({ message: `Key '${key}' not found in cache` });
        } catch (error) {
            console.error('Redis get error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    });

    router.post('/cache-test', async (req, res) => {
        try {
            const { key, value, expirationInSeconds } = req.body;
            
            if (!key || !value) {
                return res.status(400).json({ message: 'Key and value are required' });
            }
            
            await redisService.set(key, value, expirationInSeconds);
            return res.status(201).json({ message: 'Cache entry created', key, value });
        } catch (error) {
            console.error('Redis set error:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    });

    return router;
}