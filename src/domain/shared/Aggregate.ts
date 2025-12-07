import { Entity } from './Entity';

export abstract class Aggregate<T> extends Entity<T> {
  protected props: T;

  constructor(props: T & { id: string }) {
    super(props.id);
    this.props = props;
  }
}
