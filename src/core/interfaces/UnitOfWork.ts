export interface UnitOfWork {
    commit(): Promise<void>;
    rollback(): Promise<void>;
    startTransaction(): Promise<void>;
}