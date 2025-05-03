import { Entity } from '../entities/Entity';

export interface Repository<T extends Entity<any>> {
    findById(id: string): Promise<T | null>;
    save(entity: T): Promise<void>;
    update(entity: T): Promise<void>;
    delete(id: string): Promise<void>;
}