import { Module } from '@nestjs/common';
import { CoachesResolver } from './coaches.resolver';
import { CoachesService } from './coaches.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../users/schemas/user.schema';
import { CoachSchema } from './schemas/coaches.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Coach', schema: CoachSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  providers: [CoachesResolver, CoachesService],
})
export class CoachesModule {
}
