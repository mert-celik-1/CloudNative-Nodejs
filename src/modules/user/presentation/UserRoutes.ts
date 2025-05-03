import { Router } from 'express';
import { UserController } from './UserController';
import { CreateUserCommand } from '../application/commands/CreateUserCommand';
import { GetUserByIdQuery } from '../application/queries/GetUserByIdQuery';
import { DynamoUserRepository } from '../infrastructure/repositories/DynamoUserRepository';
import { BcryptPasswordService } from "../../../shared/infrastructure/services/BcryptPasswordService";

export function createUserRouter(): Router {
    const router = Router();

    // Setup dependencies
    const userRepository = new DynamoUserRepository();
    const passwordService = new BcryptPasswordService();

    // Setup commands and queries
    const createUserCommand = new CreateUserCommand(userRepository, passwordService);
    const getUserByIdQuery = new GetUserByIdQuery(userRepository);

    // Setup controller
    const userController = new UserController(createUserCommand, getUserByIdQuery);

    // Define routes
    router.post('/', (req, res) => userController.createUser(req, res));
    router.get('/:id', (req, res) => userController.getUserById(req, res));

    return router;
}