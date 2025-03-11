import { SetMetadata } from '@nestjs/common';

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}

export const DECORATOR_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(DECORATOR_KEY, roles);
