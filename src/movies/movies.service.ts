import { Injectable } from '@nestjs/common';
import { Movie } from '@prisma/client';
import ResponseService from 'src/common/response/response.service';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';

@Injectable()
export class MoviesService {
  constructor(
    private readonly responseService: ResponseService,
    private readonly prismaService: PrismaService,
  ) {}

  async search(text: string) {
    this.responseService.start();

    const movies: Movie[] = await this.prismaService.movie.findMany({
      where: { title: { contains: text } },
    });

    return this.responseService.success(movies);
  }

  async create(dto: CreateMovieDto) {
    this.responseService.start();

    const movie: Movie = await this.prismaService.movie.create({
      data: {
        title: dto.title,
        releaseYear: dto.releaseYear,
        duration: dto.duration,
        director: dto.director,
        description: dto.description,
        genres: dto.genres,
        posterUrl: dto.posterUrl,
      },
    });

    return this.responseService.success(movie);
  }
}
