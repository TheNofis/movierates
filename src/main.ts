import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { RedisService } from './databases/redis/redis.service';
import { RedisStore } from 'connect-redis';

import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import fastifyMultipart from '@fastify/multipart';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors();
  app.setGlobalPrefix('api/v1');

  const redisService = app.get(RedisService);
  const redisStore = new RedisStore({
    client: redisService.getClient(),
    ttl: 60 * 5,
  });

  await app.register(fastifyCookie);
  await app.register(fastifySession, {
    secret: 'kdfgnkldfgkndfgkndfgknldfgknldfdfg',
    store: redisStore,
    cookie: { secure: false }, // Установите true в продакшене
    saveUninitialized: false,
  });

  await app.register(fastifyCookie, {
    secret: 'kdfgnkldfgkndfgkndfgknldfgknldfdfg',
  });

  await app.register(fastifyMultipart, {
    limits: { fileSize: 5 * 1024 * 1024 },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
