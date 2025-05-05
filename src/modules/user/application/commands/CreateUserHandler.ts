import { CreateUserCommand } from './CreateUserCommand';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { PasswordService } from '../../../../core/interfaces/PasswordService';
import { User } from '../../domain/entities/User';

export class CreateUserHandler {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordService: PasswordService
    ) {}

    async execute(command: CreateUserCommand): Promise<string> {
        const userExists = await this.userRepository.findByEmail(command.email);
        if (userExists) {
            throw new Error('User already exists');
        }

        const passwordHash = await this.passwordService.hashPassword(command.password);

        const user = User.create({
            email: command.email,
            firstName: command.firstName,
            lastName: command.lastName,
            passwordHash,
        });

        await this.userRepository.save(user);
        return user.id;
    }
}
