import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { DECORATOR_KEY } from '../decorators/roles.decorator';
import { Reflector } from '@nestjs/core';

import { FastifyRequest } from 'fastify';

interface IExtendedRequest extends FastifyRequest {
  session: any;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles: string[] = this.reflector.get<string[]>(
      DECORATOR_KEY,
      context.getHandler(),
    );

    if (!requiredRoles) throw new ForbiddenException("You don't have access");

    const request: IExtendedRequest = context.switchToHttp().getRequest();

    if (!request.session.user)
      throw new ForbiddenException("You're not logged in");
    if (!requiredRoles.includes(request.session.user.role))
      throw new ForbiddenException("You don't have access");

    return true;
  }
}
