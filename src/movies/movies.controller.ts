import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';

import { FastifyRequest } from 'fastify';

@Controller('movies')
export class MoviesController {
  constructor(private readonly movieService: MoviesService) {}

  @Get()
  getAll() {
    // return this.movieService.getAll();
  }

  @Get(':id')
  getCurrent(@Query('id') id: string) {
    // return this.movieService.search();
  }

  @Get('search')
  @UsePipes(new ValidationPipe())
  search(@Query('text') text: string) {
    return this.movieService.search(text);
  }

  @Post()
  async create(@Body() dto: CreateMovieDto) {
    const data = await dto.file; // Получаем файл
    if (!data) return { error: 'No file uploaded' };

    // Проверяем тип файла
    if (
      !['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(
        data.mimetype,
      )
    )
      return { error: 'Invalid file type' };

    // Передаем все данные в сервис
    return this.movieService.create(dto);
  }
  @Put(':id')
  update(@Req() request: FastifyRequest, @Body() dto: CreateMovieDto) {
    // return this.movieService.update(dto);
  }

  @Delete(':id')
  remove(@Body() dto: CreateMovieDto) {
    // return this.movieService.remove(dto);
  }
}
