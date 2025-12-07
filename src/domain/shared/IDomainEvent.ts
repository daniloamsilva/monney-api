export interface IDomainEvent {
  dateTimeOccurred: Date;
  getAggregateId(): string;
}

export interface IHandle<T extends IDomainEvent> {
  handle(event: T): Promise<void>;
}
