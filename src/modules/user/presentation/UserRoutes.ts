import { Router} from 'express';
import { CreateUserCommand } from '../application/commands/CreateUserCommand';
import { CreateUserHandler } from '../application/commands/CreateUserHandler';
import { MongoUserRepository } from '../infrastructure/repositories/MongoUserRepository';
import { BcryptPasswordService } from '../../../infrastructure/crypto/BcryptPasswordService';
import { PasswordService } from '../../../core/interfaces/PasswordService';
import { GetUserByIdQuery } from '../application/queries/GetUserByIdQuery';
import { GetUserByIdHandler } from '../application/queries/GetUserByIdHandler';

export function createUserRouter(): Router {
    const router = Router();

    const passwordService: PasswordService = new BcryptPasswordService();
    const userRepository = new MongoUserRepository();
    
    // Command handlers
    const createUserHandler = new CreateUserHandler(userRepository, passwordService);
    
    // Query handlers
    const getUserByIdHandler = new GetUserByIdHandler(userRepository);

    // Create user endpoint
    router.post('/', async (req, res) => {
        const { email, firstName, lastName, password } = req.body;

        try {
            const command: CreateUserCommand = { email, firstName, lastName, password };
            const userId = await createUserHandler.execute(command);
            res.status(201).json({ userId });
        } catch (error) {
            res.status(400).json({ error: (error as Error).message });
        }
    });

    // Get user by ID endpoint
    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        try {
            const query: GetUserByIdQuery = { id };
            const user = await getUserByIdHandler.execute(query);
            res.status(200).json(user);
        } catch (error) {
            res.status(404).json({ error: (error as Error).message });
        }
    });

    return router;
}