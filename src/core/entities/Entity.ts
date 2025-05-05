import { randomUUID } from 'crypto';

export interface EntityProps {
    id?: string;
}

export abstract class Entity<T extends EntityProps> {
    protected readonly props: T;

    constructor(props: T) {
        this.props = {
            ...props,
            id: props.id ?? randomUUID()
        };
    }

    get id(): string {
        return this.props.id!;
    }

    public equals(entity?: Entity<T>): boolean {
        if (!entity) return false;
        if (this === entity) return true;
        return this.id === entity.id;
    }

    public toString(): string {
        return `${this.constructor.name} [ID: ${this.id}]`;
    }
}
