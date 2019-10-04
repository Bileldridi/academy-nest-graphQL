import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { CatsModule } from './cats/cats.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesModule } from './courses/courses.module';
import { PoolsModule } from './pools/pools.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    CatsModule,
    MongooseModule.forRoot('mongodb://192.168.84.179:27017/academyDb'),
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      installSubscriptionHandlers: true,
      playground: true,
    }),
    CoursesModule,
    PoolsModule,
    UsersModule,
  ],
  providers: [],

})
export class AppModule { }
