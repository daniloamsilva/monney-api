import { User } from '@/entities/user/user.entity';

export interface UsersRepositoryInterface {
  save(user: User): Promise<User>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
}
