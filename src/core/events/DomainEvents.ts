import { DomainEvent } from './DomainEvent';

type DomainEventHandler = (event: DomainEvent) => void;

export class DomainEvents {
    private static handlers: Map<string, DomainEventHandler[]> = new Map();
    private static markedEvents: DomainEvent[] = [];

    public static markEventForDispatch(event: DomainEvent): void {
        this.markedEvents.push(event);
    }

    public static register(eventName: string, handler: DomainEventHandler): void {
        if (!this.handlers.has(eventName)) {
            this.handlers.set(eventName, []);
        }

        this.handlers.get(eventName)?.push(handler);
    }

    public static clearHandlers(): void {
        this.handlers.clear();
    }

    public static clearMarkedEvents(): void {
        this.markedEvents = [];
    }

    public static dispatchEventsForEntity(id: string): void {
        const events = this.markedEvents.filter(event => event.entityId === id);

        events.forEach(event => {
            this.dispatch(event);
        });

        this.removeEventsForEntity(id);
    }

    private static dispatch(event: DomainEvent): void {
        const eventClassName = event.constructor.name;

        if (this.handlers.has(eventClassName)) {
            const handlers = this.handlers.get(eventClassName) || [];

            for (const handler of handlers) {
                handler(event);
            }
        }
    }

    private static removeEventsForEntity(id: string): void {
        this.markedEvents = this.markedEvents.filter(event => event.entityId !== id);
    }
}