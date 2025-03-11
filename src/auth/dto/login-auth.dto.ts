import { IsString } from 'class-validator';

export class LoginAuthDto {
  @IsString()
  identifier: string;

  @IsString()
  password: string;
}
