export class User {
  id?: string;
  name: string;
  email: string;
  password: string;

  constructor({ id, name, email, password }: User) {
    Object.assign(this, { id, name, email, password });
  }
}
