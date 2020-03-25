import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from '../common/strategy/jwt.strategy';
import { CoachSchema } from '../coaches/schemas/coaches.schema';
import { CandidateSchema } from '../candidate/schemas/candidates.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
            MongooseModule.forFeature([{ name: 'Coach', schema: CoachSchema }]),
            MongooseModule.forFeature([{ name: 'Candidate', schema: CandidateSchema }])],
  providers: [UsersResolver, UsersService, JwtStrategy],
  controllers: [],
})
export class UsersModule { }
