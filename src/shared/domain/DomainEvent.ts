import { IHandle } from './IDomainEvent';
import { AggregateRoot } from './AggregateRoot';

export class DomainEvent {
  private static handlersMap = new Map<string, Array<IHandle<any>>>();

  public static register(handler: IHandle<any>, eventClassName: string): void {
    if (!this.handlersMap.has(eventClassName)) {
      this.handlersMap.set(eventClassName, []);
    }
    this.handlersMap.get(eventClassName)!.push(handler);
  }

  public static clearHandlers(): void {
    this.handlersMap.clear();
  }

  public static async dispatch(aggregate: AggregateRoot<any>): Promise<void> {
    const events = aggregate.domainEvents;

    for (const event of events) {
      const eventClassName = event.constructor.name;

      if (this.handlersMap.has(eventClassName)) {
        const handlers = this.handlersMap.get(eventClassName)!;
        for (const handler of handlers) {
          await handler.handle(event);
        }
      }
    }

    aggregate.clearDomainEvents();
  }
}
