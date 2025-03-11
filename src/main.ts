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

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors();
  app.setGlobalPrefix('api/v1');

  await app.register(fastifyCookie);

  const redisService = app.get(RedisService);

  const redisStore = new RedisStore({
    client: redisService.getClient(),
    ttl: 60 * 5,
  });

  await app.register(fastifySession, {
    secret: 'kdfgnkldfgkndfgkndfgknldfgknldfdfg',
    store: redisStore,
    cookie: { secure: false }, // Установите true в продакшене
    saveUninitialized: false,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
