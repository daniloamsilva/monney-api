export class User {
  id?: string;
  name: string;
  email: string;
  password: string;
  confirmedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(user: User) {
    Object.assign(this, user);
  }
}
