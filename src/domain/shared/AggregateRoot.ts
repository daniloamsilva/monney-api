import { Aggregate } from './Aggregate';
import { IDomainEvent } from './IDomainEvent';

export abstract class AggregateRoot<T> extends Aggregate<T> {
  private _domainEvents: IDomainEvent[] = [];

  get domainEvents(): readonly IDomainEvent[] {
    return Object.freeze([...this._domainEvents]);
  }

  protected addDomainEvent(event: IDomainEvent): void {
    this._domainEvents.push(event);
  }

  public clearDomainEvents(): void {
    this._domainEvents = [];
  }
}
