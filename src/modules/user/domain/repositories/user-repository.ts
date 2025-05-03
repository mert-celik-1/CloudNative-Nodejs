import { Repository } from '../../../../core/interfaces/Repository';
import { User } from '../User';

export interface UserRepository extends Repository<User> {
    findByEmail(email: string): Promise<User | null>;
    findAll(): Promise<User[]>;
}