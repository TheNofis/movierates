import { Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { ISession } from 'src/common/interfaces/session.interface';
import { RegisterAuthDto } from './dto/register-auth.dto';
import ResponseService, {
  IResponse,
} from 'src/common/response/response.service';

import { PrismaService } from 'src/databases/prisma/prisma.service';

import { User } from '@prisma/client';
import { Nullable } from 'src/common/interfaces/nullable.interface';
import { PasswordService } from './password.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly responseService: ResponseService,
    private readonly prismaService: PrismaService,
    private readonly passwordService: PasswordService,
  ) {}

  async login(dto: LoginAuthDto, session: ISession): Promise<IResponse> {
    this.responseService.start();

    if (session.user)
      return this.responseService.error('User already logged in');

    const user: Nullable<User> = await this.prismaService.user.findFirst({
      where: {
        username: dto.identifier,
      },
    });

    if (user === null)
      return this.responseService.error('Invalid username or password');

    const isValidPassword: boolean = await this.passwordService.comparePassword(
      dto.password,
      user.password,
    );

    if (!isValidPassword)
      return this.responseService.error('Invalid username or password');

    session.user = user;

    return this.responseService.success();
  }

  async register(dto: RegisterAuthDto, session: ISession): Promise<IResponse> {
    this.responseService.start();

    const user: Nullable<User> = await this.prismaService.user.findFirst({
      where: {
        username: dto.identifier,
      },
    });

    if (user !== null) return this.responseService.error('User already exists');

    const hashedPassword: string = await this.passwordService.hashPassword(
      dto.password,
    );

    const createdUser: User = await this.prismaService.user.create({
      data: {
        username: dto.identifier,
        password: hashedPassword,
      },
    });

    session.user = createdUser;

    return this.responseService.success();
  }
}
