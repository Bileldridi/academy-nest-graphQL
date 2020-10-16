import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { CatsModule } from './cats/cats.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { SessionsModule } from './sessions/sessions.module';
import { CoachesModule } from './coaches/coaches.module';
import { CandidatesModule } from './candidate/candidates.module';
import { CoursesModule } from './courses/courses.module';
import { CommonModule } from './common/common.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AppResolver } from './app.resolver';
import { PurchaseModule } from './purchase/purchase.module';
import { ChatModule } from './chat/chat.module';
import { CertificateModule } from './certificate/certificate.module';

const dbhost = process.env.dbhost || 'localhost';

@Module({
  imports: [
    CatsModule,
    ScheduleModule.forRoot(),
    CommonModule,
    MongooseModule.forRoot('mongodb://admin:FivePoints2020@5955fc2a-3bf5-4e0e-b684-ddb6ebe7bfd4-0.br38q28f0334iom5lv4g.databases.appdomain.cloud:30898,5955fc2a-3bf5-4e0e-b684-ddb6ebe7bfd4-1.br38q28f0334iom5lv4g.databases.appdomain.cloud:30898/academyDb?authSource=admin&replicaSet=replset&tlsCAFile=/app/ssl/mongo.key', { useNewUrlParser: true, useUnifiedTopology: true }),
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      installSubscriptionHandlers: true,
      playground: true,
      cors: true,
      context: ({ req, res }) => {
        return {
          request: req,
          response: res
        }
      },
      introspection: true,
    }),
    UsersModule,
    SessionsModule,
    CoachesModule,
    CandidatesModule,
    CoursesModule,
    PurchaseModule,
    CertificateModule,
    ChatModule,
  ],
  providers: [AppResolver],

})
export class AppModule { }
