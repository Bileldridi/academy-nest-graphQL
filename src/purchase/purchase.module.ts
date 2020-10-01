import { ModuleSchema } from './../courses/schemas/module.schema';
import { ProgressSchema } from './../courses/schemas/progress.schema';
import { CommentSchema } from './../courses/schemas/comment.schema';
import { ChapterSchema } from './../courses/schemas/chapter.schema';
import { SessionSchema } from './../sessions/schemas/sessions.schema';
import { CoursesService } from './../courses/courses.service';
import { Module, HttpModule } from '@nestjs/common';
import { PurchaseResolver } from './purchase.resolver';
import { PurchaseService } from './purchase.service';
import { OrderSchema } from './schemas/order.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CemeterySchema } from '../common/schemas/cemetery.schema';
import { UserSchema } from '../users/schemas/user.schema';
import { AccessSchema } from '../courses/schemas/access.schema';
import { CourseSchema } from '../courses/schemas/course.schema';
import { LevelSchema } from '../courses/schemas/level.schema';
import { PurchaseController } from './purchase.controller';

@Module({
  controllers: [PurchaseController],
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: 'Cemetery', schema: CemeterySchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Access', schema: AccessSchema }]),
    MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema }]),
    MongooseModule.forFeature([{ name: 'Level', schema: LevelSchema }]),
    MongooseModule.forFeature([{ name: 'Session', schema: SessionSchema }]),
    MongooseModule.forFeature([{ name: 'Chapter', schema: ChapterSchema }]),
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: 'Progress', schema: ProgressSchema }]),
    MongooseModule.forFeature([{ name: 'Module', schema: ModuleSchema }]),
    HttpModule
  ],
  providers: [PurchaseResolver, PurchaseService, CoursesService]
})
export class PurchaseModule { }
