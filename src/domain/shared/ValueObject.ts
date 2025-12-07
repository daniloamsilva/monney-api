export abstract class ValueObject<T> {
  protected readonly props: T;

  constructor(props: T) {
    this.props = Object.freeze(props);
  }

  public equals(other?: ValueObject<T>): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    return this.shallowEqual(this.props, other.props);
  }

  private shallowEqual(object1: T, object2: T): boolean {
    const keys1 = Object.keys(object1 as object);
    const keys2 = Object.keys(object2 as object);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      if ((object1 as any)[key] !== (object2 as any)[key]) {
        return false;
      }
    }

    return true;
  }
}
