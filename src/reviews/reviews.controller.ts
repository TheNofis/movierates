import { Controller, Get, Body, Param, Delete, Put } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { UpdateReviewDto } from './dto/update-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  GetAll() {
    return this.reviewsService.findAll();
  }

  @Get('user')
  GetUser(@Param('id') id: string) {
    return this.reviewsService.findAll();
  }

  @Get('movie')
  GetMovie(@Param('id') id: string) {
    return this.reviewsService.findAll();
  }

  @Get('latest')
  GetLatest(@Param('limit') limit: number) {
    return this.reviewsService.findAll();
  }

  @Put(':id')
  Update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewsService.update(id, updateReviewDto);
  }

  @Delete(':id')
  Remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}
