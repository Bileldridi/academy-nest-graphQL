import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { CoursesResolver } from './courses.resolver';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService, CoursesResolver]
})
export class CoursesModule { }
