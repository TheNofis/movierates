import { Injectable } from '@nestjs/common';
import { Movie } from '@prisma/client';
import ResponseService, {
  IResponse,
} from 'src/common/response/response.service';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';

import * as path from 'path';
import * as fs from 'fs';
import { pipeline } from 'stream/promises';

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
    const {
      title,
      releaseYear,
      duration,
      director,
      description,
      genres,
    }: {
      title: string;
      releaseYear: string;
      duration: string;
      director: string;
      description: string;
      genres: string[];
    } = {
      title: dto.title.value.replaceAll(' ', '%20'),
      releaseYear: dto.releaseYear.value,
      duration: dto.duration.value,
      director: dto.director.value,
      description: dto.description.value,
      genres: JSON.parse(dto.genres.value.replace(/'/g, '"')),
    };

    try {
      const uploadDir = path.join(__dirname, '../..', 'public', 'movies');
      if (!fs.existsSync(uploadDir))
        fs.mkdirSync(uploadDir, { recursive: true });

      const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
      dto.poster.filename = `banner-${title}${path.extname(dto.poster.filename)}`;

      const fileBuffer = await dto.poster.toBuffer();
      if (fileBuffer.length > MAX_FILE_SIZE)
        throw new Error('File size is too large');

      fs.writeFileSync(path.join(uploadDir, dto.poster.filename), fileBuffer);
    } catch (error) {
      return this.responseService.error(error.message);
    }

    const movie: Movie = await this.prismaService.movie.create({
      data: {
        title: title,
        releaseYear: +releaseYear,
        duration: duration,
        director: director,
        description: description,
        genres: genres,
        posterUrl: `/movies/${dto.poster.filename}`,
      },
    });

    return this.responseService.success(movie);
  }
}
