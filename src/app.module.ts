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

const dbhost = process.env.dbhost || 'localhost';

@Module({
  imports: [
    CatsModule,
    // ScheduleModule.forRoot(),
    CommonModule,
    MongooseModule.forRoot('mongodb://' + dbhost + ':27017/academyDb', { useNewUrlParser: true }),
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
    CoursesModule
  ],
  providers: [],

})
export class AppModule { }
