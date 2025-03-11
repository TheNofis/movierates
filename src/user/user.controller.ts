import { Controller, Get, Session, UseGuards, Param } from '@nestjs/common';

import { UserService } from './user.service';
import { ISession } from 'src/common/interfaces/session.interface';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('user')
@UseGuards(RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles('user')
  profile(@Session() session: ISession) {
    return this.userService.profile(session.user.id);
  }

  @Get(':id')
  @Roles('user')
  profileById(@Param('id') id: string) {
    return this.userService.profile(id);
  }
}
