import { IsString } from 'class-validator';

export class RegisterAuthDto {
  @IsString()
  identifier: string;

  @IsString()
  password: string;
}
