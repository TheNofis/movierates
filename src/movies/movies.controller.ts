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
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { FileType } from 'src/common/enums/filetype.enums';

@Controller('movies')
export class MoviesController {
  constructor(private readonly movieService: MoviesService) {}

  @Get()
  GetAll() {
    return this.movieService.getAll();
  }

  @Get(':id')
  GetCurrent(@Query('id') id: string) {
    return this.movieService.getCurrent(id);
  }

  @Get('search')
  @UsePipes(new ValidationPipe())
  search(@Query('text') text: string) {
    return this.movieService.search(text);
  }

  @Post()
  @Roles(Role.user)
  async create(@Body() dto: CreateMovieDto) {
    const data = await dto.poster;
    if (!data) return { error: 'No file uploaded' };

    if (!FileType.IMAGE.includes(data.mimetype))
      return { error: 'Invalid file type' };

    return this.movieService.create(dto);
  }

  @Put(':id')
  update(@Req() request: FastifyRequest, @Body() dto: CreateMovieDto) {
    // return this.movieService.update(dto);
  }

  @Delete(':id')
  Delete(@Query('id') id: string) {
    return this.movieService.delete(id);
  }
}
