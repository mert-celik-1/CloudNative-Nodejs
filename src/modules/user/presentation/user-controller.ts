import { Request, Response } from 'express';
import { CreateUserCommand } from '../application/commands/CreateUserCommand';
import { GetUserByIdQuery } from '../application/queries/GetUserByIdQuery';
import { CreateUserDTO, UpdateUserDTO } from '../application/dtos/UserDTO';

export class UserController {
    constructor(
        private createUserCommand: CreateUserCommand,
        private getUserByIdQuery: GetUserByIdQuery
    ) {}

    async createUser(req: Request, res: Response): Promise<void> {
        try {
            const userData: CreateUserDTO = req.body;
            const result = await this.createUserCommand.execute(userData);
            res.status(201).json(result);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ message: error.message });
            } else {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    }

    async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const user = await this.getUserByIdQuery.execute(id);

            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}