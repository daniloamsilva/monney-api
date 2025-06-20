import { Encryption } from '@/utils/encryption';

export class User {
  id?: string;
  name: string;
  email: string;
  password: string;
  confirmedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;

  constructor(user: Omit<User, 'checkPassword' | 'changePassword'>) {
    Object.assign(this, user);
  }

  async checkPassword(password: string): Promise<boolean> {
    return Encryption.compare(password, this.password);
  }

  async changePassword(newPassword: string): Promise<void> {
    this.password = await Encryption.hash(newPassword);
  }
}
