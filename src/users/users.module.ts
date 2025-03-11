import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import ResponseService from 'src/common/response/response.service';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { RedisService } from 'src/databases/redis/redis.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ResponseService, RedisService, PrismaService],
})
export class UsersModule {}
