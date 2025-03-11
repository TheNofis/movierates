import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  title: string;

  @IsNumber()
  releaseYear: number;

  @IsString()
  duration: string;

  @IsString()
  director: string;

  @IsString()
  description: string;

  @IsArray()
  genres: string[];

  @IsString()
  posterUrl: string;
}
