import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import * as csurf from 'csurf';
import * as helmet from 'helmet';
import * as rateLimit from 'fastify-rate-limit';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );

  // app.register(rateLimit, {
  //   max: 100,
  //   timeWindow: '1 minute',
  // })
  // app.use(helmet());
  app.use(cookieParser());

  // app.use(csurf({ cookie: false }));

  await app.listen(3000, '0.0.0.0');
}
bootstrap();