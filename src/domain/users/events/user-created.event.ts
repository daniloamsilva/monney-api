import { IDomainEvent } from '@src/domain/shared/IDomainEvent';

interface UserCreatedEventProps {
  aggregateId: string;
  email: string;
  name: string;
}

export class UserCreatedEvent implements IDomainEvent {
  public readonly aggregateId: string;
  public readonly email: string;
  public readonly name: string;
  public dateTimeOccurred: Date;

  constructor(props: UserCreatedEventProps) {
    this.aggregateId = props.aggregateId;
    this.email = props.email;
    this.name = props.name;
    this.dateTimeOccurred = new Date();
  }

  getAggregateId(): string {
    return this.aggregateId;
  }
}
