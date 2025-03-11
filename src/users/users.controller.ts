import {
  Controller,
  Get,
  Session,
  UseGuards,
  Param,
  Body,
  Put,
  Req,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { ISession } from 'src/common/interfaces/session.interface';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileType } from 'src/common/enums/filetype.enums';

import { FastifyRequest } from 'fastify';

@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @Roles('user')
  profile(@Session() session: ISession) {
    return this.userService.profile(session.user.username);
  }

  @Put()
  @Roles('user')
  async UpdateProfile(@Body() dto: UpdateUserDto) {
    const data = await dto.profileImage; // Получаем файл
    if (data && !FileType.IMAGE.includes(data.mimetype))
      return { error: 'Invalid file type' };

    // Передаем все данные в сервис
    return this.userService.updateProfile(dto);
  }

  @Get(':id')
  @Roles('user')
  profileById(@Param('username') username: string) {
    return this.userService.profile(username);
  }
}
