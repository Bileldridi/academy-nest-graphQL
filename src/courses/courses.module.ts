import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesResolver } from './courses.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseSchema } from './schemas/course.schema';
import { SessionSchema } from '../sessions/schemas/sessions.schema';
import { UserSchema } from '../users/schemas/user.schema';
import { LevelSchema } from './schemas/level.schema';
import { CommentSchema } from './schemas/comment.schema';
import { ChapterSchema } from './schemas/chapter.schema';
import { AccessSchema } from './schemas/access.schema';
import { GraphqlAuthGuard } from '../common/guards/gql.auth.guard';
import { ProgressSchema } from './schemas/progress.schema';
import { CemeterySchema } from '../common/schemas/cemetery.schema';
import { ModuleSchema } from './schemas/module.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Session', schema: SessionSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Chapter', schema: ChapterSchema }]),
    MongooseModule.forFeature([{ name: 'Level', schema: LevelSchema }]),
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema }]),
    MongooseModule.forFeature([{ name: 'Access', schema: AccessSchema }]),
    MongooseModule.forFeature([{ name: 'Progress', schema: ProgressSchema }]),
    MongooseModule.forFeature([{ name: 'Cemetery', schema: CemeterySchema }]),
    MongooseModule.forFeature([{ name: 'Module', schema: ModuleSchema }]),
    
  ],
  providers: [CoursesService, CoursesResolver, GraphqlAuthGuard],

})
export class CoursesModule { }
