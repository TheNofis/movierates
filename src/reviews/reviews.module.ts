import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import ResponseService from 'src/common/response/response.service';
import { PrismaService } from 'src/databases/prisma/prisma.service';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService, ResponseService, PrismaService],
})
export class ReviewsModule {}
