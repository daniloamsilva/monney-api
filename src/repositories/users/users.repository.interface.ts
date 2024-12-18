import { User } from '@/entities/user/user.entity';

export interface UsersRepositoryInterface {
  save(user: User): Promise<User>;
  findByEmail(email: string): Promise<User | undefined>;
}
