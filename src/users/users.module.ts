import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from '../common/strategy/jwt.strategy';
import { CoachSchema } from '../coaches/schemas/coaches.schema';
import { CandidateSchema } from '../candidate/schemas/candidates.schema';
import { CemeterySchema } from '../common/schemas/cemetery.schema';
import { CourseSchema } from '../courses/schemas/course.schema';
import { ChapterSchema } from '../courses/schemas/chapter.schema';
import { SettingsSchema } from '../common/settings/settings.schema';
import { BanSchema } from './schemas/ban.schema';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import * as Redis from 'ioredis';
// import { PassportModule } from '@nestjs/passport';
// import { JwtService, JwtModule } from '@nestjs/jwt';
const redishost = process.env.redishost || 'localhost';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema }]),
    MongooseModule.forFeature([{ name: 'Chapter', schema: ChapterSchema }]),
    MongooseModule.forFeature([{ name: 'Coach', schema: CoachSchema }]),
    MongooseModule.forFeature([{ name: 'Candidate', schema: CandidateSchema }]),
    MongooseModule.forFeature([{ name: 'Cemetery', schema: CemeterySchema }]),
    MongooseModule.forFeature([{ name: 'Settings', schema: SettingsSchema }]),
    MongooseModule.forFeature([{ name: 'Ban', schema: BanSchema }]),
    // PassportModule.register({
    //   defaultStrategy: 'jwt',
    // }),
    // JwtModule.register({
    //   secret: '9e14a20fd9e14a20fdcd049bba10340aa0de93ddc118c89e14a20',
    //   signOptions: {
    //     expiresIn: 3600, // 1 hour
    //   }
    // }),
  ],

  providers: [UsersResolver, UsersService, JwtStrategy,
    {
    provide: 'PUB_SUB',
    useFactory: () => {
      const options = {
        host: redishost,
        port: 6379
      };

      return new RedisPubSub({
        publisher: new Redis(options),
        subscriber: new Redis(options),
      });
    }
  }],
  controllers: [],
})
export class UsersModule { }
