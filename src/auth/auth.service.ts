import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { NeonDatabase } from 'drizzle-orm/neon-serverless';
import { PG_CONNECTION } from 'src/constants';
import { users } from 'src/db/schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(PG_CONNECTION) private conn: NeonDatabase
) {}

  async signIn(dto:{
    login: string, 
    password: string
  }): Promise<{ access_token: string }>  {
    const user = await this.usersService.findOne(dto.login);

    if (!user) throw new UnauthorizedException();

  
    const mathCompare = await this.checkPassword(
      user.password,
      dto.password
    )

    if (!mathCompare) {
      throw new UnauthorizedException();
    }

    const payload = { login: dto.login };

    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET
      }),
    };
  }

  async register(dto:{
    login: string, 
    password: string
  }): Promise<{ access_token: string }>  {
    const user = await this.usersService.findOne(dto.login);
    if (user) throw new UnauthorizedException();

    await this.conn.insert(users).values({
      password: await this.getHash(dto.password),
      role_id: 2,
      login: dto.login
    })

    const payload = { login: dto.login};
    
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET
      }),
    };
  }

  private async checkPassword(passwordHash: string, password: string){
    const match = await bcrypt.compare(password, passwordHash);
    return match
  }

  private async getHash(password: string){
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }
}
