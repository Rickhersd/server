import { Inject, Injectable } from '@nestjs/common';
import { NeonDatabase } from 'drizzle-orm/neon-serverless';
import { PG_CONNECTION } from 'src/constants';
import { eq } from 'drizzle-orm';
import { users } from 'src/db/schema';

export type User = {
  id: number;
  login: string;
  password: string;
};

@Injectable()
export class UsersService {
  constructor(@Inject(PG_CONNECTION) private conn: NeonDatabase) {}

  async findOne(login: string): Promise<User | undefined> {
    const info = (
      await this.conn
        .select({
          id: users.id,
          login: users.login,
          password: users.password,
        })
        .from(users)
        .where(eq(users.login, login))
    )[0];

    return info;
  }
}
