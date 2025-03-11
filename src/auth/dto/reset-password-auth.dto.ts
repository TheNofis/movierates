import { IsString } from 'class-validator';

export class ResetPasswordAuthDto {
  @IsString()
  oldPassword: string;

  @IsString()
  newPassword: string;
}
