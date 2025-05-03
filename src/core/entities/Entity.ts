import { randomUUID } from 'crypto';

export interface EntityProps {
    id?: string;
}

export abstract class Entity<T extends EntityProps> {
    protected readonly id: string;

    constructor(props: T) {
        this.id = props.id || randomUUID();
    }

    get getId(): string {
        return this.id;
    }

    public equals(entity?: Entity<T>): boolean {
        if (entity === null || entity === undefined) {
            return false;
        }

        if (this === entity) {
            return true;
        }

        return this.id === entity.getId;
    }
}