import {
  Controller,
  Get,
  Body,
  Param,
  UseGuards,
  Session,
  Post,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ISession } from 'src/common/interfaces/session.interface';
import { CreateReviewDto } from './dto/create-review.dto';

@UseGuards(RolesGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('user')
  @Roles(Role.user)
  GetForUser(@Session() session: ISession) {
    return this.reviewsService.forUser(session.user.id);
  }

  @Get('movie/:id')
  GetForMovie(@Param('id') id: string) {
    return this.reviewsService.forMovie(id);
  }

  @Post('movie/:id')
  @Roles(Role.user)
  Create(
    @Param('id') movieId: string,
    @Session() session: ISession,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.create(session.user.id, movieId, dto);
  }
  //
  // @Get('movie')
  // GetMovie(@Param('id') id: string) {
  //   return this.reviewsService.findAll();
  // }
  //
  // @Get('latest')
  // GetLatest(@Param('limit') limit: number) {
  //   return this.reviewsService.findAll();
  // }
  //
  // @Put(':id')
  // Update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
  //   return this.reviewsService.update(id, updateReviewDto);
  // }
  //
  // @Delete(':id')
  // Remove(@Param('id') id: string) {
  //   return this.reviewsService.remove(id);
  // }
}
