import { Injectable } from '@nestjs/common';
import { UpdateReviewDto } from './dto/update-review.dto';
import ResponseService, {
  IResponse,
} from 'src/common/response/response.service';
import { PrismaService } from 'src/databases/prisma/prisma.service';
import { Comment, Movie, User } from '@prisma/client';
import { Nullable } from 'src/common/interfaces/nullable.interface';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly responseService: ResponseService,
    private readonly prismaService: PrismaService,
  ) {}
  async forUser(id: string): Promise<IResponse> {
    this.responseService.start();

    const user: Nullable<User & { comments: Comment[] }> =
      await this.prismaService.user.findUnique({
        where: { id },
        include: { comments: true },
      });

    if (user === null) return this.responseService.error('User not found');
    const { comments, ...userNoComments } = user;

    return this.responseService.success(comments);
  }

  async forMovie(id: string): Promise<IResponse> {
    this.responseService.start();

    const movie: Nullable<Movie & { comments: Comment[] }> =
      await this.prismaService.movie.findUnique({
        where: { id },
        include: { comments: true },
      });

    if (movie === null) return this.responseService.error('Movie not found');

    const { comments, ...movieNoComments } = movie;

    return this.responseService.success(comments);
  }

  async create(
    userId: string,
    movieId: string,
    dto: CreateReviewDto,
  ): Promise<IResponse> {
    this.responseService.start();

    // TODO: user average score, movie average score
    const comment: Comment = await this.prismaService.comment.create({
      data: {
        ...dto,
        date: new Date(),
        watchDate: new Date(dto.watchDate),
        movieId: movieId,
        userId: userId,
      },
    });

    return this.responseService.success(comment);
  }

  // TODO: user average score, movie average score
  async update(id: string, dto: UpdateReviewDto): Promise<IResponse> {
    this.responseService.start();

    const comment: Nullable<Comment> = await this.prismaService.comment.update({
      where: { id },
      data: dto,
    });

    return this.responseService.success(comment);
  }

  // TODO: user average score, movie average score
  async remove(id: string): Promise<IResponse> {
    this.responseService.start();

    await this.prismaService.comment.delete({ where: { id } });

    return this.responseService.success();
  }

  async latest(limit: number): Promise<IResponse> {
    this.responseService.start();

    const comments: Comment[] = await this.prismaService.comment.findMany({
      orderBy: { date: 'desc' },
      take: limit,
    });

    return this.responseService.success(comments);
  }
}
