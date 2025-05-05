import { User } from '../entities/User';
import {Repository} from "@core/interfaces/Repository";

export interface UserRepository extends Repository<User> {
    findByEmail(email: string): Promise<User | null>;
    findAll(): Promise<User[]>;
}
