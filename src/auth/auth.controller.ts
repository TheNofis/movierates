import {
  Body,
  Controller,
  Post,
  Session,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';

import { ISession } from 'src/common/interfaces/session.interface';
import { RegisterAuthDto } from './dto/register-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() dto: LoginAuthDto, @Session() session: ISession) {
    return this.authService.login(dto, session);
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() dto: RegisterAuthDto, @Session() session: ISession) {
    return this.authService.register(dto, session);
  }
}
