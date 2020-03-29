import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { UserSchema } from './schemas/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from '../common/strategy/jwt.strategy';
import { CoachSchema } from '../coaches/schemas/coaches.schema';
import { CandidateSchema } from '../candidate/schemas/candidates.schema';
// import { PassportModule } from '@nestjs/passport';
// import { JwtService, JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Coach', schema: CoachSchema }]),
    MongooseModule.forFeature([{ name: 'Candidate', schema: CandidateSchema }]),
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

  providers: [UsersResolver, UsersService, JwtStrategy],
  controllers: [],
})
export class UsersModule { }
