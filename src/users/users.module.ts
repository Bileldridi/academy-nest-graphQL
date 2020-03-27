import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from '../common/strategy/jwt.strategy';
import { CoachSchema } from '../coaches/schemas/coaches.schema';
import { CandidateSchema } from '../candidate/schemas/candidates.schema';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { GraphqlAuthGuard } from './gql.auth.guard';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  MongooseModule.forFeature([{ name: 'Coach', schema: CoachSchema }]),
  MongooseModule.forFeature([{ name: 'Candidate', schema: CandidateSchema }]),
  // JwtModule.register({ secret: 'asd' }),
  PassportModule.register({
    defaultStrategy: 'jwt',
  }),
  JwtModule.register({
    secret: 'asd',
    signOptions: {
      expiresIn: 3600, // 1 hour
    },
  }),
  ],

  providers: [UsersResolver, UsersService, JwtStrategy, GraphqlAuthGuard],
  controllers: [],
})
export class UsersModule { }
