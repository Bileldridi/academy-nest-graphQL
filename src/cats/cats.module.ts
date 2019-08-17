import { Module } from '@nestjs/common';
import { CatsResolvers } from './cats.resolver';
import { CatsService } from './cats.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CatSchema } from './schema/cat.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Cat', schema: CatSchema }]),],
  providers: [CatsResolvers, CatsService]
})
export class CatsModule { }
