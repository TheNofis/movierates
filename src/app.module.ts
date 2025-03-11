import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RedisService } from './databases/redis/redis.service';
import { MoviesModule } from './movies/movies.module';

@Module({
  imports: [AuthModule, UsersModule, MoviesModule],
  controllers: [],
  providers: [RedisService],
})
export class AppModule {}
