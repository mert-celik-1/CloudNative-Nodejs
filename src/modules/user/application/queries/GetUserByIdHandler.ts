import { GetUserByIdQuery } from './GetUserByIdQuery';
import { UserRepository } from '../../domain/repositories/UserRepository';

export class GetUserByIdHandler {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(query: GetUserByIdQuery): Promise<any> {
        const user = await this.userRepository.findById(query.id);
        
        if (!user) {
            throw new Error(`User with id ${query.id} not found`);
        }
        
        return user.toDTO();
    }
} 