import { Injectable } from '@nestjs/common';
import { Movie } from '@prisma/client';
import ResponseService, {
  IResponse,
} from 'src/common/response/response.service';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { CreateMovieDto } from './dto/create-movie.dto';

import * as path from 'path';
import * as fs from 'fs';

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

    const uploadDir = path.join(__dirname, '../..', 'public', 'movies');

    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    let fileSize = 0;
    dto.file.file.on('data', (chunk: Buffer) => (fileSize += chunk.length));

    dto.file.filename = `banner-${title}${path.extname(dto.file.filename)}`;

    return new Promise((resolve, reject) => {
      const writeStream = fs.createWriteStream(
        path.join(uploadDir, dto.file.filename),
      );

      dto.file.file.pipe(writeStream);

      writeStream.on('error', () => {
        reject(this.responseService.error('File upload failed'));
      });
      writeStream.on('finish', () => {
        if (fileSize > MAX_FILE_SIZE) {
          fs.unlinkSync(path.join(uploadDir, dto.file.filename));
          reject(this.responseService.error('File size is too large'));
        }
        resolve(this.responseService.success(dto.file.filename));
      });
    })
      .then(async () => {
        const movie: Movie = await this.prismaService.movie.create({
          data: {
            title: title,
            releaseYear: +releaseYear,
            duration: duration,
            director: director,
            description: description,
            genres: genres,
            posterUrl: `/movies/${dto.file.filename}`,
          },
        });

        return this.responseService.success(movie);
      })
      .catch((error: IResponse) => error);
  }
}
