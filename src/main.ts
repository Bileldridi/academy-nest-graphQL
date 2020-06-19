import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import * as csurf from 'csurf';
import * as helmet from 'helmet';
import * as rateLimit from 'fastify-rate-limit';
import * as cookieParser from 'cookie-parser';
import * as fp from 'fastify-plugin';
import * as  multiparty from 'multiparty';

async function bootstrap() {

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true, })
  );

  // app.register(require('fastify-multipart'))


  app.register(fp(async function (fastify, opts, next) {
    fastify.addContentTypeParser('multipart/form-data', { parseAs: 'string' }, function (req, body, done) {
      try {
        console.log(body);
        var form = new multiparty.Form();
        form.parse(req, function (err, fields, files) {
          console.log(err);
          console.log(fields);
          console.log(files);
        });

        var json = JSON.parse(body)
        done(null, json)
      } catch (err) {
        err.statusCode = 400
        done(err, undefined)
      }
    })
  }))

  // app.addContentTypeParser('application/json', { parseAs: 'string' }, function (req, body, done) {
  //   try {
  //     var json = JSON.parse(body)
  //     done(null, json)
  //   } catch (err) {
  //     err.statusCode = 400
  //     done(err, undefined)
  //   }
  // })


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
