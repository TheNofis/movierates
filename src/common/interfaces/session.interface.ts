import { User } from '@prisma/client';
import { FastifyRequest } from 'fastify';

export type ISession = FastifyRequest['session'] & { user: User };
