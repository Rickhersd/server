import {
  Body,
  Controller,
  Get,
  Request,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Public } from 'src/decorators/public';

export class LoginDto {
  password: string;
  login: string;
}

export class SignUpDto {
  password: string;
  login: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  login(@Body() signInDto: LoginDto) {
    const result = this.authService.signIn({
      login: signInDto.login,
      password: signInDto.password,
    });

    console.log('ddasd')
    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Post('singup')
  @Public()
  signup(@Body() signUpDto: SignUpDto) {
    const result = this.authService.register({
      password: signUpDto.password,
      login: signUpDto.login,
    });

    return result;
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user.login;
  }
}
