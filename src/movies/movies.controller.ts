import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly movieService: MoviesService) {}

  @Get('search')
  @UsePipes(new ValidationPipe())
  search(@Query('text') text: string) {
    return this.movieService.search(text);
  }
}
