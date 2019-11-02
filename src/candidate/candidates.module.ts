import { Module } from '@nestjs/common';
import { CandidatesResolver } from './candidates.resolver';
import { CandidatesService } from './candidates.service';
import { CandidateSchema } from './schemas/candidates.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../users/schemas/user.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Candidate', schema: CandidateSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  providers: [CandidatesResolver, CandidatesService],
})
export class CandidatesModule { }
