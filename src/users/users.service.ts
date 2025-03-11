import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Nullable } from 'src/common/interfaces/nullable.interface';

import ResponseService, {
  IResponse,
} from 'src/common/response/response.service';

import { PrismaService } from 'src/databases/prisma/prisma.service';
import { RedisService } from 'src/databases/redis/redis.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly responseService: ResponseService,
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
  ) {}
  async profile(username: string): Promise<IResponse> {
    this.responseService.start();

    const user: Nullable<User> = await this.redisService.getCachedData(
      `user:${username}`,
      async () => {
        return await this.prismaService.user.findUnique({
          where: { username },
          include: {
            watchedMovies: true,
            comments: true,
          },
        });
      },
    );
    if (user === null) return this.responseService.error('User not found');
    const { password, ...userNoPassword } = user || {};

    return this.responseService.success(userNoPassword);
  }
}
