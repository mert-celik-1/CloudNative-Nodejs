export interface DomainEventProps {
    eventId?: string;
    occurredAt?: Date;
    entityId: string;
}

export abstract class DomainEvent {
    public readonly eventId: string;
    public readonly occurredAt: Date;
    public readonly entityId: string;

    constructor(props: DomainEventProps) {
        this.eventId = props.eventId || crypto.randomUUID();
        this.occurredAt = props.occurredAt || new Date();
        this.entityId = props.entityId;
    }
}