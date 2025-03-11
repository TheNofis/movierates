import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import ResponseService from 'src/common/response/response.service';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { RedisService } from 'src/databases/redis/redis.service';

@Module({
  controllers: [MoviesController],
  providers: [ResponseService, PrismaService, RedisService, MoviesService],
})
export class MoviesModule {}
