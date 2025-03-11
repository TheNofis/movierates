import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Nullable } from 'src/common/interfaces/nullable.interface';

import ResponseService, {
  IResponse,
} from 'src/common/response/response.service';

import { PrismaService } from 'src/databases/prisma/prisma.service';
import { RedisService } from 'src/databases/redis/redis.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordService } from 'src/auth/password.service';

import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class UsersService {
  constructor(
    private readonly responseService: ResponseService,
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
    private readonly passwordService: PasswordService,
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

  async updateProfile(dto: UpdateUserDto): Promise<IResponse> {
    this.responseService.start();

    const {
      username,
      password,
      currentPassword,
    }: {
      username?: string;
      password?: string;
      currentPassword?: string;
    } = {
      username: dto.username?.value,
      password: dto.password?.value,
      currentPassword: dto.currentPassword?.value,
    };

    const user: Nullable<User> = await this.prismaService.user.findUnique({
      where: { username },
    });

    if (user === null) return this.responseService.error('User not found');

    if (
      !(await this.passwordService.comparePassword(
        currentPassword || '',
        user.password,
      ))
    )
      return this.responseService.error('Invalid password');

    try {
      const uploadDir = path.join(__dirname, '../..', 'public', 'users');
      if (!fs.existsSync(uploadDir))
        fs.mkdirSync(uploadDir, { recursive: true });

      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      dto.profileImage.filename = `avatar-${username}${path.extname(dto.profileImage.filename)}`;

      const fileBuffer = await dto.profileImage.toBuffer();
      if (fileBuffer.length > MAX_FILE_SIZE)
        throw new Error('File size is too large');

      fs.writeFileSync(
        path.join(uploadDir, dto.profileImage.filename),
        fileBuffer,
      );
    } catch (error) {
      return this.responseService.error(error.message);
    }

    const updatedUser = await this.prismaService.user.update({
      where: { username: user.username },
      data: {
        username: username || user.username,
        profileImage: `/users/${dto.profileImage.filename}`,
        ...(password && { password }),
      },
    });

    return this.responseService.success(updatedUser);
  }

  async leaderboard(): Promise<IResponse> {
    this.responseService.start();

    const users: User[] = await this.prismaService.user.findMany({
      orderBy: {
        watchedMovies: {
          _count: 'desc',
        },
      },
      include: {
        watchedMovies: true,
      },
    });

    return this.responseService.success(users);
  }
}
