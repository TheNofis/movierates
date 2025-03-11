import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RedisService } from './databases/redis/redis.service';
import { MoviesModule } from './movies/movies.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [AuthModule, UsersModule, MoviesModule, ReviewsModule],
  controllers: [],
  providers: [RedisService],
})
export class AppModule {}
