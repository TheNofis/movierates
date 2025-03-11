export class UpdateUserDto {
  username?: { value: string };
  profileImage?: any;
  password?: { value: string };
  currentPassword?: { value: string };
}
