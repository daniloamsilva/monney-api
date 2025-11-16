import { Entity } from './Entity';
import { IDomainEvent } from './IDomainEvent';

export abstract class AggregateRoot<T> extends Entity<T> {
  protected props: T;
  private _domainEvents: IDomainEvent[] = [];

  constructor(props: T & { id: string }) {
    super(props.id);
    this.props = props;
  }

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
