import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';
import { PasswordService } from './password.service';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import ResponseService from 'src/common/response/response.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ResponseService, PrismaService, PasswordService],
})
export class AuthModule {}
