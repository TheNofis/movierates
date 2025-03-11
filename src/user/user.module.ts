import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';

import ResponseService from 'src/common/response/response.service';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { RedisService } from 'src/databases/redis/redis.service';

@Module({
  controllers: [UserController],
  providers: [UserService, ResponseService, RedisService, PrismaService],
})
export class UserModule {}
