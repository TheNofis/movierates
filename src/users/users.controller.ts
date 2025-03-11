import {
  Controller,
  Get,
  Session,
  UseGuards,
  Param,
  Body,
  Put,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { ISession } from 'src/common/interfaces/session.interface';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { FileType } from 'src/common/enums/filetype.enums';
import { Role } from '@prisma/client';

@Controller('users')
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('profile')
  @Roles(Role.user)
  profile(@Session() session: ISession) {
    return this.userService.profile(session.user.username);
  }

  @Put()
  @Roles(Role.user)
  async UpdateProfile(@Body() dto: UpdateUserDto) {
    const data = await dto.profileImage;
    if (data && !FileType.IMAGE.includes(data.mimetype))
      return { error: 'Invalid file type' };

    return this.userService.updateProfile(dto);
  }

  @Get(':id')
  profileById(@Param('username') username: string) {
    return this.userService.profile(username);
  }

  @Get('leaderboard')
  leaderboard() {
    return this.userService.leaderboard();
  }
}
